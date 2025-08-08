import { defineFeature, loadFeature } from 'jest-cucumber';
import ModerationService from '../../services/moderation.service.js';
import User from '../../models/user.model.js';
import Report from '../../models/report.model.js';

const feature = loadFeature('./tests/services/moderation.feature');

jest.mock('../../models/user.model.js');
jest.mock('../../models/report.model.js');

defineFeature(feature, (test) => {
  let result;
  let error;

  beforeEach(() => {
    result = null;
    error = null;
    jest.clearAllMocks();
  });

  const buildPayload = (table) => table[0];

  // ======================================================
  // Testes de Sucesso
  // ======================================================

  test('Visualizar o painel de usuários reportados', ({ given, when, then }) => {
    given('existem usuários com denúncias no banco de dados', () => {
      Report.aggregate.mockResolvedValue([{ name: 'Usuario1', reports: 3 }]);
    });
    when(/^uma requisição "GET" é enviada para "\/moderation\/reported-users"$/, async () => {
      result = await ModerationService.getReportedUsers();
    });
    then('uma lista de usuários com contagem de denúncias deve ser retornada', () => {
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  test('Enviar uma advertência para um usuário com sucesso', ({ given, when, then }) => {
    given(/^o usuário com ID "(.*)" existe no sistema$/, (userId) => {
      User.findByIdAndUpdate.mockResolvedValue({ _id: userId, warnings: [{}] });
    });
    when(/^uma requisição "POST" é enviada para "\/moderation\/warning" com os dados:$/, async (table) => {
      const payload = buildPayload(table);
      result = await ModerationService.sendWarning(payload.userId, payload.message);
    });
    then('a advertência é registrada e o usuário atualizado é retornado', () => {
      expect(User.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  test('Suspender um usuário com sucesso', ({ given, when, then }) => {
    given(/^o usuário com ID "(.*)" existe no sistema$/, (userId) => {
      User.findByIdAndUpdate.mockResolvedValue({ _id: userId, status: 'Suspenso' });
    });
    when(/^uma requisição "POST" é enviada para "\/moderation\/suspend" com os dados:$/, async (table) => {
      const payload = buildPayload(table);
      result = await ModerationService.suspendUser(payload.userId, parseInt(payload.days), payload.reason);
    });
    then(/^o status do usuário "(.*)" é atualizado para "Suspenso"$/, (userId) => {
      expect(result.status).toBe('Suspenso');
    });
  });

  test('Excluir um usuário com sucesso (soft delete)', ({ given, when, then }) => {
    given(/^o usuário com ID "(.*)" existe no sistema$/, (userId) => {
      User.findByIdAndUpdate.mockResolvedValue({ _id: userId, status: 'Excluído' });
    });
    when(/^uma requisição "DELETE" é enviada para "\/moderation\/users\/(.*)" com a justificativa "(.*)"$/, async (userId, reason) => {
      result = await ModerationService.deleteUser(userId, reason);
    });
    then(/^o status do usuário "(.*)" é atualizado para "Excluído"$/, (userId) => {
      expect(result.status).toBe('Excluído');
    });
  });

  test('Reativar a conta de um usuário (resolver caso)', ({ given, when, then }) => {
    given(/^o usuário com ID "(.*)" está suspenso$/, (userId) => {
      User.findByIdAndUpdate.mockResolvedValue({ _id: userId, status: 'Ativo' });
    });
    when(/^uma requisição "PUT" é enviada para "\/moderation\/resolve\/(.*)"$/, async (userId) => {
      result = await ModerationService.resolveCase(userId);
    });
    then(/^o status do usuário "(.*)" é atualizado para "Ativo"$/, (userId) => {
      expect(result.status).toBe('Ativo');
    });
  });

  // ======================================================
  // Testes de Falha
  // ======================================================

  test('Tentar enviar advertência para um usuário que não existe', ({ given, when, then }) => {
    given(/^o usuário com ID "(.*)" não existe no sistema$/, () => {
      User.findByIdAndUpdate.mockResolvedValue(null);
    });
    when(/^uma requisição "POST" é enviada para "\/moderation\/warning" para o usuário "(.*)"$/, async (userId) => {
      try {
        await ModerationService.sendWarning(userId, 'uma mensagem');
      } catch (err) {
        error = err;
      }
    });
    then(/^a ação falha com a mensagem "(.*)"$/, (message) => {
      expect(error).toBeDefined();
      expect(error.message).toBe(message);
    });
  });

  test('Tentar suspender um usuário que não existe', ({ given, when, then }) => {
    given(/^o usuário com ID "(.*)" não existe no sistema$/, () => {
      User.findByIdAndUpdate.mockResolvedValue(null);
    });
    when(/^uma requisição para suspender o usuário "(.*)" é feita$/, async (userId) => {
      try {
        await ModerationService.suspendUser(userId, 10, 'motivo');
      } catch (err) {
        error = err;
      }
    });
    then(/^a ação falha com a mensagem "(.*)"$/, (message) => {
      expect(error).toBeDefined();
      expect(error.message).toBe(message);
    });
  });

  test('Tentar excluir um usuário que não existe', ({ given, when, then }) => {
    given(/^o usuário com ID "(.*)" não existe no sistema$/, () => {
      User.findByIdAndUpdate.mockResolvedValue(null);
    });
    when(/^uma requisição para excluir o usuário "(.*)" é feita com uma justificativa$/, async (userId) => {
      try {
        await ModerationService.deleteUser(userId, 'motivo');
      } catch (err) {
        error = err;
      }
    });
    then(/^a ação falha com a mensagem "(.*)"$/, (message) => {
      expect(error).toBeDefined();
      expect(error.message).toBe(message);
    });
  });

  test('Tentar resolver o caso de um usuário que não existe', ({ given, when, then }) => {
    given(/^o usuário com ID "(.*)" não existe no sistema$/, () => {
      User.findByIdAndUpdate.mockResolvedValue(null);
    });
    when(/^uma requisição para resolver o caso do usuário "(.*)" é feita$/, async (userId) => {
      try {
        await ModerationService.resolveCase(userId);
      } catch (err) {
        error = err;
      }
    });
    then(/^a ação falha com a mensagem "(.*)"$/, (message) => {
      expect(error).toBeDefined();
      expect(error.message).toBe(message);
    });
  });

  test('Tentar suspender usuário com valor de dias inválido', ({ given, when, then }) => {
    given(/^o usuário com ID "(.*)" existe no sistema$/, () => {});
    when(/^uma requisição para suspender o usuário "(.*)" é feita com dias "(.*)"$/, async (userId, days) => {
      try {
        await ModerationService.suspendUser(userId, days, 'motivo');
      } catch (err) {
        error = err;
      }
    });
    then(/^a ação falha com a mensagem "(.*)"$/, (message) => {
      expect(error).toBeDefined();
      expect(error.message).toBe(message);
    });
  });
  
  test('Tentar suspender um usuário sem justificativa', ({ given, when, then }) => {
    given(/^o usuário com ID "(.*)" existe no sistema$/, () => {});
    when(/^uma requisição para suspender o usuário "(.*)" por (.*) dias é feita sem justificativa$/, async (userId, days) => {
      try {
        await ModerationService.suspendUser(userId, parseInt(days), '');
      } catch (err) {
        error = err;
      }
    });
    then(/^a ação falha com a mensagem "(.*)"$/, (message) => {
      expect(error).toBeDefined();
      expect(error.message).toBe(message);
    });
  });
  
  test('Tentar excluir um usuário sem justificativa', ({ given, when, then }) => {
    given(/^o usuário com ID "(.*)" existe no sistema$/, () => {});
    when(/^uma requisição para excluir o usuário "(.*)" é feita sem justificativa$/, async (userId) => {
      try {
        await ModerationService.deleteUser(userId, '');
      } catch (err) {
        error = err;
      }
    });
    then(/^a ação falha com a mensagem "(.*)"$/, (message) => {
      expect(error).toBeDefined();
      expect(error.message).toBe(message);
    });
  });

  // TESTE FINAL PARA COBERTURA DE 100%
  test('Tentar enviar uma advertência sem mensagem', ({ given, when, then }) => {
    given(/^o usuário com ID "(.*)" existe no sistema$/, () => {});
    when(/^uma requisição para enviar uma advertência para o usuário "(.*)" é feita sem mensagem$/, async (userId) => {
      try {
        await ModerationService.sendWarning(userId, '');
      } catch(err) {
        error = err;
      }
    });
    then(/^a ação falha com a mensagem "(.*)"$/, (message) => {
      expect(error).toBeDefined();
      expect(error.message).toBe(message);
    });
  });
});