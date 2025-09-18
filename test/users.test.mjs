
import { expect } from 'chai';
import app from '../src/app.js';
import request from 'supertest';
import { connectTestDB, clearDB, closeDB, ensureAdminAndLogin, token } from './setup.mjs';

let jwt;
let userId;

describe('Users CRUD', () => {
  before(async () => {
    await connectTestDB();
    await clearDB();
    await ensureAdminAndLogin();
    jwt = token;
  });

  after(async () => {
    await closeDB();
  });

  it('POST /api/users -> crée un user', async () => {
    const email = `op_${Date.now()}@test.com`;
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${jwt}`)
      .send({ name: 'Operateur', email, password: 'secret123' });

    expect(res.status).to.equal(201);
    expect(res.body).to.include.keys('_id', 'email');
    userId = res.body._id;
  });

  it('GET /api/users/:id -> détail', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${jwt}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id', userId);
  });

  it('PUT /api/users/:id -> mise à jour', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send({ name: 'Operateur 2', email: `op2_${Date.now()}@test.com`, password: 'secret123' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('name', 'Operateur 2');
  });

  it('DELETE /api/users/:id -> supprime', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${jwt}`);
    expect(res.status).to.equal(204);
  });
});
