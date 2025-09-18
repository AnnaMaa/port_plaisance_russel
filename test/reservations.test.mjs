
import { expect } from 'chai';
import app from '../src/app.js';
import request from 'supertest';
import { connectTestDB, clearDB, closeDB, ensureAdminAndLogin, token } from './setup.mjs';

let jwt;
let catwayId;
let reservationId;

describe('Reservations (nested under catway)', () => {
  before(async () => {
    await connectTestDB();
    await clearDB();
    await ensureAdminAndLogin();
    jwt = token;

    // créer un catway
    const c = await request(app)
      .post('/api/catways')
      .set('Authorization', `Bearer ${jwt}`)
      .send({ catwayNumber: 202, type: 'long', catwayState: 'ok' });
    catwayId = c.body._id;
  });

  after(async () => {
    await closeDB();
  });

  it('POST /api/catways/:id/reservations -> crée une résa', async () => {
    const res = await request(app)
      .post(`/api/catways/${catwayId}/reservations`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        clientName: 'Jean Test',
        boatName: 'SeaUnit',
        checkIn: '2025-09-20',
        checkOut: '2025-09-22'
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.include({ clientName: 'Jean Test', boatName: 'SeaUnit' });
    reservationId = res.body._id;
  });

  it('GET /api/catways/:id/reservations -> liste par catway', async () => {
    const res = await request(app)
      .get(`/api/catways/${catwayId}/reservations`)
      .set('Authorization', `Bearer ${jwt}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').that.is.not.empty;
  });

  it('GET /api/reservations -> liste globale', async () => {
    const res = await request(app)
      .get('/api/reservations')
      .set('Authorization', `Bearer ${jwt}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').that.is.not.empty;
  });

  it('GET /api/catways/:id/reservations/:idReservation -> détail', async () => {
    const res = await request(app)
      .get(`/api/catways/${catwayId}/reservations/${reservationId}`)
      .set('Authorization', `Bearer ${jwt}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id', reservationId);
  });

  it('DELETE /api/catways/:id/reservations/:idReservation -> supprime', async () => {
    const res = await request(app)
      .delete(`/api/catways/${catwayId}/reservations/${reservationId}`)
      .set('Authorization', `Bearer ${jwt}`);
    expect(res.status).to.equal(204);
  });
});
