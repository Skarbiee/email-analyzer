<?php
header('Content-Type: application/json');

// Vérification de la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Récupération du corps de la requête
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['emailContent'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

// Inclusion des classes nécessaires
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../src/PythonBridge.php';

try {
    // Analyse de l'email
    $analyzer = new PythonBridge('python', __DIR__ . '/../src/python/analyze_email.py');
    $result = $analyzer->analyzeEmail($input['emailContent']);

    // Si c'est un email Luma, le détecter également
    if (isset($input['from']) && isset($input['subject'])) {
        require_once __DIR__ . '/../src/LumaScraper.php';
        $scraper = new LumaScraper();
        $emailData = [
            'from' => $input['from'],
            'subject' => $input['subject'],
            'body' => $input['emailContent']
        ];
        $eventInfo = $scraper->scrapeEmail($emailData);
        if ($eventInfo) {
            $result['event_info'] = $eventInfo;
        }
    }

    // Réponse
    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}