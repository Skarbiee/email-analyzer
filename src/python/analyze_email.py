#!/usr/bin/env python
# -*- coding: utf-8 -*-

import argparse
import json
import re
import os
import sys
from datetime import datetime, timedelta

# Vérifier si nous sommes dans un environnement qui a accès aux modèles Transformers
try:
    from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
    import torch
    import numpy as np
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    print("Warning: Transformers package not available. Using fallback mode.", file=sys.stderr)

# Tenter de charger les paramètres de config.php
# Pour cela, on crée une fonction simple qui va lire le contenu du fichier
# et extraire les valeurs dont on a besoin
def read_php_config():
    """
    Lit les paramètres pertinents de config.php
    """
    config = {}
    
    # Chemin relatif vers config.php depuis le répertoire du script actuel
    config_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'config.php')
    
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Extraire les modèles avec des expressions régulières
            model_match = re.search(r"'models'\s*=>\s*\[\s*'intent_classifier'\s*=>\s*'([^']+)'", content)
            if model_match:
                config['intent_classifier_model'] = model_match.group(1)
                
            model_match = re.search(r"'models'\s*=>\s*\[.*?'ner_model'\s*=>\s*'([^']+)'", content, re.DOTALL)
            if model_match:
                config['ner_model'] = model_match.group(1)
                
            model_match = re.search(r"'models'\s*=>\s*\[.*?'language_detector'\s*=>\s*'([^']+)'", content, re.DOTALL)
            if model_match:
                config['language_detector_model'] = model_match.group(1)
            
            # Extraire la langue par défaut
            lang_match = re.search(r"'default_language'\s*=>\s*'([^']+)'", content)
            if lang_match:
                config['default_language'] = lang_match.group(1)
    except Exception as e:
        print(f"Warning: Could not read config.php: {e}", file=sys.stderr)
    
    # Valeurs par défaut si on n'a pas pu les récupérer
    if 'intent_classifier_model' not in config:
        config['intent_classifier_model'] = 'distilbert-base-uncased'
    if 'ner_model' not in config:
        config['ner_model'] = 'jean-baptiste/camembert-ner'
    if 'language_detector_model' not in config:
        config['language_detector_model'] = 'papluca/xlm-roberta-base-language-detection'
    if 'default_language' not in config:
        config['default_language'] = 'fr'
        
    return config

# Charger la configuration
CONFIG = read_php_config()

class EmailAnalyzer:
    def __init__(self):
        # Conservation des patterns regex pour les cas simples
        # et comme fallback si le modèle n'est pas disponible
        self.fr_time_patterns = {
            'jours': r'(?:dans|après|d\'ici|prochain(?:e)?s?|suivant(?:e)?s?)\s+(\d+)\s+jours?',
            'semaines': r'(?:dans|après|d\'ici|prochain(?:e)?s?|suivant(?:e)?s?)\s+(\d+)\s+semaines?',
            'mois': r'(?:dans|après|d\'ici|prochain(?:e)?s?|suivant(?:e)?s?)\s+(\d+)\s+mois',
            'demain': r'demain',
            'semaine_prochaine': r'(?:la\s+)?semaine\s+prochaine',
            'mois_prochain': r'(?:le\s+)?mois\s+prochain',
        }
        
        self.en_time_patterns = {
            'days': r'(?:in|after|within|next|following)\s+(\d+)\s+days?',
            'weeks': r'(?:in|after|within|next|following)\s+(\d+)\s+weeks?',
            'months': r'(?:in|after|within|next|following)\s+(\d+)\s+months?',
            'tomorrow': r'tomorrow',
            'next_week': r'next\s+week',
            'next_month': r'next\s+month',
        }
        
        # Initialisation des modèles Transformers uniquement si disponibles
        if TRANSFORMERS_AVAILABLE:
            try:
                # 1. Modèle pour la classification d'intention (besoin de relance ou non)
                self.intent_classifier = pipeline(
                    "text-classification", 
                    model=CONFIG['intent_classifier_model'], 
                    device=-1  # CPU
                )
                
                # 2. Modèle pour l'extraction d'entités temporelles
                self.ner_model = pipeline(
                    "token-classification", 
                    model=CONFIG['ner_model'], 
                    device=-1
                )
                
                # 3. Modèle pour la détection de langue
                self.language_detector = pipeline(
                    "text-classification", 
                    model=CONFIG['language_detector_model'], 
                    device=-1
                )
                
                self.transformers_loaded = True
            except Exception as e:
                print(f"Warning: Failed to load Transformers models: {e}", file=sys.stderr)
                self.transformers_loaded = False
        else:
            self.transformers_loaded = False

    def detect_language(self, text):
        """
        Détecte la langue du texte en utilisant le modèle de transformers ou une méthode fallback
        """
        if self.transformers_loaded:
            try:
                # Limitons la taille du texte pour éviter les problèmes de mémoire
                truncated_text = text[:1024]
                result = self.language_detector(truncated_text)
                
                # Correspondance des labels de langue
                lang_map = {
                    'en': 'en',
                    'fr': 'fr',
                    'english': 'en',
                    'french': 'fr'
                }
                
                lang = result[0]['label'].lower()
                return lang_map.get(lang, CONFIG['default_language'])
            except Exception as e:
                print(f"Error in language detection: {e}", file=sys.stderr)
                # Fallback: détection basique
        
        # Méthode fallback si Transformers n'est pas disponible ou a échoué
        french_indicators = ['je', 'nous', 'vous', 'le', 'la', 'les', 'bonjour', 'merci']
        for word in french_indicators:
            if re.search(r'\b' + word + r'\b', text.lower()):
                return 'fr'
        return 'en'  # Default to English if unsure

    def detect_follow_up_intent(self, text):
        """
        Détecte si l'email nécessite une relance en utilisant un modèle de classification
        ou des expressions régulières
        """
        # Expressions régulières pour la détection explicite de demandes de relance
        fr_relance_patterns = [
            r'(?:me|nous) (?:rappeler|recontacter|rappelle[rz]|recontacte[rz])',
            r'(?:je|nous) (?:vous|te) (?:recontacterai|rappellerai)',
            r'(?:pourriez-vous|pourrais-tu) (?:me|nous) (?:recontacter|rappeler)',
            r'(?:relance[rz]?|relancer|suivre|suivi)',
        ]
        
        en_relance_patterns = [
            r'(?:remind|contact|call|get back to) (?:me|us)',
            r'(?:I|we) (?:will|shall|\'ll) (?:contact|call|get back to) (?:you)',
            r'(?:could you|can you) (?:remind|contact|call|get back to) (?:me|us)',
            r'(?:follow[- ]?up|reminder)',
        ]
        
        # Vérification par expressions régulières d'abord
        for pattern in fr_relance_patterns + en_relance_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                return True
        
        # Si on n'a pas trouvé de pattern explicite et que Transformers est disponible
        if self.transformers_loaded:
            try:
                # Limitons la taille du texte pour éviter les problèmes de mémoire
                truncated_text = text[:1024]
                
                # Utilisation du modèle de classification
                result = self.intent_classifier(truncated_text)
                
                # Analyse simplifiée du sentiment/intention
                label = result[0]['label'].lower()
                score = result[0]['score']
                
                # Si le modèle indique un sentiment positif avec une confiance élevée,
                # et qu'il y a des mots ou expressions liés au temps, c'est probablement une relance
                has_time_ref = any(re.search(pattern, text, re.IGNORECASE) 
                                for pattern_dict in [self.fr_time_patterns, self.en_time_patterns] 
                                for pattern in pattern_dict.values())
                
                if (('positive' in label and score > 0.7 and has_time_ref) or 
                    'follow' in text.lower() or 'relance' in text.lower()):
                    return True
            except Exception as e:
                print(f"Error in intent detection: {e}", file=sys.stderr)
        
        # Si on arrive ici, on n'a pas détecté de demande de relance
        return False

    def extract_time_reference(self, text, language):
        """
        Extrait les références temporelles du texte en utilisant NER et expressions régulières
        """
        now = datetime.now()
        follow_up_date = None
        time_reference = None
        has_time_reference = False
        
        # Utilisation du modèle NER si disponible
        if self.transformers_loaded:
            try:
                # Utilisation du modèle NER pour extraire les entités temporelles
                ner_results = self.ner_model(text)
                
                # Grouper les entités qui se suivent
                time_entities = []
                current_entity = None
                
                for entity in ner_results:
                    if entity['entity'].startswith('B-DATE') or entity['entity'].startswith('B-TIME'):
                        if current_entity:
                            time_entities.append(current_entity)
                        current_entity = entity['word']
                    elif entity['entity'].startswith('I-DATE') or entity['entity'].startswith('I-TIME'):
                        if current_entity:
                            current_entity += ' ' + entity['word']
                    else:
                        if current_entity:
                            time_entities.append(current_entity)
                            current_entity = None
                
                if current_entity:
                    time_entities.append(current_entity)
                
                # Analyser les entités temporelles trouvées
                for entity in time_entities:
                    entity_lower = entity.lower()
                    
                    # Analyse basique des entités temporelles selon la langue
                    if language == 'fr':
                        if 'demain' in entity_lower:
                            follow_up_date = now + timedelta(days=1)
                            time_reference = "demain"
                            has_time_reference = True
                        elif 'semaine prochaine' in entity_lower or 'prochaine semaine' in entity_lower:
                            follow_up_date = now + timedelta(days=7)
                            time_reference = "semaine prochaine"
                            has_time_reference = True
                        elif 'mois prochain' in entity_lower or 'prochain mois' in entity_lower:
                            follow_up_date = now + timedelta(days=30)
                            time_reference = "mois prochain"
                            has_time_reference = True
                    else:  # Anglais par défaut
                        if 'tomorrow' in entity_lower:
                            follow_up_date = now + timedelta(days=1)
                            time_reference = "tomorrow"
                            has_time_reference = True
                        elif 'next week' in entity_lower:
                            follow_up_date = now + timedelta(days=7)
                            time_reference = "next week"
                            has_time_reference = True
                        elif 'next month' in entity_lower:
                            follow_up_date = now + timedelta(days=30)
                            time_reference = "next month"
                            has_time_reference = True
                    
                    # Si on n'a pas encore trouvé de référence temporelle, 
                    # chercher des patterns comme "dans X jours/semaines/mois"
                    if not has_time_reference:
                        if language == 'fr':
                            for time_type, pattern in self.fr_time_patterns.items():
                                matches = re.findall(pattern, entity_lower)
                                if matches and matches[0]:
                                    has_time_reference = True
                                    if time_type == 'jours':
                                        days = int(matches[0])
                                        follow_up_date = now + timedelta(days=days)
                                        time_reference = f"{days} jours"
                                    elif time_type == 'semaines':
                                        weeks = int(matches[0])
                                        follow_up_date = now + timedelta(weeks=weeks)
                                        time_reference = f"{weeks} semaines"
                                    elif time_type == 'mois':
                                        months = int(matches[0])
                                        follow_up_date = now + timedelta(days=30*months)
                                        time_reference = f"{months} mois"
                                    break
                        else:  # Anglais
                            for time_type, pattern in self.en_time_patterns.items():
                                matches = re.findall(pattern, entity_lower)
                                if matches and matches[0]:
                                    has_time_reference = True
                                    if time_type == 'days':
                                        days = int(matches[0])
                                        follow_up_date = now + timedelta(days=days)
                                        time_reference = f"{days} days"
                                    elif time_type == 'weeks':
                                        weeks = int(matches[0])
                                        follow_up_date = now + timedelta(weeks=weeks)
                                        time_reference = f"{weeks} weeks"
                                    elif time_type == 'months':
                                        months = int(matches[0])
                                        follow_up_date = now + timedelta(days=30*months)
                                        time_reference = f"{months} months"
                                    break
            except Exception as e:
                print(f"Error in NER processing: {e}", file=sys.stderr)
        
        # Si on n'a pas trouvé de référence temporelle avec le NER, on utilise les regex
        if not has_time_reference:
            pattern_dict = self.fr_time_patterns if language == 'fr' else self.en_time_patterns
            
            for time_type, pattern in pattern_dict.items():
                matches = re.findall(pattern, text, re.IGNORECASE)
                
                if matches:
                    has_time_reference = True
                    
                    if language == 'fr':
                        if time_type == 'jours' and matches[0]:
                            days = int(matches[0])
                            follow_up_date = now + timedelta(days=days)
                            time_reference = f"{days} jours"
                        elif time_type == 'semaines' and matches[0]:
                            weeks = int(matches[0])
                            follow_up_date = now + timedelta(weeks=weeks)
                            time_reference = f"{weeks} semaines"
                        elif time_type == 'mois' and matches[0]:
                            months = int(matches[0])
                            follow_up_date = now + timedelta(days=30*months)
                            time_reference = f"{months} mois"
                        elif time_type == 'demain':
                            follow_up_date = now + timedelta(days=1)
                            time_reference = "demain"
                        elif time_type == 'semaine_prochaine':
                            follow_up_date = now + timedelta(days=7)
                            time_reference = "semaine prochaine"
                        elif time_type == 'mois_prochain':
                            follow_up_date = now + timedelta(days=30)
                            time_reference = "mois prochain"
                    else:  # Anglais
                        if time_type == 'days' and matches[0]:
                            days = int(matches[0])
                            follow_up_date = now + timedelta(days=days)
                            time_reference = f"{days} days"
                        elif time_type == 'weeks' and matches[0]:
                            weeks = int(matches[0])
                            follow_up_date = now + timedelta(weeks=weeks)
                            time_reference = f"{weeks} weeks"
                        elif time_type == 'months' and matches[0]:
                            months = int(matches[0])
                            follow_up_date = now + timedelta(days=30*months)
                            time_reference = f"{months} months"
                        elif time_type == 'tomorrow':
                            follow_up_date = now + timedelta(days=1)
                            time_reference = "tomorrow"
                        elif time_type == 'next_week':
                            follow_up_date = now + timedelta(days=7)
                            time_reference = "next week"
                        elif time_type == 'next_month':
                            follow_up_date = now + timedelta(days=30)
                            time_reference = "next month"
                    
                    break
        
        return {
            "has_time_reference": has_time_reference,
            "follow_up_date": follow_up_date.isoformat() if follow_up_date else None,
            "time_reference": time_reference
        }

    def analyze(self, text):
        """
        Analyse complète du texte
        """
        # 1. Détection de la langue
        language = self.detect_language(text)
        
        # 2. Détection de l'intention de relance
        needs_follow_up = self.detect_follow_up_intent(text)
        
        # 3. Extraction des références temporelles
        time_info = self.extract_time_reference(text, language)
        
        # 4. Combinaison des résultats
        return {
            "needs_follow_up": needs_follow_up,
            "follow_up_date": time_info["follow_up_date"],
            "time_reference": time_info["time_reference"],
            "has_time_reference": time_info["has_time_reference"],
            "language": language
        }

def detect_follow_up(text):
    """
    Fonction de compatibilité pour maintenir l'API existante
    """
    analyzer = EmailAnalyzer()
    return analyzer.analyze(text)

def main():
    parser = argparse.ArgumentParser(description='Analyse un email pour détecter les demandes de relance.')
    parser.add_argument('--file', required=True, help='Chemin vers le fichier contenant l\'email')
    args = parser.parse_args()
    
    # Lecture du contenu de l'email
    with open(args.file, 'r', encoding='utf-8') as f:
        email_content = f.read()
    
    # Analyse email avec la nouvelle méthode
    result = detect_follow_up(email_content)
    
    # Résultats au format JSON
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()