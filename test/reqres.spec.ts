import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import data from './data/reqres.data.json';

const p = pactum;
const baseUrl = 'https://reqres.in/api';

describe('Testes de API ReqRes - verificação de CRUD básico', () => {
  p.request.setDefaultTimeout(30000);

  describe('Testes de consulta (GET)', () => {
    // 1. Lista de usuários da página 2
    it('Deve retornar a lista de usuários da página 2 (200)', async () => {
      await p.spec().get(`${baseUrl}/users?page=2`).expectStatus(StatusCodes.OK).expectJsonLike({ page: 2 });
    });

    // 2. Lista de usuários da página 3
    it('Deve retornar a lista de usuários da página 3 (200)', async () => {
      await p.spec().get(`${baseUrl}/users?page=3`).expectStatus(StatusCodes.OK).expectJsonLike({ page: 3 });
    });

    // 3. Usuário ID 2
    it('Deve retornar o usuário de ID 2 (200)', async () => {
      await p.spec().get(`${baseUrl}/users/2`).expectStatus(StatusCodes.OK).expectJsonLike({ data: { id: 2 } });
    });

    // 4. Usuário ID 4
    it('Deve retornar o usuário de ID 4 (200)', async () => {
      await p.spec().get(`${baseUrl}/users/4`).expectStatus(StatusCodes.OK).expectJsonLike({ data: { id: 4 } });
    });

    // 11. Lista de recursos (cores) - GET /unknown
    it('Deve retornar lista de recursos (200)', async () => {
      await p.spec().get(`${baseUrl}/unknown`).expectStatus(StatusCodes.OK).expectJsonLike({ page: 1 });
    });
  });

  describe('Validação de códigos de status', () => {
    // 5. Erro 400
    it('Deve retornar erro 400 (Bad Request)', async () => {
      await p.spec().get(`${baseUrl}/status/400`).expectStatus(StatusCodes.BAD_REQUEST);
    });

    // 6. Sucesso 200
    it('Deve retornar sucesso 200 (OK)', async () => {
      await p.spec().get(`${baseUrl}/status/200`).expectStatus(StatusCodes.OK);
    });
  });

  describe('Operações de CRUD', () => {
    // 7. Criação de usuário
    it('Deve criar um novo usuário (POST / 201)', async () => {
      await p
        .spec()
        .post(`${baseUrl}/users`)
        .withJson(data.newUser)
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          name: data.newUser.name,
          job: data.newUser.job
        })
        .expectJsonMatch(/createdAt/);
    });

    // 8. Atualização de usuário
    it('Deve atualizar um usuário existente (PUT / 200)', async () => {
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

    // 9. Exclusão de usuário ID 2
    it('Deve excluir o usuário de ID 2 (DELETE / 204)', async () => {
      await p.spec().delete(`${baseUrl}/users/2`).expectStatus(StatusCodes.NO_CONTENT);
    });

    // 10. Exclusão de usuário ID 4
    it('Deve excluir o usuário de ID 4 (DELETE / 204)', async () => {
      await p.spec().delete(`${baseUrl}/users/4`).expectStatus(StatusCodes.NO_CONTENT);
    });

    // 12. Login inválido (sem senha) deve retornar erro 400
    it('Deve falhar login sem senha (POST /login)', async () => {
      await p
        .spec()
        .post(`${baseUrl}/login`)
        .withJson({ email: 'peter@klaven' }) // falta password
        .expectStatus(StatusCodes.BAD_REQUEST);
    });
  });
});
