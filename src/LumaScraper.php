<?php
/**
 * Classe pour extraire les informations des emails d'événements Lu.ma
 * 
 * Cette version améliorée distingue les emails de participation et d'organisation
 */

class LumaScraper {
    private $config;
    private $lumaSubjectPatterns;
    private $lumaContentPatterns;
    private $registrationPatterns;
    private $organizerPatterns;

    /**
     * Constructeur
     */
    public function __construct() {
        // Chargement de la configuration
        $configFile = __DIR__ . '/../config.php';
        if (file_exists($configFile)) {
            $this->config = require $configFile;
            
            // Vérifier que $this->config est bien un tableau avant d'y accéder
            if (is_array($this->config) && isset($this->config['luma_patterns'])) {
                // Récupération des patterns depuis la configuration
                $this->lumaSubjectPatterns = $this->config['luma_patterns']['subject'] ?? [];
                $this->lumaContentPatterns = $this->config['luma_patterns']['content'] ?? [];
            } else {
                // Patterns par défaut si la configuration n'est pas disponible
                $this->setDefaultPatterns();
            }
        } else {
            // Patterns par défaut si config.php n'existe pas
            $this->setDefaultPatterns();
        }
        
        // Patterns spécifiques pour identifier les emails de participation (registration)
        $this->registrationPatterns = [
            // Sujets
            'subject' => [
                '/you(?:\'re| are) (?:registered|confirmed)/i',
                '/your registration/i',
                '/vous êtes inscrit/i',
                '/confirmation.*inscription/i',
                '/ticket confirmed/i',
                '/your ticket/i',
                '/votre billet/i',
                '/confirmation de participation/i',
                '/thanks for registering/i',
                '/merci de vous être inscrit/i',
            ],
            // Contenus
            'content' => [
                '/you(?:\'re| are| have been) (?:registered|confirmed|signed up)/i',
                '/vous êtes (?:inscrit|enregistré)/i',
                '/your registration (?:is|has been) confirmed/i',
                '/your spot (?:is|has been) confirmed/i',
                '/votre inscription est confirmée/i',
                '/your ticket (?:is|has been) confirmed/i',
                '/votre billet est confirmé/i',
                '/see you (?:at|on)/i',
                '/au plaisir de vous voir/i',
                '/thanks for registering/i',
                '/merci de vous être inscrit/i',
                '/<button[^>]*>Join Event<\/button>/i',
                '/<button[^>]*>Rejoindre l\'événement<\/button>/i',
            ]
        ];
        
        // Patterns spécifiques pour identifier les emails d'organisation
        $this->organizerPatterns = [
            // Sujets
            'subject' => [
                '/your event is (?:live|published)/i',
                '/votre événement est (?:en ligne|publié)/i',
                '/new registration/i',
                '/nouvelle inscription/i',
                '/event reminder for hosts/i',
                '/rappel d\'événement pour les organisateurs/i',
                '/your event stats/i',
                '/statistiques de votre événement/i',
                '/someone registered/i',
                '/quelqu\'un s\'est inscrit/i',
            ],
            // Contenus
            'content' => [
                '/your event (?:is|has been) (?:published|created|live)/i',
                '/votre événement (?:est|a été) (?:publié|créé|mis en ligne)/i',
                '/you(?:\'ve| have) created an event/i',
                '/vous avez créé un événement/i',
                '/as the host/i',
                '/en tant qu\'organisateur/i',
                '/manage (?:your|this) event/i',
                '/gérer (?:votre|cet) événement/i',
                '/edit (?:your|the|this) event/i',
                '/modifier (?:votre|cet|l\')événement/i',
                '/your event dashboard/i',
                '/tableau de bord de votre événement/i',
                '/view (?:your|the) attendees/i',
                '/voir les participants/i',
                '/<button[^>]*>Manage Event<\/button>/i',
                '/<button[^>]*>Gérer l\'événement<\/button>/i',
            ]
        ];
    }
    
    /**
     * Définit les patterns par défaut en cas d'absence de configuration
     */
    private function setDefaultPatterns() {
        $this->lumaSubjectPatterns = [
            '/confirmation.*event/i',
            '/your ticket/i',
            '/vous êtes inscrit/i',
            '/registration confirmed/i',
            '/lu\.ma.*event/i',
            '/événement.*lu\.ma/i',
        ];
        
        $this->lumaContentPatterns = [
            '/lu\.ma\/events/i',
            '/lu\.ma\/e\//i',
            '/lu\.ma\/[a-z0-9-]+/i',
            '/cal\.lu\.ma/i',
            '/calendar\.lu\.ma/i',
        ];
    }

    /**
     * Analyse un email pour détecter s'il s'agit d'un email Lu.ma et extraire ses informations
     *
     * @param array $emailData Données de l'email (sujet, corps, etc.)
     * @return array|null Données extraites ou null si ce n'est pas un email Lu.ma
     */
    public function scrapeEmail($emailData) {
        // Vérification si l'email provient de Lu.ma
        if (!$this->isLumaEmail($emailData)) {
            return null;
        }
        
        // Extraction des informations de l'événement
        $eventInfo = $this->extractEventInfo($emailData);
        
        // Détermination du type d'email (inscription ou organisation)
        $eventInfo['email_type'] = $this->determineEmailType($emailData);
        
        return $eventInfo;
    }
    
    /**
     * Vérifie si l'email provient de Lu.ma
     *
     * @param array $emailData Données de l'email
     * @return boolean
     */
    private function isLumaEmail($emailData) {
        // Vérification basée sur l'adresse expéditeur
        if (stripos($emailData['from'], '@lu.ma') !== false || 
            stripos($emailData['from'], 'Lu.ma Team') !== false) {
            return true;
        }
        
        // Vérification basée sur le sujet
        foreach ($this->lumaSubjectPatterns as $pattern) {
            if (preg_match($pattern, $emailData['subject'])) {
                return true;
            }
        }
        
        // Vérification basée sur le contenu
        foreach ($this->lumaContentPatterns as $pattern) {
            if (preg_match($pattern, $emailData['body'])) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Détermine si l'email est lié à une inscription ou à l'organisation d'un événement
     * 
     * @param array $emailData Données de l'email
     * @return string 'registration' (inscription) ou 'organizer' (organisation)
     */
    private function determineEmailType($emailData) {
        // Vérification si c'est un email d'organisation
        foreach ($this->organizerPatterns['subject'] as $pattern) {
            if (preg_match($pattern, $emailData['subject'])) {
                return 'organizer';
            }
        }
        
        foreach ($this->organizerPatterns['content'] as $pattern) {
            if (preg_match($pattern, $emailData['body'])) {
                return 'organizer';
            }
        }
        
        // Vérification si c'est un email d'inscription
        foreach ($this->registrationPatterns['subject'] as $pattern) {
            if (preg_match($pattern, $emailData['subject'])) {
                return 'registration';
            }
        }
        
        foreach ($this->registrationPatterns['content'] as $pattern) {
            if (preg_match($pattern, $emailData['body'])) {
                return 'registration';
            }
        }
        
        // Par défaut, on suppose que c'est un email d'inscription
        return 'registration';
    }
    
    /**
     * Extrait les informations de l'événement depuis l'email
     *
     * @param array $emailData Données de l'email
     * @return array Informations extraites
     */
    private function extractEventInfo($emailData) {
        $eventInfo = [
            'type' => 'luma_event',
            'event_name' => null,
            'event_date' => null,
            'event_time' => null,
            'event_location' => null,
            'event_url' => null,
            'organizer' => null,
            'registration_status' => 'confirmed', // Par défaut
            'calendar_link' => null,
            'email_type' => null // Sera rempli plus tard
        ];
        
        // Extraction du nom de l'événement depuis le sujet
        $subjectPatterns = [
            '/(?:confirmed|inscrit|registered).*?[:|pour|for]\\s*(.+?)(?:\s*\(|$)/i',
            '/your ticket.*?[:|pour|for]\\s*(.+?)(?:\s*\(|$)/i',
            '/événement\\s*:\\s*(.+?)(?:\s*\(|$)/i',
            '/event\\s*:\\s*(.+?)(?:\s*\(|$)/i',
            '/invitation.*?[:|to]\\s*(.+?)(?:\s*\(|$)/i',
        ];
        
        foreach ($subjectPatterns as $pattern) {
            if (preg_match($pattern, $emailData['subject'], $matches)) {
                $eventInfo['event_name'] = trim($matches[1]);
                break;
            }
        }
        
        // Si le nom n'est pas trouvé dans le sujet, essayer dans le corps
        if (!$eventInfo['event_name']) {
            $bodyPatterns = [
                '/event name\\s*:\\s*(.+?)(?:<|\n|$)/i',
                '/nom de l\'événement\\s*:\\s*(.+?)(?:<|\n|$)/i',
                '/<h1[^>]*>([^<]+)<\/h1>/i', // Souvent le titre de l'événement est dans un H1
                '/<strong[^>]*>([^<]+)<\/strong>.*?lu\.ma/i', // Le nom est souvent en gras près d'une référence à lu.ma
            ];
            
            foreach ($bodyPatterns as $pattern) {
                if (preg_match($pattern, $emailData['body'], $matches)) {
                    $eventInfo['event_name'] = trim($matches[1]);
                    break;
                }
            }
        }
        
        // Extraction de la date et heure
        $datePatterns = [
            '/date\\s*:\\s*(.+?)(?:<|\n|$)/i',
            '/date et heure\\s*:\\s*(.+?)(?:<|\n|$)/i',
            '/date and time\\s*:\\s*(.+?)(?:<|\n|$)/i',
            '/when\\s*:\\s*(.+?)(?:<|\n|$)/i',
            '/quand\\s*:\\s*(.+?)(?:<|\n|$)/i',
            // Patterns spécifiques au format Lu.ma
            '/\b(\d{1,2}(?:st|nd|rd|th)? [A-Za-z]+ \d{4})\b.*?(?:at|à|@)\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)/i',
            '/\b(\d{1,2} [A-Za-z]+ \d{4})\b.*?(?:at|à|@)\s*(\d{1,2}(?:h|:)\d{2})/i',
        ];
        
        foreach ($datePatterns as $pattern) {
            if (preg_match($pattern, $emailData['body'], $matches)) {
                if (count($matches) > 2) {
                    // Si on a trouvé la date et l'heure dans des groupes séparés
                    $eventInfo['event_date'] = trim($matches[1]);
                    $eventInfo['event_time'] = trim($matches[2]);
                } else {
                    $dateTimeStr = trim($matches[1]);
                    
                    // Tenter de séparer la date et l'heure
                    if (preg_match('/(.+?)\s+(?:at|à|@)\s+(.+)/', $dateTimeStr, $dtMatches)) {
                        $eventInfo['event_date'] = trim($dtMatches[1]);
                        $eventInfo['event_time'] = trim($dtMatches[2]);
                    } else {
                        $eventInfo['event_date'] = $dateTimeStr;
                    }
                }
                break;
            }
        }
        
        // Extraction du lieu
        $locationPatterns = [
            '/location\\s*:\\s*(.+?)(?:<|\n|$)/i',
            '/lieu\\s*:\\s*(.+?)(?:<|\n|$)/i',
            '/where\\s*:\\s*(.+?)(?:<|\n|$)/i',
            '/où\\s*:\\s*(.+?)(?:<|\n|$)/i',
            // Pattern pour différencier événements virtuels
            '/location\\s*:\\s*(online|virtual|zoom|teams|meet|webinar)/i',
            '/lieu\\s*:\\s*(en ligne|virtuel|zoom|teams|meet|webinaire)/i',
        ];
        
        foreach ($locationPatterns as $pattern) {
            if (preg_match($pattern, $emailData['body'], $matches)) {
                $eventInfo['event_location'] = trim($matches[1]);
                break;
            }
        }
        
        // Extraction de l'URL de l'événement (selon le format spécifique de Lu.ma)
        $urlPatterns = [
            '/https?:\/\/(?:www\.)?lu\.ma\/events\/[a-z0-9-]+/i',
            '/https?:\/\/(?:www\.)?lu\.ma\/[a-z0-9-]+/i',
            '/https?:\/\/(?:www\.)?lu\.ma\/e\/[a-z0-9-]+/i',
            // Recherche d'URL dans des liens HTML
            '/<a[^>]*href=["\'](https?:\/\/(?:www\.)?lu\.ma\/[^"\']+)["\'][^>]*>/i',
        ];
        
        foreach ($urlPatterns as $pattern) {
            if (preg_match($pattern, $emailData['body'], $matches)) {
                // Si c'est un match dans une balise HTML, prendre le groupe capturé
                $eventInfo['event_url'] = count($matches) > 1 ? $matches[1] : $matches[0];
                break;
            }
        }
        
        // Extraction de l'organisateur
        $organizerPatterns = [
            '/organizer\\s*:\\s*(.+?)(?:<|\n|$)/i',
            '/organisateur\\s*:\\s*(.+?)(?:<|\n|$)/i',
            '/hosted by\\s*:\\s*(.+?)(?:<|\n|$)/i',
            '/organized by\\s*:\\s*(.+?)(?:<|\n|$)/i',
            '/created by\\s*:\\s*(.+?)(?:<|\n|$)/i',
            // Essayer de trouver dans la structure spécifique de Lu.ma
            '/(?:invites|invite|invited) you to\\s+(.+?)\'s event/i',
            '/(?:vous a invité|vous invite) à l\'événement de\\s+(.+?)(?: |<|\n|$)/i',
        ];
        
        foreach ($organizerPatterns as $pattern) {
            if (preg_match($pattern, $emailData['body'], $matches)) {
                $eventInfo['organizer'] = trim($matches[1]);
                break;
            }
        }
        
        // Extraction du lien de calendrier (spécifique à Lu.ma)
        $calendarPatterns = [
            '/https?:\/\/(?:www\.)?cal\.lu\.ma\/[a-z0-9-]+/i',
            '/https?:\/\/(?:www\.)?calendar\.lu\.ma\/[a-z0-9-]+/i',
            // Recherche dans différents formats de liens de calendrier
            '/add to (?:your )?calendar:.*?(https?:\/\/[^\s"\'<>]+)/i',
            '/ajouter à (?:votre )?calendrier:.*?(https?:\/\/[^\s"\'<>]+)/i',
            // Liens Google Calendar, Apple Calendar, etc.
            '/https?:\/\/calendar\.google\.com\/[^\s"\'<>]+/i',
            '/https?:\/\/outlook\.live\.com\/[^\s"\'<>]+/i',
            // En HTML
            '/<a[^>]*href=["\'](https?:\/\/(?:calendar|cal)\.(?:google\.com|outlook\.com|apple\.com|lu\.ma)[^"\']+)["\'][^>]*>.*?(?:calendar|agenda|ical|ics).*?<\/a>/i',
        ];
        
        foreach ($calendarPatterns as $pattern) {
            if (preg_match($pattern, $emailData['body'], $matches)) {
                $eventInfo['calendar_link'] = count($matches) > 1 ? $matches[1] : $matches[0];
                break;
            }
        }
        
        return $eventInfo;
    }
}