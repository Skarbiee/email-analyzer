# Email Analyzer - Système de détection et relance automatique

Ce projet est un système qui analyse automatiquement les emails pour détecter les demandes de relance (par exemple "à relancer dans un mois") et programme des emails de suivi automatiquement. Le système est multilingue (français et anglais), utilise des modèles Transformers pour une analyse avancée, permet le scraping des événements Lu.ma, et peut être déployé sur un Raspberry Pi ou d'autres environnements.

## Structure du projet

```
email-analyzer/
├── composer.json                # Configuration Composer
├── config.php                   # Configuration centralisée du système
├── credentials.json             # Identifiants Google (à obtenir)
├── docs/                        # Documentation détaillée
│   └── python_installation.md   # Guide d'installation des dépendances Python
├── follow_ups.json              # Relances programmées (créé automatiquement)
├── README.md
├── send_reminders.php           # Script de relance automatique
├── src/
│   ├── GmailFetcher.php         # Classe pour récupérer les emails depuis Gmail
│   ├── LumaScraper.php          # Classe pour extraire les infos des événements Lu.ma
│   ├── PythonBridge.php         # Classe pour communiquer avec Python
│   ├── public/
│   │   └── index.php            # Interface web principale
│   ├── api/
│   │   └── analyze-email.php    # Recupération des infos des emails par API
│   └── python/
│       └── analyze_email.py     # Script Python d'analyse des emails avec Transformers
├── token.json                   # Token d'accès Google (créé automatiquement)
├── venv/                        # Environnement virtuel Python
└── vendor/                      # Dépendances PHP (installées par Composer)
```

## Prérequis

- PHP 7.4 ou supérieur
- Python 3.7 ou supérieur
- Composer (gestionnaire de dépendances PHP)
- Accès à un compte Gmail
- Projet Google Cloud avec API Gmail activée

## Installation

### 1. Configuration de l'environnement

#### Cloner le projet
```bash
git clone https://github.com/Skarbiee/email-analyzer.git
cd email-analyzer
```

#### Installation des dépendances PHP
```bash
composer install
```

#### Configuration de l'environnement Python
Voir le guide [docs/python_installation.md](docs/python_installation.md) pour des instructions détaillées sur l'installation des modèles Transformers.

### 2. Configuration du système

Le projet utilise un fichier `config.php` à la racine qui centralise tous les paramètres personnalisables. Modifiez ce fichier pour adapter le système à votre environnement.

Les principaux paramètres à personnaliser sont :
- Informations de l'expéditeur des emails (email, nom)
- Paramètres de l'interface utilisateur (langue, fuseau horaire)
- Chemins vers les exécutables Python
- Patterns pour détecter les emails Lu.ma

Consultez les commentaires dans `config.php` pour des explications détaillées sur chaque paramètre.

### 3. Configuration des identifiants Google

Pour utiliser l'API Gmail, vous devez obtenir des identifiants OAuth 2.0 :

1. Accédez à la [Console Google Cloud](https://console.cloud.google.com/)
2. Créez un nouveau projet
3. Dans le menu latéral, allez dans "APIs & Services" > "Library"
4. Recherchez "Gmail API" et activez-la
5. Allez dans "APIs & Services" > "Credentials"
6. Cliquez sur "Create Credentials" et sélectionnez "OAuth client ID"
7. Sélectionnez "Web application" comme type d'application
8. Donnez un nom à votre application
9. Dans "Authorized redirect URIs", ajoutez `http://localhost:8000`
10. Cliquez sur "Create"
11. Téléchargez le fichier JSON et placez-le à la racine de votre projet sous le nom `credentials.json`

#### Configuration de l'écran de consentement OAuth

1. Dans la Console Google Cloud, allez dans "APIs & Services" > "OAuth consent screen"
2. Sélectionnez "External" et cliquez sur "Create"
3. Remplissez les informations obligatoires (nom de l'application, email, etc.)
4. Ajoutez les scopes pour Gmail :
   - `.../auth/gmail.readonly`
   - `.../auth/gmail.send`
5. Ajoutez votre adresse email comme utilisateur test

### 4. Configuration du serveur web

#### Serveur de développement
```bash
cd email-analyzer
php -S localhost:8000 -t src/public
```

#### Configuration Apache (production)

**Windows (XAMPP/WAMP)**
Modifiez le fichier httpd.conf ou créez un vhost :
```apache
<VirtualHost *:80>
    ServerName email-analyzer.local
    DocumentRoot "C:/path/to/email-analyzer/src/public"
    <Directory "C:/path/to/email-analyzer/src/public">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

**Linux**
Créez un fichier de configuration dans `/etc/apache2/sites-available/` :
```apache
<VirtualHost *:80>
    ServerName email-analyzer.local
    DocumentRoot /path/to/email-analyzer/src/public
    
    <Directory "/path/to/email-analyzer/src/public">
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/email-analyzer-error.log
    CustomLog ${APACHE_LOG_DIR}/email-analyzer-access.log combined
</VirtualHost>
```

Activez le site :
```bash
sudo a2ensite email-analyzer.conf
sudo systemctl restart apache2
```

### 5. Configuration des tâches planifiées

#### Windows (Planificateur de tâches)
1. Ouvrez le Planificateur de tâches Windows
2. Créez une nouvelle tâche basique
3. Configurez-la pour s'exécuter quotidiennement (par exemple à 8h00)
4. Définissez l'action comme "Démarrer un programme"
5. Programme : `C:\path\to\php.exe`
6. Arguments : `C:\path\to\email-analyzer\send_reminders.php`

#### Linux (Cron)
1. Ouvrez le fichier crontab en édition :
```bash
crontab -e
```

2. Ajoutez une ligne pour exécuter le script quotidiennement :
```
0 8 * * * /usr/bin/php /path/to/email-analyzer/send_reminders.php >> /path/to/email-analyzer/logs/reminders.log 2>&1
```

#### macOS (Launchd)
1. Créez un fichier plist dans `~/Library/LaunchAgents/com.yourusername.emailreminder.plist` : 
> Remplacez `yourusername` par votre nom d'utilisateur système
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.yourusername.emailreminder</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/php</string>
        <string>/path/to/email-analyzer/send_reminders.php</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>8</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>/path/to/email-analyzer/logs/reminders.log</string>
    <key>StandardErrorPath</key>
    <string>/path/to/email-analyzer/logs/reminders_error.log</string>
</dict>
</plist>
```

2. Chargez le job :
```bash
launchctl load ~/Library/LaunchAgents/com.yourusername.emailreminder.plist
```

## Configuration spécifique pour Raspberry Pi

Si vous déployez sur un Raspberry Pi, voici quelques ajustements recommandés :

1. Dans `config.php`, ajustez les paramètres Python pour des modèles plus légers si nécessaire.

2. Utilisez la version légère des dépendances Python comme indiqué dans [docs/python_installation.md](docs/python_installation.md).

3. Assurez-vous que les permissions sont correctement configurées :
```bash
sudo chown -R www-data:www-data /chemin/vers/email-analyzer
chmod -R 775 /chemin/vers/email-analyzer/token.json
chmod -R 775 /chemin/vers/email-analyzer/follow_ups.json
```

4. Considérez l'utilisation de systemd plutôt que cron pour les performances :
```bash
# Créez un fichier de service dans /etc/systemd/system/email-reminder.service
[Unit]
Description=Email Reminder Service
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/email-analyzer
ExecStart=/usr/bin/php /path/to/email-analyzer/send_reminders.php
Restart=always
RestartSec=3600

[Install]
WantedBy=multi-user.target
```

Activez le service :
```bash
sudo systemctl enable email-reminder.service
sudo systemctl start email-reminder.service
```

## Utilisation

1. Accédez à l'interface web via http://localhost:8000 (ou l'URL configurée)
2. Lors de la première connexion, vous serez redirigé vers l'écran de consentement Google pour autoriser l'accès à votre compte Gmail
3. Une fois connecté, vous verrez la liste de vos emails récents
4. Le système analysera automatiquement les emails pour détecter les demandes de relance
5. Vous pouvez également programmer manuellement des relances via l'interface
6. Consultez l'onglet "Événements Lu.ma" pour voir les événements extraits de vos emails:
   - Vous pouvez filtrer pour voir tous les événements, seulement ceux auxquels vous êtes inscrit, ou seulement ceux que vous organisez
   - Chaque événement est identifié comme "Email d'inscription" ou "Email d'organisation" avec des badges visuels
7. Le script `send_reminders.php` s'exécutera automatiquement selon la planification configurée pour envoyer les relances au moment approprié

## Fonctionnalités

- Détection avancée des demandes de relance dans les emails grâce aux modèles Transformers
- Support multilingue (français et anglais)
- Interface utilisateur pour visualiser et gérer les relances
- Extraction et visualisation des événements Lu.ma
  - **Distinction entre les événements auxquels vous êtes inscrit et ceux que vous organisez**
  - **Filtres pour afficher seulement les types d'événements souhaités**
  - **Badges visuels indiquant le type d'événement (inscription/organisation)**
- Envoi automatique des emails de relance aux dates programmées
- Mode test pour essayer l'application sans connexion Gmail
- Configuration centralisée via `config.php`

## Notes importantes

1. **Sécurité** : Le fichier `credentials.json` contient des informations sensibles. Ne le partagez pas et assurez-vous qu'il n'est pas accessible publiquement.
2. **Quotas API** : L'API Gmail a des quotas limités. Si vous prévoyez un grand volume d'emails, surveillez votre utilisation dans la Console Google Cloud.
3. **Protection des données** : Ce système accède à vos emails. Assurez-vous de respecter les lois sur la protection des données (RGPD, etc.) si vous l'utilisez dans un contexte professionnel.
4. **Ressources requises** : L'utilisation des modèles Transformers nécessite plus de ressources. Assurez-vous d'avoir suffisamment de RAM disponible (minimum 2 Go recommandé).

## Dépannage

1. **Erreurs d'authentification** : Si vous rencontrez des erreurs d'authentification, supprimez le fichier `token.json` et relancez l'application pour générer un nouveau token.
2. **Problèmes de Python** : Vérifiez que vous utilisez bien l'interpréteur Python de l'environnement virtuel. Activez l'environnement avant d'exécuter les commandes.
3. **Emails non détectés** : Vérifiez les patterns dans `config.php` et ajoutez des patterns supplémentaires si nécessaire.
4. **Erreurs de modèles Transformers** : Si vous rencontrez des erreurs avec les modèles, essayez des modèles plus légers ou augmentez les ressources disponibles en modifiant `config.php`.
5. **Événements Lu.ma non détectés** : Ajoutez des patterns supplémentaires dans `config.php` pour mieux capter les différents formats d'emails Lu.ma.
6. **Types d'événements Lu.ma incorrects** : Si le système ne distingue pas correctement les emails d'inscription et d'organisation, ajoutez des patterns supplémentaires dans le fichier `LumaScraper.php`.

## Extension avec n8n (optionnel)

Le projet peut être étendu avec [n8n](https://n8n.io/) pour des workflows d'automatisation plus avancés :

1. Installez n8n :
```bash
npm install n8n -g
```

2. Démarrez n8n :
```bash
n8n start
```

3. Accédez à l'interface n8n via http://localhost:5678
4. Créez des workflows pour récupérer les emails, les analyser, et programmer des relances