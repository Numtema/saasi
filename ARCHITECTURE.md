# Architecture Nümtema Face - Lead Generation Machine

Ce document sert de guide de référence pour les agents IA et les développeurs souhaitant modifier l'application.

## 🎨 Système de Design (Atomic CSS & Variables)

L'application utilise un système de thèmes basé sur des variables CSS injectées dans le `:root`. 

### Variables de Couleurs
Toutes les couleurs de texte et de fond DOIVENT utiliser ces variables pour garantir la compatibilité Dark/Light mode :
- `--bg-app` : Fond principal de l'application.
- `--bg-surface` : Fond des cartes et panneaux.
- `--text-title` : Couleur pour les titres (H1, H2, H3, labels gras).
- `--text-body` : Couleur pour le texte de lecture.
- `--text-muted` : Couleur pour les textes secondaires ou désactivés.
- `--primary` : Couleur d'accentuation (Orange Nümtema : `#FF4D00`).
- `--border-color` : Couleur des bordures et séparateurs.

### Espacement & Rayons
- Bordures arrondies standard : `24px` ou `32px` (`rounded-[24px]`).
- Sidebar width : `280px`.

## 📁 Structure des Fichiers

- `/types.ts` : Définitions TypeScript (Source unique de vérité pour les données).
- `/theme.ts` : Configuration des palettes de couleurs.
- `/services/` : Logique métier (IA, Stockage).
- `/components/` : Éléments d'interface réutilisables.
  - `FunnelEditor.tsx` : Moteur principal de modification des étapes.
  - `FunnelPreview.tsx` : Player temps réel.
  - `LGMWizard.tsx` : Assistant de création par IA.

## 🛠️ Comment modifier un élément ?

### Changer le style d'un texte
Ne pas utiliser `text-black` ou `text-white`. Utiliser `text-[var(--text-title)]` pour les titres et `text-[var(--text-body)]` pour les paragraphes.

### Ajouter un type d'étape
1. Ajouter le type dans `StepType` (`types.ts`).
2. Mettre à jour `getStepIcon` dans `FunnelEditor.tsx`.
3. Ajouter la logique de rendu dans `FunnelPreview.tsx`.

### Modifier la logique de l'IA
La configuration de génération (prompt système, schéma JSON) se trouve dans `services/geminiService.ts`.
