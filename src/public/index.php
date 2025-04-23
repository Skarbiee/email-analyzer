<?php

// Gestion de la langue
$supportedLanguages = ['fr' => 'Français', 'en' => 'English'];
$userLang = $_GET['lang'] ?? 'fr';
if (!array_key_exists($userLang, $supportedLanguages)) {
    $userLang = 'fr';
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
        'error' => 'Erreur :'
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
        'error' => 'Error:'
    ]
];

$t = $translations[$userLang];

// Affichage de toutes les erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Inclusion de l'autoloader Composer
require_once __DIR__ . '/../../vendor/autoload.php';

// Inclusion des classes personnalisées
require_once __DIR__ . '/../GmailFetcher.php';
require_once __DIR__ . '/../PythonBridge.php';

// Vérification si nous sommes en mode test (sans connexion Gmail)
$testMode = isset($_GET['test']) || !file_exists(__DIR__ . '/../../credentials.json');

// Récupération des emails récents
$action = $_GET['action'] ?? 'list';
$emailId = $_GET['id'] ?? '';
$message = '';
$emails = [];

// Si nous sommes en mode test, utilisez des données de test
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
    
    // Analyse simulée des emails de test
    if ($action == 'list') {
        $message = $t['test_mode'];
        $analyzer = new PythonBridge('python', __DIR__ . '/../python/analyze_email.py');
        
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
                $analyzer = new PythonBridge('python', __DIR__ . '/../python/analyze_email.py');
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
        $analyzer = new PythonBridge('python', __DIR__ . '/../python/analyze_email.py');
        
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
                $emails = $fetcher->fetchEmails(10);
                
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
function scheduleFollowUp($email, $customDate = null) {
    // Date de relance (soit personnalisée, soit celle de l'analyse)
    $followUpDate = $customDate ?? $email['analysis']['follow_up_date'] ?? null;
    
    if (!$followUpDate) {
        // Si pas de date définie, on utilise une semaine par défaut
        $followUpDate = date('c', strtotime('+1 week'));
    }
    
    // Ici, on pourrait utiliser une base de données pour stocker les relances
    // Exemple simple avec un fichier JSON
    $followUps = [];
    $followUpsPath = __DIR__ . '/../../follow_ups.json';
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
    </style>
</head>
<body>
    <div class="container mt-4">
        <h1><?php echo $t['title']; ?></h1>
        
        <div class="language-selector">
            <span><?php echo $t['language_selector']; ?></span>
            <?php foreach ($supportedLanguages as $code => $name): ?>
                <a href="?lang=<?php echo $code; ?><?php echo $testMode ? '&test=1' : ''; ?><?php echo !empty($action) && $action != 'list' ? '&action=' . $action : ''; ?><?php echo !empty($emailId) ? '&id=' . $emailId : ''; ?>" class="btn btn-sm <?php echo $userLang == $code ? 'btn-primary' : 'btn-outline-primary'; ?>">
                    <?php echo $name; ?>
                </a>
            <?php endforeach; ?>
        </div>
        
        <div class="alert alert-<?php echo $testMode ? 'warning' : 'info'; ?> mb-4">
            <?php if ($testMode): ?>
                <strong><?php echo $t['test_mode']; ?></strong>
                <?php if (!file_exists(__DIR__ . '/../../credentials.json')): ?>
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
                <a href="?lang=<?php echo $userLang; ?>&action=list<?php echo $testMode ? '&test=1' : ''; ?>" class="btn btn-primary"><?php echo $t['refresh_list']; ?></a>
                <?php if (!$testMode): ?>
                    <a href="?lang=<?php echo $userLang; ?>&test=1" class="btn btn-outline-secondary"><?php echo $t['test_mode_btn']; ?></a>
                <?php else: ?>
                    <a href="?lang=<?php echo $userLang; ?>" class="btn btn-outline-success"><?php echo $t['normal_mode_btn']; ?></a>
                <?php endif; ?>
            </div>
        </div>
        
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
                        <tr class="<?php echo isset($email['analysis']['needs_follow_up']) && $email['analysis']['needs_follow_up'] ? 'needs-follow-up' : ''; ?>">
                            <td><?php echo $email['date']; ?></td>
                            <td><?php echo htmlspecialchars($email['from']); ?></td>
                            <td><?php echo htmlspecialchars($email['subject']); ?></td>
                            <td>
                                <?php if (isset($email['analysis']['needs_follow_up']) && $email['analysis']['needs_follow_up']): ?>
                                    <span class="badge bg-warning">
                                        <?php echo $t['need_followup']; ?> <?php echo $email['analysis']['time_reference']; ?>
                                        (<?php echo $email['analysis']['follow_up_date']; ?>)
                                    </span>
                                <?php else: ?>
                                    <span class="badge bg-secondary"><?php echo $t['no_followup']; ?></span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <a href="?lang=<?php echo $userLang; ?>&action=analyze&id=<?php echo $email['id']; ?><?php echo $testMode ? '&test=1' : ''; ?>" class="btn btn-sm btn-info"><?php echo $t['action_analyze']; ?></a>
                                <button type="button" class="btn btn-sm btn-primary" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#scheduleModal" 
                                        data-email-id="<?php echo $email['id']; ?>">
                                    <?php echo $t['action_schedule']; ?>
                                </button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
    
    <!-- Modal pour programmer une relance manuelle -->
    <div class="modal fade" id="scheduleModal" tabindex="-1" aria-labelledby="scheduleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form action="?lang=<?php echo $userLang; ?>&action=schedule<?php echo $testMode ? '&test=1' : ''; ?>" method="post">
                    <input type="hidden" name="id" id="emailIdInput">
                    <div class="modal-header">
                        <h5 class="modal-title" id="scheduleModalLabel"><?php echo $t['modal_title']; ?></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="follow_up_date" class="form-label"><?php echo $t['modal_date']; ?></label>
                            <input type="datetime-local" class="form-control" id="follow_up_date" name="follow_up_date" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?php echo $t['modal_cancel']; ?></button>
                        <button type="submit" class="btn btn-primary"><?php echo $t['modal_schedule']; ?></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Script pour le modal de programmation
        document.addEventListener('DOMContentLoaded', function() {
            const scheduleModal = document.getElementById('scheduleModal');
            if (scheduleModal) {
                scheduleModal.addEventListener('show.bs.modal', function(event) {
                    const button = event.relatedTarget;
                    const emailId = button.getAttribute('data-email-id');
                    const emailIdInput = document.getElementById('emailIdInput');
                    emailIdInput.value = emailId;
                    
                    // Date par défaut (dans une semaine)
                    const now = new Date();
                    now.setDate(now.getDate() + 7);
                    const defaultDate = now.toISOString().slice(0, 16);
                    document.getElementById('follow_up_date').value = defaultDate;
                });
            }
        });
    </script>
</body>
</html>