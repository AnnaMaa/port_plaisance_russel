
import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearDB, closeDB, ensureAdminAndLogin } from './setup.mjs';

describe('Auth', () => {
  before(async () => {
    await connectTestDB();
    await clearDB();
  });

  after(async () => {
    await closeDB();
  });

  it('login KO: Bad credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'inconnu@test.com',
      password: 'nope'
    });
    expect(res.status).to.equal(401);
    expect(res.body.message).to.match(/bad credentials/i);
  });

  it('login OK: admin', async () => {
    await ensureAdminAndLogin(); // définit token globalement
  });
});
