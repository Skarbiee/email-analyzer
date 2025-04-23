<?php
/**
 * Classe pour communiquer avec les scripts Python
 */
class PythonBridge {
    private $pythonPath;
    private $scriptPath;
    
    /**
     * Constructeur
     * @param string $pythonPath Chemin vers l'exécutable Python
     * @param string $scriptPath Chemin vers le script Python
     */
    public function __construct($pythonPath = 'python', $scriptPath = null) {
        $this->pythonPath = $pythonPath;
        
        // Si aucun chemin de script n'est fourni, utilisez le chemin par défaut 
        // par rapport à l'emplacement de cette classe
        if ($scriptPath === null) {
            $this->scriptPath = __DIR__ . '/python/analyze_email.py';
        } else {
            $this->scriptPath = $scriptPath;
        }
    }
    
    /**
     * Analyse un email avec le script Python
     * @param string $emailContent Contenu de l'email à analyser
     * @return array Résultats de l'analyse
     */
    public function analyzeEmail($emailContent) {
        // Création d'un fichier temporaire pour stocker le contenu de l'email
        $tempFile = tempnam(sys_get_temp_dir(), 'email_');
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
            throw new Exception("Erreur lors de l'exécution du script Python: " . implode("\n", $output));
        }
        
        // On s'attend à recevoir du JSON
        $jsonOutput = implode("\n", $output);
        $result = json_decode($jsonOutput, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Erreur lors du décodage de la sortie JSON: " . json_last_error_msg());
        }
        
        return $result;
    }
}