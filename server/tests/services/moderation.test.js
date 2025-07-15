import { defineFeature, loadFeature } from 'jest-cucumber';
import ModerationService from '../../services/moderation.service.js';
import ReviewService from '../../services/review.service.js';
import User from '../../models/user.model.js';
import Review from '../../models/review.model.js';
import Report from '../../models/report.model.js';

const feature = loadFeature('./tests/services/moderation.feature');

jest.mock('../../models/user.model.js');
jest.mock('../../models/review.model.js');
jest.mock('../../models/report.model.js');

defineFeature(feature, (test) => {
  let error;
  let result;
  const validUserId = '60f8c2b7a1b3f5a8a8c3d4e5';
  const validReviewId = '60f8c2b7a1b3f5a8a8c3d4e6';

  beforeEach(() => {
    error = null;
    result = null;
    jest.clearAllMocks();
  });

  // Testa a busca por todos os usuários que já foram denunciados.
  test('Visualizar o painel de usuários reportados', ({ given, when, then }) => {
    const mockReportedUsers = [{ name: 'Usuario1', reports: 3 }];
    given('existem usuários reportados no banco de dados', () => {
      Report.aggregate.mockResolvedValue(mockReportedUsers);
    });
    when('o método getReportedUsers for chamado', async () => {
      result = await ModerationService.getReportedUsers();
    });
    then('uma lista de usuários com contagem de reports deve ser retornada', () => {
      expect(Report.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockReportedUsers);
    });
  });

  // Testa o caso de sucesso do envio de uma advertência.
  test('Enviar uma advertência para um usuário', ({ given, when, then }) => {
    given('o método sendWarning será chamado para o usuário "user1"', () => {
      User.findByIdAndUpdate.mockResolvedValue(true);
    });
    when('o método sendWarning for chamado com o ID "user1" e a mensagem "Linguagem inadequada"', async () => {
      await ModerationService.sendWarning('user1', 'Linguagem inadequada');
    });
    then('o método findByIdAndUpdate do modelo User deve ser chamado com os dados da advertência', () => {
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user1', {
        $push: { warnings: { mensagem: 'Linguagem inadequada' } },
      });
    });
  });

  // Testa o caso de sucesso da suspensão de um usuário.
  test('Suspender um usuário com sucesso', ({ given, when, then }) => {
    given('o método suspendUser será chamado para o usuário "user1"', () => {
      User.findByIdAndUpdate.mockResolvedValue(true);
    });
    when('o método suspendUser for chamado com o ID "user1", dias 10 e justificativa "Reincidência"', async () => {
      await ModerationService.suspendUser('user1', 10, 'Reincidência');
    });
    then('o status do usuário deve ser atualizado para "Suspenso" e com uma data de expiração', () => {
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user1', {
        status: 'Suspenso',
        suspendedUntil: expect.any(Date),
      });
    });
  });

  // Testa o caso de sucesso da exclusão lógica de um usuário.
  test('Excluir a conta de um usuário', ({ given, when, then }) => {
    given('o método deleteUser será chamado para o usuário "user1"', () => {
      User.findByIdAndUpdate.mockResolvedValue(true);
    });
    when('o método deleteUser for chamado com o ID "user1" e justificativa "Violação grave"', async () => {
      await ModerationService.deleteUser('user1', 'Violação grave');
    });
    then('o status do usuário deve ser atualizado para "Excluído"', () => {
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user1', { status: 'Excluído' });
    });
  });

  // Testa o caso de sucesso ao reativar um usuário.
  test('Arquivar um caso de usuário como resolvido', ({ given, when, then }) => {
    given('o método resolveCase será chamado para o usuário "user1"', () => {
      User.findByIdAndUpdate.mockResolvedValue(true);
    });
    when('o método resolveCase for chamado com o ID "user1"', async () => {
      await ModerationService.resolveCase('user1');
    });
    then('o status do usuário deve ser redefinido para "Ativo"', () => {
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user1', { status: 'Ativo', suspendedUntil: null });
    });
  });

  // Testa o caso de sucesso ao ocultar uma review.
  test('Ocultar uma review reportada', ({ given, when, then }) => {
    given('o método hideReview será chamado para a review "review1"', () => {
      Review.findByIdAndUpdate.mockResolvedValue(true);
    });
    when('o método hideReview for chamado com o ID "review1"', async () => {
      await ReviewService.hideReview('review1');
    });
    then('a review deve ser atualizada com isHidden: true', () => {
      expect(Review.findByIdAndUpdate).toHaveBeenCalledWith('review1', { isHidden: true }, { new: true });
    });
  });

  // Testa a validação que impede o envio de uma advertência sem texto.
  test('Tentar enviar uma advertência sem mensagem', ({ given, when, then }) => {
    given('o método sendWarning será chamado com uma mensagem vazia', () => {});
    when('o método sendWarning for chamado para um usuário válido mas com mensagem vazia', async () => {
      try {
        await ModerationService.sendWarning(validUserId, '');
      } catch (err) {
        error = err;
      }
    });
    then('um erro deve ser lançado dizendo "A mensagem de advertência é obrigatória."', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('A mensagem de advertência é obrigatória.');
    });
  });

  // Testa a validação de entrada para o campo 'dias' na suspensão.
  test('Tentar suspender usuário com valor de dias inválido', ({ given, when, then }) => {
    given('o método suspendUser será chamado com dados inválidos', () => {});
    when('o método suspendUser for chamado para o "user1" com dias "dez"', async () => {
      try {
        await ModerationService.suspendUser('user1', 'dez', 'Teste');
      } catch (err) {
        error = err;
      }
    });
    then('um erro deve ser lançado dizendo "Informe um número válido de dias."', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Informe um número válido de dias.');
    });
  });

  // Testa a validação que exige uma justificativa para suspender.
  test('Tentar suspender usuário sem justificativa', ({ given, when, then }) => {
    given('o método suspendUser será chamado sem justificativa', () => {});
    when('o método suspendUser for chamado para o "user1" com dias 5 e sem justificativa', async () => {
      try {
        await ModerationService.suspendUser('user1', 5, '');
      } catch (err) {
        error = err;
      }
    });
    then('um erro deve ser lançado dizendo "Justificativa obrigatória para suspensão."', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Justificativa obrigatória para suspensão.');
    });
  });

  // Testa a validação que exige uma justificativa para excluir.
  test('Tentar excluir um usuário sem justificativa', ({ given, when, then }) => {
    given('o método deleteUser será chamado sem uma justificativa', () => {});
    when('o método deleteUser for chamado com um ID de usuário mas sem justificativa', async () => {
      try {
        await ModerationService.deleteUser(validUserId, '');
      } catch (err) {
        error = err;
      }
    });
    then('um erro deve ser lançado dizendo "Justificativa obrigatória para exclusão."', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Justificativa obrigatória para exclusão.');
    });
  });
  
  // Testa o tratamento de erro ao tentar advertir um usuário que não existe.
  test('Tentar enviar advertência para um usuário que não existe', ({ given, when, then }) => {
    given('o ID de usuário não corresponde a nenhum usuário existente', () => {
      User.findByIdAndUpdate.mockResolvedValue(null);
    });
    when('o método sendWarning for chamado com esse ID', async () => {
      try {
        await ModerationService.sendWarning(validUserId, 'Mensagem de teste');
      } catch (err) {
        error = err;
      }
    });
    then('um erro deve ser lançado dizendo "Usuário não encontrado."', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Usuário não encontrado.');
    });
  });

  // Testa o tratamento de erro ao tentar suspender um usuário que não existe.
  test('Tentar suspender um usuário que não existe', ({ given, when, then }) => {
    given('o ID de usuário não corresponde a nenhum usuário para suspensão', () => {
      User.findByIdAndUpdate.mockResolvedValue(null);
    });
    when('o método suspendUser for chamado com esse ID', async () => {
      try {
        await ModerationService.suspendUser(validUserId, 10, 'justificativa');
      } catch (err) {
        error = err;
      }
    });
    then('um erro deve ser lançado dizendo "Usuário não encontrado."', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Usuário não encontrado.');
    });
  });

  // Testa o tratamento de erro ao tentar excluir um usuário que não existe.
  test('Tentar excluir um usuário que não existe', ({ given, when, then }) => {
    given('o ID de usuário não corresponde a nenhum usuário para exclusão', () => {
      User.findByIdAndUpdate.mockResolvedValue(null);
    });
    when('o método deleteUser for chamado com esse ID', async () => {
      try {
        await ModerationService.deleteUser(validUserId, 'justificativa');
      } catch (err) {
        error = err;
      }
    });
    then('um erro de "Usuário não encontrado." deve ser lançado para a exclusão', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Usuário não encontrado.');
    });
  });

  // Testa o tratamento de erro ao tentar reativar um usuário que não existe.
  test('Tentar resolver o caso de um usuário que não existe', ({ given, when, then }) => {
    given('o ID de usuário não corresponde a nenhum usuário para resolver o caso', () => {
      User.findByIdAndUpdate.mockResolvedValue(null);
    });
    when('o método resolveCase for chamado com esse ID', async () => {
      try {
        await ModerationService.resolveCase(validUserId);
      } catch (err) {
        error = err;
      }
    });
    then('um erro de "Usuário não encontrado." deve ser lançado para a resolução', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Usuário não encontrado.');
    });
  });

  // Testa o tratamento de erro ao tentar ocultar uma review que não existe.
  test('Tentar ocultar uma review que não existe', ({ given, when, then }) => {
    given('o ID da review não corresponde a nenhuma review existente', () => {
      Review.findByIdAndUpdate.mockResolvedValue(null);
    });
    when('o método hideReview for chamado com esse ID', async () => {
      try {
        await ReviewService.hideReview(validReviewId);
      } catch (err) {
        error = err;
      }
    });
    then('um erro deve ser lançado dizendo "Review não encontrada."', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Review não encontrada');
    });
  });
});