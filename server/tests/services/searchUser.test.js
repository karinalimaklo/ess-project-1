import { defineFeature, loadFeature } from 'jest-cucumber';
import UserService from '../../services/user.service.js';
import User from '../../models/user.model.js';

const feature = loadFeature('./tests/services/searchUser.feature');

jest.mock('../../models/user.model.js');

defineFeature(feature, (test) => {
  let result;
  let error;

  beforeEach(() => {
    result = null;
    error = null;
    jest.clearAllMocks();
  });

  test('buscar usuários com match de string parcial', ({ given, when, then, and }) => {
    given('os seguintes usuários estão cadastrados no sistema:', (table) => {
      const usuarios = table.map((row) => ({ name: row.name }));
      const filtrados = usuarios.filter((u) => u.name.toLowerCase().includes('ka'));
      User.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(filtrados)
      });
    });

    when(/^uma requisição "GET" for enviada para "\/usuarios\/search\?termo=(.*)"$/, async (termo) => {
      try {
        const data = await UserService.searchUser(termo);
        result = { status: 200, data };
      } catch (err) {
        error = err;
      }
    });

    then(/^o status da resposta deve ser "(\d+)"$/, (statusCode) => {
      expect(result).toBeDefined();
      expect(result.status).toBe(Number(statusCode));
    });

    and('o JSON da resposta deve conter os usuários encontrados:', (table) => {
      const expected = table.map((row) => ({ name: row.name }));
      expect(result.data).toEqual(expected);
    });
  });

  test('busca sem resultados', ({ given, when, then, and }) => {
    given('os seguintes usuários estão cadastrados no sistema:', () => {
      User.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([])
      });
    });

    when(/^uma requisição "GET" for enviada para "\/usuarios\/search\?termo=(.*)"$/, async (termo) => {
      try {
        await UserService.searchUser(termo);
      } catch (err) {
        err.status = err.status || 404;
        error = err;
      }
    });

    then(/^o status da resposta deve ser "(\d+)"$/, (statusCode) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.status).toBe(Number(statusCode));
    });

    and(/^o JSON da resposta deve conter a mensagem de erro "([^"]*)"$/, (msg) => {
      expect(error.message).toBe(msg);
    });
  });

  test('busca com string vazia retorna todos os usuários', ({ given, when, then, and }) => {
    given('os seguintes usuários estão cadastrados no sistema:', (table) => {
      const usuarios = table.map((row) => ({ name: row.name }));
      User.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(usuarios)
      });
    });

    when(/^uma requisição "GET" for enviada para "\/usuarios\/search\?termo=(.*)"$/, async (termo) => {
      try {
        const data = await UserService.searchUser(termo);
        result = { status: 200, data };
      } catch (err) {
        error = err;
      }
    });

    then(/^o status da resposta deve ser "(\d+)"$/, (statusCode) => {
      expect(result).toBeDefined();
      expect(result.status).toBe(Number(statusCode));
    });

    and('o JSON da resposta deve conter todos os usuários:', (table) => {
      const expected = table.map((row) => ({ name: row.name }));
      expected.forEach((usuarioEsperado) => {
        expect(result.data).toEqual(
          expect.arrayContaining([expect.objectContaining(usuarioEsperado)])
        );
      });
    });
  });
});
