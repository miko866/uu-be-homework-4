const request = require('supertest');
const app = require('../src/index');
const { getRandomInt } = require('../src/utils/helpers');

describe('Test ShoppingList CRUD', () => {
  let token = null;
  let simpleUserId = null;

  describe('01 - Test login and Get simple user', () => {
    it('POST /api/login - success - get JWT-Token', async () => {
      const { body, statusCode } = await request(app)
        .post('/api/login')
        .send({ password: 'adminPassword', email: 'admin@gmail.com' });
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('response');

      expect(statusCode).not.toBe(400);
      expect(statusCode).not.toBe(401);
      expect(statusCode).not.toBe(500);
      expect(body).toHaveProperty('response');

      token = body.response;
    });

    it('GET /api/users - success - list of all users', async () => {
      console.log(`Bearer ${token}`);

      const { body, statusCode } = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(200);

      expect(statusCode).not.toBe(204);
      expect(statusCode).not.toBe(400);
      expect(statusCode).not.toBe(401);
      expect(statusCode).not.toBe(500);

      simpleUserId = body[1]._id;
    });
  });

  describe('02 - Test CRUD', () => {
    it('POST /api/shopping-list - success - new shopping list', async () => {
      const { statusCode } = await request(app)
        .post('/api/shopping-list')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: `test 0${getRandomInt(10000)}`, allowedUsers: [simpleUserId] });

      expect(statusCode).toBe(201);

      expect(statusCode).not.toBe(400);
      expect(statusCode).not.toBe(401);
      expect(statusCode).not.toBe(404);
      expect(statusCode).not.toBe(409);
      expect(statusCode).not.toBe(500);
    });

    it('GET /api/shopping-lists - success - list of all shoppingLists', async () => {
      const { body, statusCode } = await request(app)
        .get('/api/shopping-lists')
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(200);

      expect(statusCode).not.toBe(400);
      expect(statusCode).not.toBe(401);
      expect(statusCode).not.toBe(404);
      expect(statusCode).not.toBe(500);

      console.log('Body shopping lists --------------', body);
    });
  });
});
