# Extension navigateur Exantrix

Extension pour Chrome, Edge, Brave, Opera (Manifest V3) et Firefox : vendre sur la marketplace [Exantrix](https://exantrix.com) depuis n'importe quelle boutique, et faire fabriquer ce que l'on voit.

- **Vendre sur Exantrix** : sur une fiche produit de votre boutique (WooCommerce, PrestaShop, Shopify, Etsy, Wix, votre propre site…), l'icône lit la fiche (JSON-LD Product ou Open Graph : titre, prix, référence, images, description), vous vérifiez, un clic l'envoie sur Exantrix par l'[API vendeur](https://exantrix.com/extensions/api) avec votre jeton. Une référence connue est mise à jour, une nouvelle passe en validation.
- **Faire fabriquer sur Exantrix** : clic droit sur une page, une image, un lien ou une sélection de texte : ouvre le [formulaire de devis](https://exantrix.com/a2/de1) pré-rempli avec ce que vous regardiez (fichier 3D, visuel, objet).

Le jeton API reste dans le navigateur (`chrome.storage.local`). Aucune donnée n'est envoyée sans un clic.

## Installation (développement)

Chrome / Edge / Brave : `chrome://extensions` › Mode développeur › Charger l'extension non empaquetée › ce dossier.
Firefox : `about:debugging#/runtime/this-firefox` › Charger un module temporaire › `manifest.json`.

## Les extensions Exantrix

- [WordPress / WooCommerce](https://github.com/tony-dev-web/exantrix-marketplace-wordpress) · [PrestaShop](https://github.com/tony-dev-web/exantrix-marketplace-prestashop) · [Shopify](https://github.com/tony-dev-web/exantrix-marketplace-shopify) · [Magento 2](https://github.com/tony-dev-web/exantrix-marketplace-magento) · [Drupal Commerce](https://github.com/tony-dev-web/exantrix-marketplace-drupal) · [CSV, Odoo, Dolibarr](https://github.com/tony-dev-web/exantrix-marketplace-connecteurs) · [API Postman / OpenAPI](https://github.com/tony-dev-web/exantrix-api)
- Toutes les extensions : https://exantrix.com/extensions/

Licence MIT.
