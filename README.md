# VN_2024_Bachelor

# Design Token Management Pipeline

## Inhaltsverzeichnis
1. [Einführung](#einführung)
2. [Funktionen](#funktionen)
3. [Voraussetzungen](#voraussetzungen)
4. [Installation](#installation)
5. [Verwendung](#verwendung)

## Einführung

Dieses Projekt bietet eine umfassende Lösung zur Verwaltung von Design-Tokens, einschließlich der Validierung, Konvertierung, Differenzanalyse und Kategorisierung von Änderungen. Die Pipeline ist darauf ausgelegt, die Zusammenarbeit zwischen Designern und Entwicklern zu verbessern und eine konsistente Anwendung von Design-Tokens sicherzustellen.

## Funktionen

- **Export von Design-Tokens aus Figma**: Verwendung des Plugins "Variables to JSON" zum Exportieren von Figma-Variablen in JSON.
- **Validierung von JSON-Dateien**: Überprüfung der JSON-Syntax mit JSONLint.
- **Konvertierung von JSON in CSS**: Automatische Konvertierung der JSON-Tokens in CSS-Dateien mit Style Dictionary.
- **CSS-Syntaxprüfung**: Überprüfung der generierten CSS-Dateien auf Syntaxfehler mit StyleLint.
- **Differenzanalyse**: Analyse von Änderungen zwischen verschiedenen Versionen der JSON-Dateien mit `jsondiffpatch`.
- **Kategorisierung der Änderungen**: Kategorisierung von Änderungen als hinzugefügt, geändert oder entfernt.
- **Automatisierung**: Verwendung von GitHub Actions zur Automatisierung des gesamten Prozesses.
- **Transparente Dokumentation**: Posten der Ergebnisse der Kategorisierung als Kommentar im Pull Request.

## Voraussetzungen

- Node.js (Version 16 oder höher)
- NPM (Node Package Manager)
- GitHub CLI (`gh`)

## Installation

1. **Repository klonen**:
   ```bash
   git clone https://github.com/Valmire00/VN_2024_Bachelor.git
   cd repository

 2. **Abhängigkeiten installieren**:
    ```bash
    npm install
    npm install jsondiffpatch

  **Verwendung**
  1. **JSON-Dateien validieren:**
    ```bash
    node validate-json.mjs
  3. **JSON-Tokens in CSS konvertieren:**
    ```bash
     node build.mjs
  5. **CSS-Syntax prüfen:**
     ```bash
     npx stylelint 'dist/theme/*.css' --fix
  7. **Differenzanalyse durchführen:**
    ```bash
     node detect_changes.mjs tokens/ old_tokens/ detected_changes.json
  9. **Änderungen Kategorisieren:**
   ```bash
     node categorize_changes.mjs detected_changes.json categorized_changes.txt



