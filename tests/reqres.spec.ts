import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import data from './data/reqres.data.json';

const p = pactum;
const baseUrl = 'https://reqres.in/api';

describe('ReqRes API - basic CRUD verification', () => {
  p.request.setDefaultTimeout(30000);

  describe('GET endpoints', () => {
    it('GET /users should return list of users (200)', async () => {
      await p
        .spec()
        .get(`${baseUrl}/users?page=2`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          page: 2
        });
    });

    it('GET /users/2 should return user with id 2 (200)', async () => {
      await p
        .spec()
        .get(`${baseUrl}/users/2`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          data: {
            id: 2
          }
        });
    });
  });

  describe('POST endpoint', () => {
    it('POST /users should create a user (201) and return id + createdAt', async () => {
      await p
        .spec()
        .post(`${baseUrl}/users`)
        .withJson(data.newUser)
        .expectStatus(StatusCodes.CREATED) // 201
        .expectJsonLike({
          name: data.newUser.name,
          job: data.newUser.job
        })
        .expectJsonMatch(/createdAt/); // verifica que existe createdAt
    });
  });

  describe('PUT endpoint', () => {
    it('PUT /users/2 should update user and return updated fields (200)', async () => {
      await p
        .spec()
        .put(`${baseUrl}/users/2`)
        .withJson(data.updateUser)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          name: data.updateUser.name,
          job: data.updateUser.job
        })
        .expectJsonMatch(/updatedAt/);
    });
  });

  describe('DELETE endpoint', () => {
    it('DELETE /users/2 should return 204 No Content', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/users/2`)
        .expectStatus(StatusCodes.NO_CONTENT); // 204
    });
  });
});
