<?php
/**
 * Classe pour récupérer les emails depuis Gmail
 */

// Importation des classes Google API avec namespaces
use Google\Client;
use Google\Service\Gmail;
use Google\Service\Gmail\Message;
use Google\Service\Gmail\MessagePart;
// use Exception;

class GmailFetcher
{
    private $client;
    private $service;
    private $config;

    /**
     * Constructeur - Initialise le client Google et le service Gmail
     */
    public function __construct()
    {
        // Chargement de la configuration
        $this->config = require_once __DIR__ . '/../config.php';

        // Création du client Google avec les paramètres de la configuration
        $this->client = new Client();
        $this->client->setApplicationName($this->config['gmail']['application_name']);
        $this->client->setScopes(Gmail::GMAIL_READONLY);
        $this->client->setAuthConfig($this->config['gmail']['credentials_path']);
        $this->client->setAccessType('offline');
        $this->client->setPrompt('select_account consent');

        // Vérification du token d'accès
        $tokenPath = $this->config['gmail']['token_path'];
        if (file_exists($tokenPath)) {
            $accessToken = json_decode(file_get_contents($tokenPath), true);
            $this->client->setAccessToken($accessToken);
        }

        // Obtention d'un nouveau token si nécessaire
        if ($this->client->isAccessTokenExpired()) {
            if ($this->client->getRefreshToken()) {
                $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
            } else {
                // Si vous n'avez pas de token de rafraîchissement, utiliser le serveur de redirection
                // Pour un script CLI, ça peut être délicat - il faudra génerer un token en amont ?
                $authUrl = $this->client->createAuthUrl();
                printf("Ouvrez ce lien dans votre navigateur:\n%s\n", $authUrl);
                print 'Entrez le code de vérification: ';
                $authCode = trim(fgets(STDIN));

                $accessToken = $this->client->fetchAccessTokenWithAuthCode($authCode);
                $this->client->setAccessToken($accessToken);

                if (array_key_exists('error', $accessToken)) {
                    throw new Exception(join(', ', $accessToken));
                }
            }

            // Sauvegarde du token
            if (!file_exists(dirname($tokenPath))) {
                mkdir(dirname($tokenPath), 0700, true);
            }
            file_put_contents($tokenPath, json_encode($this->client->getAccessToken()));
        }

        // Création du service Gmail
        $this->service = new Gmail($this->client);
    }

    /**
     * Récupère les emails récents
     * @param int $maxResults Nombre maximum d'emails à récupérer
     * @return array Liste des emails récupérés
     */
    public function fetchEmails($maxResults = null)
    {
        // Si maxResults n'est pas spécifié, utiliser la valeur de la configuration
        if ($maxResults === null) {
            $maxResults = $this->config['ui']['items_per_page'];
        }

        // Récupération des emails récents
        $userId = 'me';
        $messages = [];

        try {
            // Liste des messages
            $messageList = $this->service->users_messages->listUsersMessages($userId, [
                'maxResults' => $maxResults
            ]);

            if ($messageList->getMessages()) {
                foreach ($messageList->getMessages() as $message) {
                    // Récupération des détails du message
                    $msg = $this->service->users_messages->get($userId, $message->getId());
                    $emailData = $this->parseMessage($msg);

                    $messages[] = $emailData;
                }
            }
        } catch (Exception $e) {
            if ($this->config['debug']['enabled']) {
                error_log('Une erreur est survenue : ' . $e->getMessage());
            }
            throw $e;
        }

        return $messages;
    }

    /**
     * Récupère un email par son ID
     * @param string $emailId ID de l'email à récupérer
     * @return array Détails de l'email
     */
    public function fetchEmailById($emailId)
    {
        $userId = 'me';

        try {
            // Récupération du message
            $message = $this->service->users_messages->get($userId, $emailId);
            $emailData = $this->parseMessage($message);

            return $emailData;
        } catch (Exception $e) {
            if ($this->config['debug']['enabled']) {
                error_log('Une erreur est survenue : ' . $e->getMessage());
            }
            throw $e;
        }
    }

    /**
     * Recherche les emails liés à des événements Lu.ma
     * @param string $type Type d'emails à rechercher ('all', 'registration', 'organizer')
     * @param int $maxResults Nombre maximum d'emails à récupérer
     * @return array Liste des emails d'événements Lu.ma
     */
    public function fetchLumaEventEmails($type = 'all', $maxResults = null)
    {
        // Si maxResults n'est pas spécifié, utiliser la valeur de la configuration
        if ($maxResults === null) {
            $maxResults = $this->config['ui']['items_per_page'] * 2; // Par défaut, rechercher plus d'emails pour les événements Lu.ma
        }

        $userId = 'me';
        $lumaEmails = [];
        $scraper = new LumaScraper();

        try {
            // Construction de la requête pour rechercher des emails Lu.ma
            $query = 'from:lu.ma OR subject:"event" OR subject:"événement"';

            // Liste des messages correspondants à la requête
            $messageList = $this->service->users_messages->listUsersMessages($userId, [
                'maxResults' => $maxResults,
                'q' => $query
            ]);

            if ($messageList->getMessages()) {
                foreach ($messageList->getMessages() as $message) {
                    // Récupération des détails du message
                    $msg = $this->service->users_messages->get($userId, $message->getId());
                    $emailData = $this->parseMessage($msg);

                    // Utilisation du scraper pour extraire les infos d'événement
                    $eventInfo = $scraper->scrapeEmail($emailData);

                    // Si c'est bien un email Lu.ma avec des infos d'événement
                    if ($eventInfo !== null) {
                        // Filtrer selon le type demandé
                        if (
                            $type == 'all' ||
                            ($type == 'registration' && $eventInfo['email_type'] == 'registration') ||
                            ($type == 'organizer' && $eventInfo['email_type'] == 'organizer')
                        ) {
                            $emailData['event_info'] = $eventInfo;
                            $lumaEmails[] = $emailData;
                        }
                    }
                }
            }
        } catch (Exception $e) {
            if ($this->config['debug']['enabled']) {
                error_log('Une erreur est survenue : ' . $e->getMessage());
            }
            throw $e;
        }

        return $lumaEmails;
    }

    /**
     * Parse un message Gmail
     * @param Message $message Message à parser
     * @return array Détails du message
     */
    private function parseMessage($message)
    {
        $payload = $message->getPayload();
        $headers = $payload->getHeaders();

        $emailData = [
            'id' => $message->getId(),
            'threadId' => $message->getThreadId(),
            'subject' => '',
            'from' => '',
            'date' => '',
            'body' => ''
        ];

        // Extraction des en-têtes
        foreach ($headers as $header) {
            switch ($header->getName()) {
                case 'Subject':
                    $emailData['subject'] = $header->getValue();
                    break;
                case 'From':
                    $emailData['from'] = $header->getValue();
                    break;
                case 'Date':
                    $emailData['date'] = $header->getValue();
                    break;
            }
        }

        // Extraction du corps du message
        $emailData['body'] = $this->getMessageBody($payload);

        return $emailData;
    }

    /**
     * Extrait le corps du message
     * @param MessagePart $payload Payload du message
     * @return string Corps du message
     */
    private function getMessageBody($payload)
    {
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
}