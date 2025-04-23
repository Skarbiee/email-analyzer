#!/usr/bin/env python
# -*- coding: utf-8 -*-

import argparse
import json
import re
from datetime import datetime, timedelta

# Note: Ce script simplifié ne nécessite pas immédiatement Transformers
def detect_follow_up(text):
    """
    Détecte si l'email nécessite une relance et quand
    Supporte le français et l'anglais
    """
    now = datetime.now()
    follow_up_date = None
    time_reference = None
    has_time_reference = False
    
    # Patterns de demandes de relance en français
    fr_time_patterns = {
        'jours': r'(?:dans|après|d\'ici|prochain(?:e)?s?|suivant(?:e)?s?)\s+(\d+)\s+jours?',
        'semaines': r'(?:dans|après|d\'ici|prochain(?:e)?s?|suivant(?:e)?s?)\s+(\d+)\s+semaines?',
        'mois': r'(?:dans|après|d\'ici|prochain(?:e)?s?|suivant(?:e)?s?)\s+(\d+)\s+mois',
        'demain': r'demain',
        'semaine_prochaine': r'(?:la\s+)?semaine\s+prochaine',
        'mois_prochain': r'(?:le\s+)?mois\s+prochain',
    }

    # Patterns de demandes de relance en anglais
    en_time_patterns = {
        'days': r'(?:in|after|within|next|following)\s+(\d+)\s+days?',
        'weeks': r'(?:in|after|within|next|following)\s+(\d+)\s+weeks?',
        'months': r'(?:in|after|within|next|following)\s+(\d+)\s+months?',
        'tomorrow': r'tomorrow',
        'next_week': r'next\s+week',
        'next_month': r'next\s+month',
    }
    
    # Recherche d'abord des patterns en français
    for time_type, pattern in fr_time_patterns.items():
        matches = re.findall(pattern, text, re.IGNORECASE)
        
        if matches:
            has_time_reference = True
            
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
                # Approximation simple pour les mois
                follow_up_date = now + timedelta(days=30*months)
                time_reference = f"{months} mois"
            
            elif time_type == 'demain':
                follow_up_date = now + timedelta(days=1)
                time_reference = "demain"
            
            elif time_type == 'semaine_prochaine':
                # On considère 7 jours pour simplifier
                follow_up_date = now + timedelta(days=7)
                time_reference = "semaine prochaine"
            
            elif time_type == 'mois_prochain':
                # On considère 30 jours pour simplifier
                follow_up_date = now + timedelta(days=30)
                time_reference = "mois prochain"
            
            break
    
    # Si pas de pattern trouvé, rechercher en anglais
    if not has_time_reference:
        for time_type, pattern in en_time_patterns.items():
            matches = re.findall(pattern, text, re.IGNORECASE)
            
            if matches:
                has_time_reference = True
                
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
                    # Approximation simple pour les mois
                    follow_up_date = now + timedelta(days=30*months)
                    time_reference = f"{months} months"
                
                elif time_type == 'tomorrow':
                    follow_up_date = now + timedelta(days=1)
                    time_reference = "tomorrow"
                
                elif time_type == 'next_week':
                    # 7 jours pour simplifier
                    follow_up_date = now + timedelta(days=7)
                    time_reference = "next week"
                
                elif time_type == 'next_month':
                    # 30 jours pour simplifier
                    follow_up_date = now + timedelta(days=30)
                    time_reference = "next month"
                
                break
    
    # Recherche phrases explicites de relance en français
    fr_relance_patterns = [
        r'(?:me|nous) (?:rappeler|recontacter|rappelle[rz]|recontacte[rz])',
        r'(?:je|nous) (?:vous|te) (?:recontacterai|rappellerai)',
        r'(?:pourriez-vous|pourrais-tu) (?:me|nous) (?:recontacter|rappeler)',
        r'(?:relance[rz]?|relancer|suivre|suivi)',
    ]
    
    # Recherche phrases explicites de relance en anglais
    en_relance_patterns = [
        r'(?:remind|contact|call|get back to) (?:me|us)',
        r'(?:I|we) (?:will|shall|\'ll) (?:contact|call|get back to) (?:you)',
        r'(?:could you|can you) (?:remind|contact|call|get back to) (?:me|us)',
        r'(?:follow[- ]?up|reminder)',
    ]

    needs_follow_up = has_time_reference
    
    # Vérification des patterns français
    for pattern in fr_relance_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            needs_follow_up = True
            break
    
    # Vérification des patterns anglais
    if not needs_follow_up:
        for pattern in en_relance_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                needs_follow_up = True
                break
    
    return {
        "needs_follow_up": needs_follow_up,
        "follow_up_date": follow_up_date.isoformat() if follow_up_date else None,
        "time_reference": time_reference,
        "has_time_reference": has_time_reference,
        "language": "fr" if any(re.search(pattern, text, re.IGNORECASE) for pattern in fr_relance_patterns) else "en"
    }

def main():
    parser = argparse.ArgumentParser(description='Analyse un email pour détecter les demandes de relance.')
    parser.add_argument('--file', required=True, help='Chemin vers le fichier contenant l\'email')
    args = parser.parse_args()
    
    # Lecture du contenu de l'email
    with open(args.file, 'r', encoding='utf-8') as f:
        email_content = f.read()
    
    # Analyse email
    result = detect_follow_up(email_content)
    
    # Résultats au format JSON
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()