
import { expect } from 'chai';
import app from '../src/app.js';
import request from 'supertest';
import { connectTestDB, clearDB, closeDB, ensureAdminAndLogin, token } from './setup.mjs';

let jwt;
let createdId;

describe('Catways CRUD', () => {
  before(async () => {
    await connectTestDB();
    await clearDB();
    await ensureAdminAndLogin();
    jwt = token;
  });

  after(async () => {
    await closeDB();
  });

  it('POST /api/catways -> crée un catway', async () => {
    const res = await request(app)
      .post('/api/catways')
      .set('Authorization', `Bearer ${jwt}`)
      .send({ catwayNumber: 101, type: 'long', catwayState: 'ok' });

    expect(res.status).to.equal(201);
    expect(res.body).to.include({ catwayNumber: 101, type: 'long' });
    createdId = res.body._id;
  });

  it('GET /api/catways -> liste', async () => {
    const res = await request(app)
      .get('/api/catways')
      .set('Authorization', `Bearer ${jwt}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').that.is.not.empty;
  });

  it('GET /api/catways/:id -> détail', async () => {
    const res = await request(app)
      .get(`/api/catways/${createdId}`)
      .set('Authorization', `Bearer ${jwt}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id', createdId);
  });

  it('PATCH /api/catways/:id -> MAJ partielle', async () => {
    const res = await request(app)
      .patch(`/api/catways/${createdId}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({ catwayState: 'maintenance' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('catwayState', 'maintenance');
  });

  it('PUT /api/catways/:id -> remplacement', async () => {
    const res = await request(app)
      .put(`/api/catways/${createdId}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({ catwayNumber: 101, type: 'short', catwayState: 'ok' });
    expect(res.status).to.equal(200);
    expect(res.body).to.include({ type: 'short', catwayState: 'ok' });
  });

  it('DELETE /api/catways/:id -> supprime', async () => {
    const res = await request(app)
      .delete(`/api/catways/${createdId}`)
      .set('Authorization', `Bearer ${jwt}`);
    expect(res.status).to.equal(204);
  });
});
