<?php

// Chargement de la configuration centralisée
$config = require_once __DIR__ . '/../../config.php';

// Gestion de la langue
$supportedLanguages = ['fr' => 'Français', 'en' => 'English'];
$userLang = $_GET['lang'] ?? $config['ui']['default_language'];
if (!array_key_exists($userLang, $supportedLanguages)) {
    $userLang = $config['ui']['default_language'];
}

$translations = [
    'fr' => [
        'title' => 'Système de relance automatique d\'emails',
        'test_mode' => 'Mode test activé. Les données affichées sont fictives.',
        'normal_mode' => 'Mode normal. Connecté à Gmail.',
        'credentials_needed' => 'Veuillez configurer vos identifiants Google pour accéder à Gmail.',
        'refresh_list' => 'Rafraîchir la liste',
        'test_mode_btn' => 'Passer en mode test',
        'normal_mode_btn' => 'Essayer le mode normal',
        'col_date' => 'Date',
        'col_from' => 'De',
        'col_subject' => 'Sujet',
        'col_followup' => 'Relance',
        'need_followup' => 'Relance:',
        'no_followup' => 'Pas de relance',
        'action_analyze' => 'Analyser',
        'action_schedule' => 'Programmer',
        'modal_title' => 'Programmer une relance',
        'modal_date' => 'Date de relance',
        'modal_cancel' => 'Annuler',
        'modal_schedule' => 'Programmer',
        'analyzed' => 'Email analysé.',
        'followup_needed' => 'Relance nécessaire.',
        'followup_notneeded' => 'Pas de relance nécessaire.',
        'followup_scheduled' => 'Relance programmée pour',
        'manual_scheduled' => 'Relance programmée manuellement.',
        'emails_fetched' => 'Emails récupérés avec succès.',
        'language_selector' => 'Langue :',
        'error' => 'Erreur :',
        'timezone_cet' => 'Heure de Paris',
        'timezone_cest' => 'Heure d\'été de Paris',
        'tab_emails' => 'Emails',
        'tab_reminders' => 'Relances programmées',
        'tab_luma' => 'Événements Luma',
        'luma_title' => 'Événements Luma',
        'luma_no_events' => 'Aucun événement Luma détecté dans vos emails.',
        'luma_date' => 'Date:',
        'luma_time' => 'à',
        'luma_location' => 'Lieu:',
        'luma_organizer' => 'Organisateur:',
        'luma_view_event' => 'Voir l\'événement',
        'luma_add_calendar' => 'Ajouter au calendrier',
        'luma_events_fetched' => 'Événements Luma récupérés avec succès.',
        'luma_registration' => 'Email d\'inscription',
        'luma_email_organizer' => 'Email d\'organisation',
        'luma_filter_all' => 'Tous les événements',
        'luma_filter_registered' => 'Événements auxquels vous êtes inscrit',
        'luma_filter_organized' => 'Événements que vous organisez',
        'luma_event_type' => 'Type:'
    ],
    'en' => [
        'title' => 'Automatic Email Follow-up System',
        'test_mode' => 'Test mode enabled. The displayed data is fictitious.',
        'normal_mode' => 'Normal mode. Connected to Gmail.',
        'credentials_needed' => 'Please configure your Google credentials to access Gmail.',
        'refresh_list' => 'Refresh list',
        'test_mode_btn' => 'Switch to test mode',
        'normal_mode_btn' => 'Try normal mode',
        'col_date' => 'Date',
        'col_from' => 'From',
        'col_subject' => 'Subject',
        'col_followup' => 'Follow-up',
        'need_followup' => 'Follow-up:',
        'no_followup' => 'No follow-up',
        'action_analyze' => 'Analyze',
        'action_schedule' => 'Schedule',
        'modal_title' => 'Schedule a follow-up',
        'modal_date' => 'Follow-up date',
        'modal_cancel' => 'Cancel',
        'modal_schedule' => 'Schedule',
        'analyzed' => 'Email analyzed.',
        'followup_needed' => 'Follow-up needed.',
        'followup_notneeded' => 'No follow-up needed.',
        'followup_scheduled' => 'Follow-up scheduled for',
        'manual_scheduled' => 'Follow-up manually scheduled.',
        'emails_fetched' => 'Emails successfully retrieved.',
        'language_selector' => 'Language:',
        'error' => 'Error:',
        'timezone_cet' => 'Central European Time',
        'timezone_cest' => 'Central European Summer Time',
        'tab_emails' => 'Emails',
        'tab_reminders' => 'Scheduled Follow-ups',
        'tab_luma' => 'Luma Events',
        'luma_title' => 'Luma Events',
        'luma_no_events' => 'No Luma events detected in your emails.',
        'luma_date' => 'Date:',
        'luma_time' => 'at',
        'luma_location' => 'Location:',
        'luma_organizer' => 'Organizer:',
        'luma_view_event' => 'View event',
        'luma_add_calendar' => 'Add to calendar',
        'luma_events_fetched' => 'Luma events successfully retrieved.',
        'luma_registration' => 'Registration Email',
        'luma_email_organizer' => 'Organizer Email',
        'luma_filter_all' => 'All Events',
        'luma_filter_registered' => 'Events you are registered for',
        'luma_filter_organized' => 'Events you are organizing',
        'luma_event_type' => 'Type:'
    ]
];

$t = $translations[$userLang];

// Affichage de toutes les erreurs pour le débogage
if ($config['debug']['enabled']) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

// Inclusion des classes personnalisées
require_once __DIR__ . '/../GmailFetcher.php';
require_once __DIR__ . '/../PythonBridge.php';
require_once __DIR__ . '/../LumaScraper.php';

// Vérification si on est en mode test (sans connexion Gmail)
$testMode = isset($_GET['test']) || !file_exists($config['gmail']['credentials_path']);

// Récupération des emails récents
$action = $_GET['action'] ?? 'list';
$emailId = $_GET['id'] ?? '';
$message = '';
$emails = [];
$lumaEvents = [];
$currentTab = $_GET['tab'] ?? 'emails';
$filter = $_GET['filter'] ?? 'all'; // Filtre pour les events Luma (all, registered, organized)

// Si mode test
if ($testMode) {
    $emails = [
        [
            'id' => 'test1',
            'threadId' => 'thread1',
            'subject' => $userLang == 'fr' ? 'Demande de devis' : 'Quote request',
            'from' => 'client1@example.com',
            'date' => date('Y-m-d H:i:s'),
            'body' => $userLang == 'fr' ?
                "Bonjour,\n\nPouvez-vous me faire un devis pour votre service ? Je vous recontacterai dans 2 semaines.\n\nCordialement,\nClient 1" :
                "Hello,\n\nCan you provide me with a quote for your service? I will contact you again in 2 weeks.\n\nBest regards,\nClient 1"
        ],
        [
            'id' => 'test2',
            'threadId' => 'thread2',
            'subject' => $userLang == 'fr' ? 'Question sur votre produit' : 'Question about your product',
            'from' => 'client2@example.com',
            'date' => date('Y-m-d H:i:s', strtotime('-1 day')),
            'body' => $userLang == 'fr' ?
                "Bonjour,\n\nJ'ai une question sur votre produit. Pouvez-vous me rappeler demain ?\n\nMerci,\nClient 2" :
                "Hello,\n\nI have a question about your product. Can you call me back tomorrow?\n\nThanks,\nClient 2"
        ],
        [
            'id' => 'test3',
            'threadId' => 'thread3',
            'subject' => $userLang == 'fr' ? 'Réunion mensuelle' : 'Monthly meeting',
            'from' => 'colleague@example.com',
            'date' => date('Y-m-d H:i:s', strtotime('-2 days')),
            'body' => $userLang == 'fr' ?
                "Salut,\n\nN'oublie pas notre réunion mensuelle. Je t'enverrai l'agenda le mois prochain.\n\nÀ bientôt" :
                "Hi,\n\nDon't forget our monthly meeting. I'll send you the agenda next month.\n\nSee you soon"
        ]
    ];

    // Data test pour les events Luma
    if ($currentTab == 'luma') {
        $lumaEvents = [
            [
                'event_name' => $userLang == 'fr' ? 'Conférence Tech Paris 2025' : 'Tech Conference Paris 2025',
                'event_date' => '2025-05-15',
                'event_time' => '09:00',
                'event_location' => 'Palais des Congrès, Paris',
                'event_url' => 'https://lu.ma/e/tech-conference-paris-2025',
                'organizer' => 'TechEvents Paris',
                'calendar_link' => 'https://cal.lu.ma/tech-conference-paris-2025',
                'email_type' => 'registration' // Type d'email: inscription
            ],
            [
                'event_name' => $userLang == 'fr' ? 'Atelier de Design Thinking' : 'Design Thinking Workshop',
                'event_date' => '2025-05-20',
                'event_time' => '14:30',
                'event_location' => $userLang == 'fr' ? 'Station F, Paris' : 'Station F, Paris',
                'event_url' => 'https://lu.ma/e/design-thinking-workshop',
                'organizer' => 'Innovation Lab',
                'calendar_link' => 'https://cal.lu.ma/design-thinking-workshop',
                'email_type' => 'organizer' // Type d'email: organisation
            ],
            [
                'event_name' => $userLang == 'fr' ? 'Meetup Développeurs React' : 'React Developers Meetup',
                'event_date' => '2025-06-10',
                'event_time' => '18:30',
                'event_location' => 'WeWork La Fayette, Paris',
                'event_url' => 'https://lu.ma/e/react-meetup-paris',
                'organizer' => 'Paris JS Community',
                'calendar_link' => 'https://cal.lu.ma/react-meetup-paris',
                'email_type' => 'registration' // Type d'email: inscription
            ]
        ];
        
        // Filtrer les events selon le filtre sélectionné
        if ($filter !== 'all') {
            $filteredEvents = [];
            foreach ($lumaEvents as $event) {
                if (($filter === 'registered' && $event['email_type'] === 'registration') ||
                    ($filter === 'organized' && $event['email_type'] === 'organizer')) {
                    $filteredEvents[] = $event;
                }
            }
            $lumaEvents = $filteredEvents;
        }
        
        $message = $t['luma_events_fetched'] . ' (' . $t['test_mode'] . ')';
    }

    // Analyse simulée des emails de test
    if ($currentTab == 'emails') {
        $message = $t['test_mode'];
        $analyzer = new PythonBridge();

        foreach ($emails as &$email) {
            try {
                $email['analysis'] = $analyzer->analyzeEmail($email['body']);
            } catch (Exception $e) {
                $email['analysis'] = [
                    'error' => $e->getMessage(),
                    'needs_follow_up' => false
                ];
            }
        }
    } elseif ($action == 'analyze' && !empty($emailId)) {
        foreach ($emails as $email) {
            if ($email['id'] == $emailId) {
                $analyzer = new PythonBridge();
                try {
                    $email['analysis'] = $analyzer->analyzeEmail($email['body']);
                    $message = $t['analyzed'] . " " .
                        ($email['analysis']['needs_follow_up'] ? $t['followup_needed'] : $t['followup_notneeded']);
                    $emails = [$email];
                } catch (Exception $e) {
                    $message = $t['error'] . " " . $e->getMessage();
                }
                break;
            }
        }
    }
} else {
    // Mode normal avec connexion à Gmail
    try {
        $fetcher = new GmailFetcher();
        $analyzer = new PythonBridge();

        // Traitement selon l'onglet actif
        if ($currentTab == 'luma') {
            // Récupération des événements Luma avec le type de filtre
            // Note: Modifiez la méthode fetchLumaEventEmails dans GmailFetcher.php pour prendre en compte le filtre
            $lumaEvents = $fetcher->fetchLumaEventEmails($filter, $config['ui']['items_per_page']);
            $message = $t['luma_events_fetched'];
        } else if ($currentTab == 'reminders') {
            // Affichage des relances programmées
            $followUpsPath = $config['followup']['storage_path'];
            if (file_exists($followUpsPath)) {
                $followUps = json_decode(file_get_contents($followUpsPath), true) ?? [];
            } else {
                $followUps = [];
            }
            // Ici on pourrait ajouter le code pour afficher les relances
        } else {
            // Onglet emails par défaut
            switch ($action) {
                case 'analyze':
                    if (!empty($emailId)) {
                        // Récupération de l'email spécifique
                        $email = $fetcher->fetchEmailById($emailId);

                        // Analyse de l'email
                        $analysis = $analyzer->analyzeEmail($email['body']);

                        // Mise à jour des données de l'email avec les résultats de l'analyse
                        $email['analysis'] = $analysis;

                        // Si une relance est nécessaire, programmation de la relance
                        if ($analysis['needs_follow_up'] && $analysis['follow_up_date']) {
                            scheduleFollowUp($email);
                            $message = $t['analyzed'] . " " . $t['followup_scheduled'] . " " . $analysis['follow_up_date'];
                        } else {
                            $message = $t['analyzed'] . " " . $t['followup_notneeded'];
                        }

                        $emails = [$email];
                    }
                    break;

                case 'schedule':
                    if (!empty($emailId)) {
                        // Récupération de l'email spécifique
                        $email = $fetcher->fetchEmailById($emailId);

                        // Force la programmation d'une relance manuelle
                        scheduleFollowUp($email, $_POST['follow_up_date'] ?? null);

                        $message = $t['manual_scheduled'];
                        $emails = [$email];
                    }
                    break;

                case 'list':
                default:
                    // Récupération des emails récents
                    $emails = $fetcher->fetchEmails($config['ui']['items_per_page']);

                    // Analyse de chaque email
                    foreach ($emails as &$email) {
                        try {
                            $email['analysis'] = $analyzer->analyzeEmail($email['body']);
                        } catch (Exception $e) {
                            $email['analysis'] = [
                                'error' => $e->getMessage(),
                                'needs_follow_up' => false
                            ];
                        }
                    }

                    $message = $t['emails_fetched'];
                    break;
            }
        }
    } catch (Exception $e) {
        $message = $t['error'] . " " . $e->getMessage();

        // Si erreur d'authentification, passer en mode test
        if (strpos($e->getMessage(), 'auth') !== false) {
            $testMode = true;
            $message .= " " . $t['test_mode'];
        }
    }
}

/**
 * Programmation d'une relance
 */
function scheduleFollowUp($email, $customDate = null)
{
    global $config;
    
    // Date de relance (soit personnalisée, soit celle de l'analyse)
    $followUpDate = $customDate ?? $email['analysis']['follow_up_date'] ?? null;

    if (!$followUpDate) {
        // Si pas de date définie, on utilise le délai par défaut de la configuration
        $followUpDate = date('c', strtotime($config['followup']['default_delay']));
    }

    // Ici, on utilise le fichier de stockage défini dans la configuration
    $followUps = [];
    $followUpsPath = $config['followup']['storage_path'];
    
    if (file_exists($followUpsPath)) {
        $followUps = json_decode(file_get_contents($followUpsPath), true) ?? [];
    }

    $followUps[] = [
        'email_id' => $email['id'],
        'thread_id' => $email['threadId'],
        'subject' => $email['subject'],
        'from' => $email['from'],
        'scheduled_date' => $followUpDate,
        'status' => 'pending'
    ];

    file_put_contents($followUpsPath, json_encode($followUps, JSON_PRETTY_PRINT));

    return true;
}
?>

<!DOCTYPE html>
<html lang="<?php echo $userLang; ?>">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $t['title']; ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .needs-follow-up {
            background-color: #ffeeba;
        }

        .language-selector {
            margin-bottom: 20px;
        }
        
        /* Styles pour les événements Luma */
        .events-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .event-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }

        .event-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .event-card h3 {
            margin-top: 0;
            color: #333;
            font-size: 18px;
            margin-bottom: 15px;
        }

        .event-date, .event-location, .event-organizer, .event-type {
            margin-bottom: 10px;
            font-size: 14px;
        }

        .event-links {
            margin-top: 15px;
            display: flex;
            gap: 10px;
        }

        .event-links .button {
            display: inline-block;
            padding: 8px 12px;
            background-color: #4285f4;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
            transition: background-color 0.2s;
        }

        .event-links .button:hover {
            background-color: #3367d6;
        }
        
        /* Style pour les onglets */
        .nav-tabs {
            margin-bottom: 20px;
        }
        
        .nav-tabs ul {
            display: flex;
            list-style: none;
            padding: 0;
            margin: 0;
            border-bottom: 1px solid #dee2e6;
        }
        
        .nav-tabs ul li {
            margin-right: 5px;
        }
        
        .nav-tabs ul li a {
            display: block;
            padding: 10px 15px;
            text-decoration: none;
            color: #495057;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-bottom: none;
            border-radius: 5px 5px 0 0;
        }
        
        .nav-tabs ul li.active a {
            color: #495057;
            background-color: #fff;
            border-color: #dee2e6 #dee2e6 #fff;
        }
        
        /* Style pour les filtres */
        .event-filters {
            margin-bottom: 20px;
        }
        
        .badge.bg-info {
            background-color: #17a2b8 !important;
        }
        
        .badge.bg-success {
            background-color: #28a745 !important;
        }
    </style>
</head>

<body>
    <div class="container mt-4">
        <h1><?php echo $t['title']; ?></h1>

        <div class="language-selector">
            <span><?php echo $t['language_selector']; ?></span>
            <?php foreach ($supportedLanguages as $code => $name): ?>
                <a href="?lang=<?php echo $code; ?><?php echo $testMode ? '&test=1' : ''; ?>&tab=<?php echo $currentTab; ?>&filter=<?php echo $filter; ?><?php echo !empty($action) && $action != 'list' ? '&action=' . $action : ''; ?><?php echo !empty($emailId) ? '&id=' . $emailId : ''; ?>"
                    class="btn btn-sm <?php echo $userLang == $code ? 'btn-primary' : 'btn-outline-primary'; ?>">
                    <?php echo $name; ?>
                </a>
            <?php endforeach; ?>
        </div>

        <div class="alert alert-<?php echo $testMode ? 'warning' : 'info'; ?> mb-4">
            <?php if ($testMode): ?>
                <strong><?php echo $t['test_mode']; ?></strong>
                <?php if (!file_exists($config['gmail']['credentials_path'])): ?>
                    <?php echo $t['credentials_needed']; ?>
                <?php endif; ?>
            <?php else: ?>
                <strong><?php echo $t['normal_mode']; ?></strong>
            <?php endif; ?>

            <?php if (!empty($message)): ?>
                <div class="mt-2"><?php echo $message; ?></div>
            <?php endif; ?>
        </div>

        <div class="row mb-4">
            <div class="col">
                <a href="?lang=<?php echo $userLang; ?>&tab=<?php echo $currentTab; ?>&filter=<?php echo $filter; ?>&action=list<?php echo $testMode ? '&test=1' : ''; ?>"
                    class="btn btn-primary"><?php echo $t['refresh_list']; ?></a>
                <?php if (!$testMode): ?>
                    <a href="?lang=<?php echo $userLang; ?>&tab=<?php echo $currentTab; ?>&filter=<?php echo $filter; ?>&test=1"
                        class="btn btn-outline-secondary"><?php echo $t['test_mode_btn']; ?></a>
                <?php else: ?>
                    <a href="?lang=<?php echo $userLang; ?>&tab=<?php echo $currentTab; ?>&filter=<?php echo $filter; ?>"
                        class="btn btn-outline-success"><?php echo $t['normal_mode_btn']; ?></a>
                <?php endif; ?>
            </div>
        </div>
        
        <!-- Onglets de navigation -->
        <div class="nav-tabs">
            <ul>
                <li class="<?php echo $currentTab == 'emails' ? 'active' : ''; ?>">
                    <a href="?lang=<?php echo $userLang; ?>&tab=emails<?php echo $testMode ? '&test=1' : ''; ?>">
                        <?php echo $t['tab_emails']; ?>
                    </a>
                </li>
                <li class="<?php echo $currentTab == 'reminders' ? 'active' : ''; ?>">
                    <a href="?lang=<?php echo $userLang; ?>&tab=reminders<?php echo $testMode ? '&test=1' : ''; ?>">
                        <?php echo $t['tab_reminders']; ?>
                    </a>
                </li>
                <li class="<?php echo $currentTab == 'luma' ? 'active' : ''; ?>">
                    <a href="?lang=<?php echo $userLang; ?>&tab=luma<?php echo $testMode ? '&test=1' : ''; ?>">
                        <?php echo $t['tab_luma']; ?>
                    </a>
                </li>
            </ul>
        </div>

        <!-- Contenu des onglets -->
        <?php if ($currentTab == 'emails'): ?>
            <!-- Onglet Emails -->
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th><?php echo $t['col_date']; ?></th>
                            <th><?php echo $t['col_from']; ?></th>
                            <th><?php echo $t['col_subject']; ?></th>
                            <th><?php echo $t['col_followup']; ?></th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($emails as $email): ?>
                            <tr
                                class="<?php echo isset($email['analysis']['needs_follow_up']) && $email['analysis']['needs_follow_up'] ? 'needs-follow-up' : ''; ?>">
                                <td><?php echo $email['date']; ?></td>
                                <td><?php echo htmlspecialchars($email['from']); ?></td>
                                <td><?php echo htmlspecialchars($email['subject']); ?></td>
                                <td>
                                    <?php if (isset($email['analysis']['needs_follow_up']) && $email['analysis']['needs_follow_up']): ?>
                                        <span class="badge bg-warning">
                                            <?php echo $t['need_followup']; ?> <?php echo $email['analysis']['time_reference']; ?>
                                            <?php
                                            if (!empty($email['analysis']['follow_up_date'])) {
                                                $date = new DateTime($email['analysis']['follow_up_date']);
                                                $date->setTimezone(new DateTimeZone($config['ui']['timezone']));
                                                echo '(' . $date->format('d/m/Y H:i') . ' ' . $t['timezone_' . strtolower($date->format('T'))] . ')';
                                            }
                                            ?>
                                        </span>
                                    <?php else: ?>
                                        <span class="badge bg-secondary"><?php echo $t['no_followup']; ?></span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <a href="?lang=<?php echo $userLang; ?>&tab=emails&action=analyze&id=<?php echo $email['id']; ?><?php echo $testMode ? '&test=1' : ''; ?>"
                                        class="btn btn-sm btn-info"><?php echo $t['action_analyze']; ?></a>
                                    <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal"
                                        data-bs-target="#scheduleModal" data-email-id="<?php echo $email['id']; ?>">
                                        <?php echo $t['action_schedule']; ?>
                                    </button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php elseif ($currentTab == 'reminders'): ?>
            <!-- Onglet Relances programmées -->
            <div class="reminders-section">
                <h2><?php echo $t['tab_reminders']; ?></h2>
                <!-- Possiblité d'edit le code pour afficher les relances programmées -->
                <!-- exemple : liste des relances issues du fichier follow_ups.json -->
            </div>
        <?php elseif ($currentTab == 'luma'): ?>
            <!-- Onglet Événements Luma -->
            <div class="luma-events">
                <h2><?php echo $t['luma_title']; ?></h2>
                
                <!-- Filtres pour types d'events Luma -->
                <div class="event-filters mb-4">
                    <div class="btn-group" role="group" aria-label="Filtres d'événements">
                        <a href="?lang=<?php echo $userLang; ?>&tab=luma&filter=all<?php echo $testMode ? '&test=1' : ''; ?>" 
                           class="btn btn<?php echo $filter == 'all' ? '' : '-outline'; ?>-primary">
                            <?php echo $t['luma_filter_all']; ?>
                        </a>
                        <a href="?lang=<?php echo $userLang; ?>&tab=luma&filter=registered<?php echo $testMode ? '&test=1' : ''; ?>" 
                           class="btn btn<?php echo $filter == 'registered' ? '' : '-outline'; ?>-primary">
                            <?php echo $t['luma_filter_registered']; ?>
                        </a>
                        <a href="?lang=<?php echo $userLang; ?>&tab=luma&filter=organized<?php echo $testMode ? '&test=1' : ''; ?>" 
                           class="btn btn<?php echo $filter == 'organized' ? '' : '-outline'; ?>-primary">
                            <?php echo $t['luma_filter_organized']; ?>
                        </a>
                    </div>
                </div>
                
                <?php if (empty($lumaEvents)): ?>
                    <p><?php echo $t['luma_no_events']; ?></p>
                <?php else: ?>
                    <div class="events-grid">
                        <?php foreach ($lumaEvents as $event): ?>
                            <?php 
                            // Si email avec event_info, extraire les infos d'événement
                            $eventInfo = isset($event['event_info']) ? $event['event_info'] : $event;
                            // Déterminer type d'email (par défaut: inscription)
                            $emailType = isset($eventInfo['email_type']) ? $eventInfo['email_type'] : 'registration';
                            ?>
                            <div class="event-card">
                                <h3><?php echo htmlspecialchars($eventInfo['event_name'] ?? 'Événement sans nom'); ?></h3>
                                
                                <!-- Badge indiquant le type d'événement -->
                                <div class="event-type mb-2">
                                    <span class="badge <?php echo $emailType === 'organizer' ? 'bg-success' : 'bg-info'; ?>">
                                        <?php echo $emailType === 'organizer' ? $t['luma_organizer'] : $t['luma_registration']; ?>
                                    </span>
                                </div>
                                
                                <?php if (!empty($eventInfo['event_date'])): ?>
                                <div class="event-date">
                                    <strong><?php echo $t['luma_date']; ?></strong> <?php echo htmlspecialchars($eventInfo['event_date']); ?>
                                    <?php if (!empty($eventInfo['event_time'])): ?>
                                    <?php echo $t['luma_time']; ?> <?php echo htmlspecialchars($eventInfo['event_time']); ?>
                                    <?php endif; ?>
                                </div>
                                <?php endif; ?>
                                
                                <?php if (!empty($eventInfo['event_location'])): ?>
                                <div class="event-location">
                                    <strong><?php echo $t['luma_location']; ?></strong> <?php echo htmlspecialchars($eventInfo['event_location']); ?>
                                </div>
                                <?php endif; ?>
                                
                                <?php if (!empty($eventInfo['organizer'])): ?>
                                <div class="event-organizer">
                                    <strong><?php echo $t['luma_email_organizer']; ?></strong> <?php echo htmlspecialchars($eventInfo['organizer']); ?>
                                </div>
                                <?php endif; ?>
                                
                                <div class="event-links">
                                    <?php if (!empty($eventInfo['event_url'])): ?>
                                    <a href="<?php echo htmlspecialchars($eventInfo['event_url']); ?>" target="_blank" class="button">
                                        <?php echo $t['luma_view_event']; ?>
                                    </a>
                                    <?php endif; ?>
                                    
                                    <?php if (!empty($eventInfo['calendar_link'])): ?>
                                    <a href="<?php echo htmlspecialchars($eventInfo['calendar_link']); ?>" target="_blank" class="button">
                                        <?php echo $t['luma_add_calendar']; ?>
                                    </a>
                                    <?php endif; ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    </div>

    <!-- Modalprogrammation relance manuelle -->
    <div class="modal fade" id="scheduleModal" tabindex="-1" aria-labelledby="scheduleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form action="?lang=<?php echo $userLang; ?>&tab=emails&action=schedule<?php echo $testMode ? '&test=1' : ''; ?>"
                    method="post">
                    <input type="hidden" name="id" id="emailIdInput">
                    <div class="modal-header">
                        <h5 class="modal-title" id="scheduleModalLabel"><?php echo $t['modal_title']; ?></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="follow_up_date" class="form-label"><?php echo $t['modal_date']; ?></label>
                            <input type="datetime-local" class="form-control" id="follow_up_date" name="follow_up_date"
                                required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"
                            data-bs-dismiss="modal"><?php echo $t['modal_cancel']; ?></button>
                        <button type="submit" class="btn btn-primary"><?php echo $t['modal_schedule']; ?></button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Script pour le modal de programmation
        document.addEventListener('DOMContentLoaded', function () {
            const scheduleModal = document.getElementById('scheduleModal');
            if (scheduleModal) {
                scheduleModal.addEventListener('show.bs.modal', function (event) {
                    const button = event.relatedTarget;
                    const emailId = button.getAttribute('data-email-id');
                    const emailIdInput = document.getElementById('emailIdInput');
                    emailIdInput.value = emailId;

                    // Date par défaut (délai par défaut configuré)
                    const now = new Date();
                    now.setDate(now.getDate() + 7); // Délai par défaut d'une semaine
                    const defaultDate = now.toISOString().slice(0, 16);
                    document.getElementById('follow_up_date').value = defaultDate;
                });
            }
        });
    </script>
</body>

</html>