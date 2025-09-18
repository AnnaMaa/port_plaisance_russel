1. Vue d’ensemble
Base URL

Local : http://localhost:3000/api

Production : à compléter après déploiement (Heroku/Render/etc.)

Authentification

Auth basée sur JWT.

Pour toutes les routes protégées :

Authorization: Bearer <token>

Ressources principales

Auth : login / logout

Users : gestion des utilisateurs

Catways : gestion des pontons

Reservations : gestion des réservations (sous-ressource de catways)

2. Modèles
User
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashé)",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}

Catway
{
  "_id": "ObjectId",
  "catwayNumber": "number",
  "type": "long | short",
  "catwayState": "string",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}

Reservation
{
  "_id": "ObjectId",
  "catwayId": "ObjectId (ref Catway)",
  "catwayNumber": "number",
  "clientName": "string",
  "boatName": "string",
  "checkIn": "ISODate",
  "checkOut": "ISODate",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}

3. Tutoriel (pas à pas)
Étape A — Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"secret123"}'


Réponse :

{ "message": "ok", "token": "eyJhbGciOi..." }

Étape B — Créer un catway
curl -X POST http://localhost:3000/api/catways \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"catwayNumber": 36, "type": "long", "catwayState": "ok"}'

Étape C — Créer une réservation
curl -X POST http://localhost:3000/api/catways/<CATWAY_ID>/reservations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Jean Dupont",
    "boatName": "Sea Breeze",
    "checkIn": "2025-09-20",
    "checkOut": "2025-09-23"
  }'

Étape D — Lister

Tous les catways : GET /catways

Toutes les réservations : GET /reservations

4. Endpoints détaillés
Auth

POST /auth/login → login

POST /auth/logout → logout

Users (protégé)

POST /users → créer un utilisateur

GET /users/:id → détail utilisateur

PUT /users/:id → mise à jour complète

DELETE /users/:id → suppression

Catways (protégé)

GET /catways → liste

GET /catways/:id → détail

POST /catways → créer

PUT /catways/:id → remplacer

PATCH /catways/:id → mise à jour partielle

DELETE /catways/:id → suppression

Reservations (protégé)

GET /catways/:id/reservations → liste par catway

GET /catways/:id/reservations/:idReservation → détail

POST /catways/:id/reservations → créer

DELETE /catways/:id/reservations/:idReservation → suppression

GET /reservations → liste globale

5. Exemples de réponses
Catways (GET /catways)
[
  {
    "_id": "64f7f8e3a4a1b2c3d4e5f6a7",
    "catwayNumber": 1,
    "type": "short",
    "catwayState": "bon état"
  }
]

Reservations (GET /reservations)
[
  {
    "_id": "64f7f9a2b1c2d3e4f5a6b7c8",
    "catwayNumber": 1,
    "clientName": "Thomas Martin",
    "boatName": "Carolina",
    "checkIn": "2022-05-21T06:00:00Z",
    "checkOut": "2022-10-27T06:00:00Z"
  }
]

6. Codes d’erreur

400 Bad Request : données invalides

401 Unauthorized : pas de token ou token invalide

404 Not Found : ressource inexistante

409 Conflict : duplication (ex: catwayNumber déjà existant)

500 Internal Server Error : erreur serveur

7. Glossaire

Catway : petit appontement (ponton) pour amarrer un bateau.

JWT : JSON Web Token, utilisé pour l’authentification.

CRUD : Create, Read, Update, Delete.

Bearer : type de token dans le header Authorization.