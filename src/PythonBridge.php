<?php
/**
 * Classe pour communiquer avec les scripts Python
 */
class PythonBridge {
    private $pythonPath;
    private $scriptPath;
    private $config;
    
    /**
     * Constructeur
     */
    public function __construct() {
        // Chargement de la configuration
        // S'assurer que config.php existe et renvoie bien un tableau
        $configFile = __DIR__ . '/../config.php';
        if (file_exists($configFile)) {
            $this->config = require $configFile;
            
            // Vérifier que $this->config est bien un tableau avant d'y accéder
            if (is_array($this->config)) {
                // Utilisation des paramètres de la configuration avec vérifications
                $this->pythonPath = isset($this->config['python']['executable']) ? 
                    $this->config['python']['executable'] : 'python';
                $this->scriptPath = isset($this->config['python']['analyze_script']) ? 
                    $this->config['python']['analyze_script'] : __DIR__ . '/python/analyze_email.py';
            } else {
                // Fallback en cas de problème avec config.php
                $this->pythonPath = 'python';
                $this->scriptPath = __DIR__ . '/python/analyze_email.py';
            }
        } else {
            // Si config.php n'existe pas, utiliser les valeurs par défaut
            $this->pythonPath = 'python';
            $this->scriptPath = __DIR__ . '/python/analyze_email.py';
        }
    }
    
    /**
     * Analyse un email avec le script Python amélioré avec Transformers
     * 
     * @param string $emailContent Contenu de l'email à analyser
     * @return array Résultats de l'analyse
     */
    public function analyzeEmail($emailContent) {
        // Création d'un fichier temporaire pour stocker le contenu de l'email
        $tempDir = sys_get_temp_dir(); // Utiliser le répertoire temporaire du système par défaut
        
        // Si config existe et contient un chemin temporaire personnalisé, l'utiliser
        if (is_array($this->config) && isset($this->config['paths']['temp'])) {
            $tempDir = $this->config['paths']['temp'];
        }
        
        $tempFile = tempnam($tempDir, 'email_');
        file_put_contents($tempFile, $emailContent);
        
        // Construction de la commande
        $command = escapeshellcmd($this->pythonPath . ' ' . $this->scriptPath . ' --file ' . $tempFile);
        
        // Exécution de la commande Python
        $output = [];
        $returnCode = 0;
        exec($command, $output, $returnCode);
        
        // Suppression du fichier temporaire
        unlink($tempFile);
        
        // Traitement de la sortie
        if ($returnCode !== 0) {
            // Journalisation de l'erreur si le mode debug est activé
            if (is_array($this->config) && isset($this->config['debug']['enabled']) && $this->config['debug']['enabled']) {
                error_log("Erreur Python: " . implode("\n", $output));
            }
            throw new Exception("Erreur lors de l'exécution du script Python: " . implode("\n", $output));
        }
        
        // On s'attend à recevoir du JSON
        $jsonOutput = implode("\n", $output);
        $result = json_decode($jsonOutput, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            // Journalisation de l'erreur si le mode debug est activé
            if (is_array($this->config) && isset($this->config['debug']['enabled']) && $this->config['debug']['enabled']) {
                error_log("Erreur JSON: " . json_last_error_msg() . " - Output: " . $jsonOutput);
            }
            throw new Exception("Erreur lors du décodage de la sortie JSON: " . json_last_error_msg());
        }
        
        return $result;
    }
}