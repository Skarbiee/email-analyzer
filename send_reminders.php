<?php
/**
 * Script pour envoyer les relances automatiques
 * À exécuter via cron sur le Raspberry Pi
 */

// Inclusion de l'autoloader Composer
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/src/PythonBridge.php';

use Google\Client;
use Google\Service\Gmail;
use Google\Service\Gmail\Message;

class AutoReminder
{
    private $client;
    private $service;
    private $analyzer;

    // Templates multilingues pour les emails de relance
    private $emailTemplates = [
        'fr' => [
            'subject_prefix' => 'Relance : ',
            'body' => "Bonjour,\n\nJe me permets de vous relancer concernant notre précédent échange au sujet de \"{subject}\".\n\nEn effet, vous aviez indiqué vouloir me recontacter {time_reference}.\n\nN'hésitez pas à me faire savoir si vous avez besoin d'informations complémentaires.\n\nCordialement,\n{sender}"
        ],
        'en' => [
            'subject_prefix' => 'Follow-up: ',
            'body' => "Hello,\n\nI'm following up on our previous exchange about \"{subject}\".\n\nYou mentioned that you wanted to get back to me {time_reference}.\n\nPlease let me know if you need any additional information.\n\nBest regards,\n{sender}"
        ]
    ];

    /**
     * Constructeur
     */
    public function __construct()
    {
        // Création du client Google
        $this->client = new Client();
        $this->client->setApplicationName('Email Reminder');
        $this->client->setScopes([
            Gmail::GMAIL_READONLY,
            Gmail::GMAIL_SEND
        ]);
        $this->client->setAuthConfig(__DIR__ . '/credentials.json');
        $this->client->setAccessType('offline');

        // Vérification du token d'accès
        $tokenPath = __DIR__ . '/token.json';
        if (file_exists($tokenPath)) {
            $accessToken = json_decode(file_get_contents($tokenPath), true);
            $this->client->setAccessToken($accessToken);
        }

        // Obtention d'un nouveau token si nécessaire
        if ($this->client->isAccessTokenExpired()) {
            if ($this->client->getRefreshToken()) {
                $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
                file_put_contents($tokenPath, json_encode($this->client->getAccessToken()));
            } else {
                die("Token expiré et aucun refresh token disponible. Veuillez réauthentifier via l'interface web.");
            }
        }

        // Création du service Gmail
        $this->service = new Gmail($this->client);

        // Création de l'analyseur Python
        $this->analyzer = new PythonBridge('python', __DIR__ . '/src/python/analyze_email.py');
    }

    /**
     * Traite toutes les relances programmées
     */
    public function processReminders()
    {
        // Lecture des relances programmées
        $followUpsFile = __DIR__ . '/follow_ups.json';
        if (!file_exists($followUpsFile)) {
            echo "Aucune relance programmée.\n";
            return;
        }

        $followUps = json_decode(file_get_contents($followUpsFile), true);
        if (empty($followUps)) {
            echo "Aucune relance programmée.\n";
            return;
        }

        $now = new DateTime();
        $updated = false;

        foreach ($followUps as &$followUp) {
            if ($followUp['status'] !== 'pending') {
                continue;
            }

            $scheduledDate = new DateTime($followUp['scheduled_date']);

            // Si la date de relance est passée, envoi de la relance
            if ($scheduledDate <= $now) {
                try {
                    $this->sendReminder($followUp);
                    $followUp['status'] = 'sent';
                    $followUp['sent_date'] = $now->format('c');
                    echo "Relance envoyée pour " . $followUp['subject'] . "\n";
                    $updated = true;
                } catch (Exception $e) {
                    $followUp['status'] = 'error';
                    $followUp['error'] = $e->getMessage();
                    echo "Erreur lors de l'envoi de la relance pour " . $followUp['subject'] . ": " . $e->getMessage() . "\n";
                    $updated = true;
                }
            }
        }

        // Mise à jour du fichier si nécessaire
        if ($updated) {
            file_put_contents($followUpsFile, json_encode($followUps, JSON_PRETTY_PRINT));
        } else {
            echo "Aucune relance à envoyer pour le moment.\n";
        }
    }

    /**
     * Envoie un email de relance
     * 
     * @param array $followUp Informations sur la relance
     * @return boolean Succès de l'envoi
     */
    private function sendReminder($followUp)
    {
        // Récupération du thread original
        $threadId = $followUp['thread_id'];
        $thread = $this->service->users_threads->get('me', $threadId);

        // Récupération du premier message du thread
        $firstMessage = $thread->getMessages()[0];

        // Extraction des informations nécessaires
        $recipient = $this->extractRecipient($firstMessage);
        $originalSubject = $followUp['subject'];
        $originalBody = $this->extractMessageBody($firstMessage);

        // Détection de la langue du message original
        try {
            $analysis = $this->analyzer->analyzeEmail($originalBody);
            $language = $analysis['language'] ?? 'en';  // Par défaut en anglais si non détecté
        } catch (Exception $e) {
            // En cas d'erreur, on utilise l'anglais par défaut
            $language = 'en';
        }

        // Sélection du template selon la langue
        if (!isset($this->emailTemplates[$language])) {
            $language = 'en';  // Fallback sur l'anglais si la langue n'est pas supportée
        }

        // Création du message de relance
        $sender = $this->getSenderInfo();
        $timeReference = $followUp['time_reference'] ?? 'soon';

        $template = $this->emailTemplates[$language];
        $subject = $template['subject_prefix'] . $originalSubject;
        $body = strtr($template['body'], [
            '{subject}' => $originalSubject,
            '{time_reference}' => $timeReference,
            '{sender}' => $sender['name']
        ]);

        // Création du message Gmail
        $email = $this->createEmail($sender['email'], $recipient, $subject, $body, $threadId);

        // Envoi du message
        $this->service->users_messages->send('me', $email);

        return true;
    }

    /**
     * Extrait le destinataire à partir du message
     * 
     * @param Message $message Message Gmail
     * @return string Adresse email du destinataire
     */
    private function extractRecipient($message)
    {
        $headers = $message->getPayload()->getHeaders();

        // Recherche de l'en-tête "From"
        foreach ($headers as $header) {
            if ($header->getName() === 'From') {
                $from = $header->getValue();

                // Extraction de l'adresse email
                if (preg_match('/<(.+?)>/', $from, $matches)) {
                    return $matches[1];
                } else {
                    return $from;
                }
            }
        }

        throw new Exception("Impossible de trouver le destinataire");
    }

    /**
     * Extrait le corps du message
     * 
     * @param Message $message Message Gmail
     * @return string Corps du message
     */
    private function extractMessageBody($message)
    {
        $payload = $message->getPayload();
        $body = '';

        if ($payload->getBody()->getData()) {
            $body = base64_decode(str_replace(['-', '_'], ['+', '/'], $payload->getBody()->getData()));
        } else if ($payload->getParts()) {
            foreach ($payload->getParts() as $part) {
                if ($part->getMimeType() === 'text/plain') {
                    $body = base64_decode(str_replace(['-', '_'], ['+', '/'], $part->getBody()->getData()));
                    break;
                }
            }
        }

        return $body;
    }

    /**
     * Récupère les informations de l'expéditeur (nous)
     * 
     * @return array Informations sur l'expéditeur (nom et email)
     */
    private function getSenderInfo()
    {
        // Récupération de l'adresse email de l'utilisateur
        try {
            $profile = $this->service->users->getProfile('me');
            $email = $profile->getEmailAddress();
        } catch (Exception $e) {
            // Fallback si impossible de récupérer l'email
            $email = 'noreply@example.com'; // Remplacer par la vraie addresse email.
        }

        // Nom d'expéditeur fixe
        $name = "Service de relance automatique";

        return [
            'name' => $name,
            'email' => $email
        ];
    }

    /**
     * Crée un email au format Gmail
     * 
     * @param string $from Adresse email de l'expéditeur
     * @param string $to Adresse email du destinataire
     * @param string $subject Sujet de l'email
     * @param string $body Corps de l'email
     * @param string $threadId ID du thread auquel répondre (optionnel)
     * @return Message Message Gmail
     */
    private function createEmail($from, $to, $subject, $body, $threadId = null)
    {
        $email = new Message();

        // Création des en-têtes
        $headers = [
            'From' => $from,
            'To' => $to,
            'Subject' => $subject,
            'Content-Type' => 'text/plain; charset=UTF-8'
        ];

        // Si on répond à un thread existant
        if ($threadId) {
            $email->setThreadId($threadId);
            $headers['In-Reply-To'] = $threadId;
            $headers['References'] = $threadId;
        }

        // Construction du message au format RFC 822
        $message = '';
        foreach ($headers as $name => $value) {
            $message .= "$name: $value\r\n";
        }
        $message .= "\r\n$body";

        // Encodage du message en base64 pour Gmail
        $encodedMessage = rtrim(strtr(base64_encode($message), '+/', '-_'), '=');
        $email->setRaw($encodedMessage);

        return $email;
    }
}

// Exécution du script
try {
    $reminder = new AutoReminder();
    $reminder->processReminders();
} catch (Exception $e) {
    echo "Erreur : " . $e->getMessage() . "\n";
    exit(1);
}

exit(0);