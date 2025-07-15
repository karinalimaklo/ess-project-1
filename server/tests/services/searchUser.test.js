import { defineFeature, loadFeature } from 'jest-cucumber';
import { searchUser } from '../../services/user.service.js'; // IMPORTAÇÃO NOMEADA
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

  test('buscar usuários com match de string parcial', ({ given, when, then }) => {
    given('o UserService possui os seguintes usuários cadastrados:', (table) => {
      const userData = table.map((row) => ({ name: row.name }));
      User.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(userData.filter(user => user.name.includes('ka'))),
      });
    });

    when('o método searchUser for chamado com o termo "ka"', async () => {
      result = await searchUser('ka');
    });

    then('o JSON da resposta deve conter os usuários:', (table) => {
      const expected = table.map((row) => ({ name: row.name }));
      expect(result).toEqual(expect.arrayContaining(expected));
    });
  });

  test('busca sem resultados', ({ given, when, then }) => {
    given('o UserService possui os seguintes usuários cadastrados:', () => {
      User.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });
    });

    when('o método searchUser for chamado com o termo "Desconhecida"', async () => {
      try {
        await searchUser('Desconhecida');
      } catch (err) {
        error = err;
      }
    });

    then('um erro deve ser lançado com a mensagem "Não foi encontrada nenhum usuário com esse nome."', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Não foi encontrada nenhum usuário com esse nome.');
    });
  });

  test('busca com string vazia retorna todos os usuários', ({ given, when, then }) => {
    given('o UserService possui os seguintes usuários cadastrados:', (table) => {
      const allUsers = table.map((row) => ({ name: row.name }));
      User.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(allUsers),
      });
    });

    when('o método searchUser for chamado com uma string vazia', async () => {
      result = await searchUser('');
    });

    then('o JSON da resposta deve conter os usuários:', (table) => {
      const expected = table.map((row) => ({ name: row.name }));
      expect(result).toEqual(expect.arrayContaining(expected));
    });
  });
});
