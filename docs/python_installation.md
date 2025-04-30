# Installation des dépendances Python

Ce guide explique comment installer les dépendances Python nécessaires pour utiliser les modèles Transformers de Hugging Face dans le projet Email Analyzer.

## 1. Prérequis

- Python 3.7 ou supérieur
- pip (gestionnaire de paquets Python)
- Un environnement virtuel Python (recommandé)

## 2. Création et activation de l'environnement virtuel

### Sur Windows

```bash
# Dans le dossier du projet, créez un environnement virtuel
python -m venv venv

# Activez l'environnement virtuel
venv\Scripts\activate
```

### Sur Linux/macOS

```bash
# Dans le dossier du projet, créez un environnement virtuel
python3 -m venv venv

# Activez l'environnement virtuel
source venv/bin/activate
```

## 3. Installation des dépendances

### Pour un ordinateur standard

```bash
# Installation des dépendances principales
pip install transformers torch numpy
```

### Pour un Raspberry Pi ou un appareil avec des ressources limitées

```bash
# Installation optimisée pour les appareils avec des ressources limitées
pip install transformers --no-deps
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install numpy
```

## 4. Téléchargement préalable des modèles (optionnel mais recommandé)

Pour éviter les temps de chargement longs lors de la première utilisation, vous pouvez télécharger les modèles à l'avance :

```bash
# Exécutez ces commandes dans votre environnement Python activé
python -c "from transformers import AutoTokenizer, AutoModelForSequenceClassification; AutoTokenizer.from_pretrained('distilbert-base-uncased'); AutoModelForSequenceClassification.from_pretrained('distilbert-base-uncased')"

python -c "from transformers import AutoTokenizer, AutoModelForTokenClassification; AutoTokenizer.from_pretrained('jean-baptiste/camembert-ner'); AutoModelForTokenClassification.from_pretrained('jean-baptiste/camembert-ner')"

python -c "from transformers import AutoTokenizer, AutoModelForSequenceClassification; AutoTokenizer.from_pretrained('papluca/xlm-roberta-base-language-detection'); AutoModelForSequenceClassification.from_pretrained('papluca/xlm-roberta-base-language-detection')"
```

## 5. Vérification de l'installation

Pour vérifier que l'installation a réussi, exécutez :

```bash
python -c "import torch; import transformers; import numpy; print('Installation réussie!')"
```

## Notes importantes

1. **Mémoire requise** : Les modèles Transformers nécessitent au moins 2 Go de RAM disponible. Sur un Raspberry Pi, assurez-vous d'avoir suffisamment de mémoire ou ajustez la taille du swap.

2. **Première exécution** : Le premier chargement des modèles peut prendre plusieurs minutes, surtout sur des appareils avec des ressources limitées. Les chargements suivants seront plus rapides car les modèles seront mis en cache.

3. **Mise à jour des dépendances** : Si vous rencontrez des problèmes avec les versions des dépendances, vous pouvez les mettre à jour :

   ```bash
   pip install --upgrade transformers torch numpy
   ```

4. **Désactivation de l'environnement virtuel** : Quand vous avez fini de travailler, vous pouvez désactiver l'environnement virtuel :

   ```bash
   deactivate
   ```

5. **Problèmes connus** : Sur certains systèmes, l'installation de PyTorch peut échouer. Dans ce cas, consultez la documentation officielle de PyTorch pour des instructions spécifiques à votre plateforme : https://pytorch.org/get-started/locally/