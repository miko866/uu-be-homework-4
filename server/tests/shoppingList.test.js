const request = require('supertest');
const app = require('../src/index');
const { getRandomInt } = require('../src/utils/helpers');

describe('Test ShoppingList CRUD', () => {
  let token = null;
  let simpleUserId = null;
  let firstShoppingListId = null;
  let lastShoppingListId = null;
  let secondSimpleUserId = null;

  describe('01 - Login as admin user', () => {
    it('POST /api/login - success - get JWT-Token', async () => {
      const { body, statusCode } = await request(app)
        .post('/api/login')
        .send({ password: 'adminPassword', email: 'admin@gmail.com' });

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('response');

      expect(statusCode).not.toBe(400);
      expect(statusCode).not.toBe(401);
      expect(statusCode).not.toBe(500);

      token = body.response;
    });

    it('GET /api/users - success - list of all users', async () => {
      const { body, statusCode } = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(200);

      expect(statusCode).not.toBe(204);
      expect(statusCode).not.toBe(400);
      expect(statusCode).not.toBe(401);
      expect(statusCode).not.toBe(500);

      simpleUserId = body[1]._id;
      secondSimpleUserId = body[2]._id;
    });
  });

  describe('02 - Test admin CRUD', () => {
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

      firstShoppingListId = body[0]._id;
      lastShoppingListId = body[body.length - 1]._id;
    });

    it('GET /api/shopping-list/:lastS - success - get one shoppingList by ID', async () => {
      const { statusCode } = await request(app)
        .get(`/api/shopping-list/${lastShoppingListId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(200);

      expect(statusCode).not.toBe(400);
      expect(statusCode).not.toBe(401);
      expect(statusCode).not.toBe(404);
      expect(statusCode).not.toBe(500);
    });

    it('POST /api/shopping-list/:shoppingListId/add-user - success - added new user into shoppingList', async () => {
      const { statusCode } = await request(app)
        .post(`/api/shopping-list/${lastShoppingListId}/add-user`)
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: secondSimpleUserId });

      expect(statusCode).toBe(201);

      expect(statusCode).not.toBe(400);
      expect(statusCode).not.toBe(401);
      expect(statusCode).not.toBe(404);
      expect(statusCode).not.toBe(409);
      expect(statusCode).not.toBe(500);
    });

    it('PATCH /api/shopping-list/:shoppingListId - success - update ShoppingLIst by ID', async () => {
      const { statusCode } = await request(app)
        .patch(`/api/shopping-list/${lastShoppingListId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated' });

      expect(statusCode).toBe(201);

      expect(statusCode).not.toBe(400);
      expect(statusCode).not.toBe(401);
      expect(statusCode).not.toBe(404);
      expect(statusCode).not.toBe(409);
      expect(statusCode).not.toBe(500);
    });

    it('DELETE /api/shopping-list/:shoppingListId/remove-user - success - remove User from shoppingList', async () => {
      const { statusCode } = await request(app)
        .delete(`/api/shopping-list/${lastShoppingListId}/remove-user`)
        .set('Authorization', `Bearer ${token}`)
        .send({ allowedUserId: secondSimpleUserId });

      expect(statusCode).toBe(204);

      expect(statusCode).not.toBe(400);
      expect(statusCode).not.toBe(401);
      expect(statusCode).not.toBe(404);
      expect(statusCode).not.toBe(500);
    });

    it('DELETE /api/shopping-list/:shoppingListId - success - delete shoppingList by ID Cascade', async () => {
      const { statusCode } = await request(app)
        .delete(`/api/shopping-list/${lastShoppingListId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(204);

      expect(statusCode).not.toBe(400);
      expect(statusCode).not.toBe(401);
      expect(statusCode).not.toBe(404);
      expect(statusCode).not.toBe(500);
    });

    it('GET /api/shopping-list/:shoppingListId - success - get nothing because shoppingList is deleted', async () => {
      const { statusCode } = await request(app)
        .get(`/api/shopping-list/${lastShoppingListId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(401);

      expect(statusCode).not.toBe(200);
      expect(statusCode).not.toBe(400);
      expect(statusCode).not.toBe(404);
      expect(statusCode).not.toBe(500);
    });
  });

  describe('03 - Login as simpleUser', () => {
    it('POST /api/login - success - get JWT-Token', async () => {
      const { body, statusCode } = await request(app)
        .post('/api/login')
        .send({ password: 'userPassword', email: 'simpleuser@gmail.com' });

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('response');

      expect(statusCode).not.toBe(400);
      expect(statusCode).not.toBe(401);
      expect(statusCode).not.toBe(500);

      token = body.response;
    });
  });

  describe('04 - Test shoppingList with simpleUser', () => {
    it('GET /api/shopping-lists - success - no authorized because only admin has access', async () => {
      const { statusCode } = await request(app).get('/api/shopping-lists').set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(401);

      expect(statusCode).not.toBe(200);
      expect(statusCode).not.toBe(400);
      expect(statusCode).not.toBe(404);
      expect(statusCode).not.toBe(500);
    });

    it('GET /api/shopping-list/:shoppingListId - success - get admin shoppingList because simple user is allowed user there', async () => {
      const { statusCode } = await request(app)
        .get(`/api/shopping-list/${firstShoppingListId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(200);

      expect(statusCode).not.toBe(401);
      expect(statusCode).not.toBe(400);
      expect(statusCode).not.toBe(404);
      expect(statusCode).not.toBe(500);
    });

    it('POST /api/shopping-list - success - new shopping list', async () => {
      const { statusCode } = await request(app)
        .post('/api/shopping-list')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: `test 1${getRandomInt(10000)}` });

      expect(statusCode).toBe(201);

      expect(statusCode).not.toBe(400);
      expect(statusCode).not.toBe(401);
      expect(statusCode).not.toBe(404);
      expect(statusCode).not.toBe(409);
      expect(statusCode).not.toBe(500);
    });
  });
});
