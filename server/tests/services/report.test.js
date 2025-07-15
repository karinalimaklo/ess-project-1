import { defineFeature, loadFeature } from 'jest-cucumber';
import ReportService from '../../services/report.service.js';
import Report from '../../models/report.model.js';
import User from '../../models/user.model.js';

const feature = loadFeature('./tests/services/report.feature');

jest.mock('../../models/report.model.js');
jest.mock('../../models/user.model.js');

defineFeature(feature, (test) => {
  let error;
  let result;
  const validUserId = '60f8c2b7a1b3f5a8a8c3d4e5';
  const validReportData = {
    reviewId: '60c72b2f9b1d8c001f8e4d1a',
    motivo: 'Conteúdo impróprio',
    reporterId: '60c72b2f9b1d8c001f8e4d1b',
  };

  beforeEach(() => {
    error = null;
    result = null;
    jest.clearAllMocks();
  });

  // Testa o caminho feliz da criação de uma nova denúncia.
  test('Criar uma denúncia com sucesso', ({ given, when, then }) => {
    given('os dados para uma nova denúncia são válidos, incluindo reviewId, motivo e reporterId', () => {
      Report.create.mockResolvedValue(validReportData);
    });
    when('o método createReport for chamado com esses dados', async () => {
      result = await ReportService.createReport(validReportData);
    });
    then('uma nova denúncia deve ser criada no banco de dados', () => {
      expect(Report.create).toHaveBeenCalledWith(validReportData);
      expect(result).toEqual(validReportData);
    });
  });

  // Testa a listagem de todas as denúncias para um painel de admin.
  test('Listar todas as denúncias existentes para um administrador', ({ given, when, then }) => {
    const mockReports = [{ content: 'Report 1' }, { content: 'Report 2' }];

    given('existem denúncias no banco de dados', () => {
      const finalPopulateMock = jest.fn().mockResolvedValue(mockReports);
      const firstPopulateMock = jest.fn().mockReturnValue({ populate: finalPopulateMock });

      Report.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        populate: firstPopulateMock,
      });
    });

    when('o método getAllReports for chamado', async () => {
      result = await ReportService.getAllReports();
    });

    then('uma lista de denúncias deve ser retornada com os dados do autor e do denunciante', () => {
      expect(Report.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockReports);
    });
  });

  // Testa a busca agregada de denúncias para um usuário específico.
  test('Visualizar detalhes dos reports de um usuário específico', ({ given, when, then }) => {
    given('o usuário "user1" possui reports e um perfil', () => {
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ name: 'user1' }) });
      Report.aggregate.mockResolvedValue([{ review: 'Musica1', motivos: ['Spam'] }]);
    });
    when('o método getAggregatedReportsForUser for chamado com o ID "user1"', async () => {
      result = await ReportService.getAggregatedReportsForUser(validUserId);
    });
    then('o perfil do usuário e seus reports agregados devem ser retornados', () => {
      expect(User.findById).toHaveBeenCalledWith(validUserId);
      expect(Report.aggregate).toHaveBeenCalled();
      expect(result.userProfile.name).toBe('user1');
      expect(result.reports[0].motivos).toBe('Spam (1)');
    });
  });

  // Testa a validação de dados obrigatórios ao criar uma denúncia.
  test('Tentar criar uma denúncia com dados faltando', ({ given, when, then }) => {
    given('os dados para uma nova denúncia estão incompletos', () => {});
    when('o método createReport for chamado com os dados incompletos', async () => {
      const incompleteData = { ...validReportData, motivo: null };
      try {
        await ReportService.createReport(incompleteData);
      } catch (err) {
        error = err;
      }
    });
    then('um erro deve ser lançado sobre campos obrigatórios', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('ID da review, motivo e ID do denunciante são obrigatórios.');
    });
  });

  // Testa o tratamento de erro para um ID de usuário com formato inválido.
  test('Tentar ver detalhes de um usuário com um ID de formato inválido', ({ given, when, then }) => {
    given('o formato do ID de usuário é inválido', () => {});
    when('o método getAggregatedReportsForUser for chamado com o ID "id-invalido"', async () => {
      try {
        await ReportService.getAggregatedReportsForUser('id-invalido');
      } catch (err) {
        error = err;
      }
    });
    then('um erro deve ser lançado dizendo "ID de usuário inválido."', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('ID de usuário inválido.');
    });
  });

  // Testa o tratamento de erro para um ID de usuário válido, mas que não existe no DB.
  test('Tentar ver detalhes de um usuário que não existe', ({ given, when, then }) => {
    given('o ID de usuário é válido mas não corresponde a nenhum usuário', () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });
    });
    when('o método getAggregatedReportsForUser for chamado com esse ID', async () => {
      try {
        await ReportService.getAggregatedReportsForUser(validUserId);
      } catch (err) {
        error = err;
      }
    });
    then('um erro deve ser lançado dizendo "Usuário não encontrado."', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Usuário não encontrado.');
    });
  });
});