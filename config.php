<?php
/**
 * Fichier de configuration pour Email Analyzer
 * 
 * Ce fichier centralise tous les paramètres personnalisables du système.
 * Modifiez ce fichier selon vos besoins avant de déployer l'application.
 */

return [
    // Informations sur l'expéditeur des emails de relance
    'sender' => [
        'email' => 'votre-email@example.com', // Remplacez par votre adresse email
        'name' => 'Service de relance automatique', // Remplacez par votre nom ou celui de l'entreprise
    ],
    
    // Paramètres Gmail
    'gmail' => [
        'credentials_path' => __DIR__ . '/credentials.json', // Chemin vers le fichier d'identifiants Google
        'token_path' => __DIR__ . '/token.json', // Chemin où sera stocké le token d'accès
        'application_name' => 'Email Analyzer', // Nom de l'application affiché lors de l'authentification
    ],
    
    // Paramètres de l'interface utilisateur
    'ui' => [
        'default_language' => 'fr', // Langue par défaut (fr ou en)
        'items_per_page' => 10, // Nombre d'emails affichés par page
        'timezone' => 'Europe/Paris', // Fuseau horaire pour l'affichage des dates
    ],
    
    // Paramètres Python
    'python' => [
        'executable' => 'python', // Chemin vers l'exécutable Python
        'analyze_script' => __DIR__ . '/src/python/analyze_email.py', // Chemin vers le script d'analyse
        // Modèles Transformers utilisés (peut être utile pour les références)
        'models' => [
            'intent_classifier' => 'distilbert-base-uncased',
            'ner_model' => 'jean-baptiste/camembert-ner',
            'language_detector' => 'papluca/xlm-roberta-base-language-detection',
        ],
    ],
    
    // Paramètres de relance
    'followup' => [
        'storage_path' => __DIR__ . '/follow_ups.json', // Chemin vers le fichier de stockage des relances
        'default_delay' => '+1 week', // Délai par défaut pour les relances manuelles
    ],
    
    // Patterns pour la détection des emails Lu.ma (peuvent être étendus)
    'luma_patterns' => [
        'subject' => [
            '/confirmation.*event/i',
            '/your ticket/i',
            '/vous êtes inscrit/i',
            '/registration confirmed/i',
            '/lu\.ma.*event/i',
            '/événement.*lu\.ma/i',
            '/invitation/i',
            '/RSVP/i',
            '/reminder/i',
            '/rappel événement/i',
            // Ajoutez vos patterns personnalisés ici
        ],
        'content' => [
            '/lu\.ma\/events/i',
            '/lu\.ma\/e\//i',
            '/lu\.ma\/[a-z0-9-]+/i', // Pour les URLs d'événements spécifiques
            '/cal\.lu\.ma/i',
            '/calendar\.lu\.ma/i',
            '/join\.lu\.ma/i',
            '/email\.lu\.ma/i',
            '/from: .*?@lu\.ma/i',
            '/from: .*?Lu\.ma Team/i',
            // Ajoutez vos patterns personnalisés ici
        ],
    ],
    
    // Chemins des fichiers importants
    'paths' => [
        'logs' => __DIR__ . '/logs', // Dossier pour les fichiers de log
        'temp' => sys_get_temp_dir(), // Dossier temporaire pour les fichiers
    ],
    
    // Paramètres de débogage
    'debug' => [
        'enabled' => true, // Activer le mode de débogage
        'log_level' => 'error', // Niveau de log (error, warning, info, debug)
    ],
];