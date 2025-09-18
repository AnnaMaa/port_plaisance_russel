# ⚓ Port de plaisance Russell – API RESTful

développement d’une **API RESTful sécurisée** pour la gestion d’un port de plaisance.

## 🚀 Fonctionnalités

- **Authentification JWT**
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
- **Utilisateurs (capitainerie)**
  - CRUD complet : `POST`, `GET`, `PUT`, `DELETE`
- **Catways (ponton)**
  - CRUD complet : `GET /catways`, `GET /catways/:id`, `POST /catways`, `PUT/PATCH /catways/:id`, `DELETE /catways/:id`
- **Réservations**
  - CRUD imbriqué : `POST /catways/:id/reservations`
  - Liste globale : `GET /reservations`
  - Détail : `GET /catways/:id/reservations/:idReservation`
  - Suppression : `DELETE /catways/:id/reservations/:idReservation`

---

## 🗂️ Modèles

### User
```json
{ "_id": "ObjectId", "name": "string", "email": "string", "password": "string" }
