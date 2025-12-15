# TODO - Bartender

## Feature: Import cocktails classiques depuis Google Sheets

### Description
Importer une liste de cocktails classiques depuis un Google Sheet vers Supabase. Ces cocktails seront affichés dans les résultats de recherche, avec priorité sur les résultats de l'API externe.

### Comportement attendu
- Les résultats de recherche afficheront d'abord les cocktails importés (stockés dans Supabase)
- Les résultats de l'API externe (API-Ninjas) s'afficheront en dessous
- Distinction visuelle possible entre les deux sources

### Tâches
- [ ] Créer/adapter la structure de la table Supabase pour les cocktails importés
- [ ] Configurer l'accès au Google Sheet (API Google Sheets ou export CSV)
- [ ] Créer un script d'import des données
- [ ] Modifier la page Search pour interroger Supabase en parallèle de l'API
- [ ] Afficher les résultats Supabase en premier, puis les résultats API
- [ ] Ajouter un indicateur visuel pour différencier les sources (optionnel)
