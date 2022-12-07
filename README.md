
# Angular-Groupomania :  front-end de l'application du réseau social Groupomania

## Description
  Projet 7 du parcours de Développeur Web d'OpenClassRooms : construire un réseau social d'entreprise. Celui-ci a pour but d'augmenter les relations sociales au sein de l'entreprise et ainsi améliorer l'ambiance entre collaborateurs. 
  
  Ici n'est traité que le front-end. La partie back-end est disponible dans le repository suivant : https://github.com/J-M-C-44/groupomania_backend.git. Il est préférable de démarrer par l'installation du back-end.
##  Installation
  
pré-requis : installer Node et Angular CLI (https://angular.io/cli) si cela n'est pas déjà fait.

1) Dans le terminal, à partir du dossier angular-groupomania, taper `npm install`. Cela installera tout les dépendances.

2) Dans le terminal, toujours à partir du angular-groupomania, taper `ng serve`. Cela lancera le serveur, le message `Compiled successfully` apparaitra une fois le serveur prêt. 

3) Depuis votre navigateur, accéder à l'application via `http://localhost:4200/`

##  Fonctionnalités

- enregistrement d'un utilisateur (email + mot de passe)
- connexion d'un utilisateur enregistré (email + mot de passe)
- affichage des posts publiés (avec pagination)
- publication de posts (texte et image)
- édition et suppression de ses propres posts (ou de tous les posts pour l'administrateur)
- possibilité de liker/disliker un post (1 seul like par utilisateur)
- affichage des commentaires de chaque post
- publication de commentaires (texte et image)
- édition et supression de ses propres commentaires (ou de tous les commentaires pour l'administrateur)
- affichage de la liste des utilisateurs
- possibilité de compléter/modifier son profil (nom, prénom, fonction, avatar), son email et son mot de passe.
- suppression de son propre compte (un de n'importe quel compte pour l'administrateur)
   