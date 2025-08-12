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
  let reportData;

  beforeEach(() => {
    error = null;
    result = null;
    reportData = null;
    jest.clearAllMocks();
  });

  const buildReportObject = (table) => {
    const row = table[0];
    return {
      reviewId: row.reviewId,
      motivo: row.motivo,
      reporterId: row.reporterId,
    };
  };

  test('Criar uma denúncia com sucesso', ({ given, when, and, then }) => {
    given(/^o usuário "(.*)" e a review "(.*)" existem no sistema$/, () => {});
    
    when(/^uma requisição "POST" é enviada para "\/reports"$/, () => {});

    and('o corpo desta requisição contém os seguintes campos:', async (table) => {
      reportData = buildReportObject(table);
      Report.create.mockResolvedValue(reportData);
      try {
        result = await ReportService.createReport(reportData);
      } catch (err) {
        error = err;
      }
    });

    then('os dados da denúncia devem ser salvos no banco de dados', () => {
      expect(Report.create).toHaveBeenCalledWith(reportData);
    });

    and('o status da resposta deve ser "201"', () => {
      expect(result).toBeDefined();
      expect(error).toBeNull();
    });

    and('a mensagem "Denúncia criada com sucesso!" deve estar presente na resposta', () => {
      expect(result).toEqual(reportData);
    });
  });

  test('Listar todas as denúncias existentes para um administrador', ({ given, when, then, and }) => {
    const mockReports = [{ content: 'Report 1' }, { content: 'Report 2' }];
    given('existem denúncias cadastradas no sistema', () => {
      const finalPopulateMock = jest.fn().mockResolvedValue(mockReports);
      const firstPopulateMock = jest.fn().mockReturnValue({ populate: finalPopulateMock });
      Report.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        populate: firstPopulateMock,
      });
    });

    when(/^uma requisição "GET" é enviada para "\/reports"$/, async () => {
      result = await ReportService.getAllReports();
    });

    then('uma lista de denúncias deve ser retornada com dados do autor e denunciante', () => {
      expect(Report.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockReports);
    });

    and('o status da resposta deve ser "200"', () => {
        expect(result).toBeDefined();
        expect(error).toBeNull();
    });
  });

  test('Visualizar detalhes das denúncias de um usuário específico', ({ given, when, then, and }) => {
    const userId = "60f8c2b7a1b3f5a8a8c3d4e5";
    const mockProfile = { name: 'Test User' };
    const mockAggregatedReports = [{ review: 'Review1', motivos: ['Spam'] }];

    given(/^o usuário com ID "(.*)" possui denúncias cadastradas$/, () => {
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockProfile) });
      Report.aggregate.mockResolvedValue(mockAggregatedReports);
    });
    
    when(/^uma requisição "GET" é enviada para "\/reports\/user\/(.*)"$/, async () => {
      result = await ReportService.getAggregatedReportsForUser(userId);
    });

    then('os dados do perfil do usuário e suas denúncias agregadas são retornados', () => {
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(Report.aggregate).toHaveBeenCalled();
      expect(result.userProfile).toEqual(mockProfile);
      expect(result.reports).toEqual(mockAggregatedReports);
    });
    
    and('o status da resposta deve ser "200"', () => {
        expect(result).toBeDefined();
        expect(error).toBeNull();
    });
  });

  test('Tentar criar uma denúncia com dados faltando', ({ given, when, and, then }) => {
    given(/^o usuário "(.*)" e a review "(.*)" existem$/, () => {});

    when(/^uma requisição "POST" é enviada para "\/reports"$/, () => {});

    and('o corpo desta requisição contém os seguintes campos:', async (table) => {
      reportData = buildReportObject(table);
      try {
        await ReportService.createReport(reportData);
      } catch (err) {
        error = err;
      }
    });

    then('o sistema rejeita a criação da denúncia', () => {
      expect(error).toBeDefined();
    });
    
    and('o status da resposta deve ser "400"', () => {
        expect(error.message).toContain('obrigatórios');
    });

    and('a mensagem "ID da review, motivo e ID do denunciante são obrigatórios." deve estar presente na resposta', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('ID da review, motivo e ID do denunciante são obrigatórios.');
    });
  });

  test('Tentar ver detalhes de um usuário com um ID de formato inválido', ({ when, then, and }) => {
    when(/^uma requisição "GET" é enviada para "\/reports\/user\/(.*)"$/, async (invalidId) => {
      try {
        await ReportService.getAggregatedReportsForUser(invalidId);
      } catch (err) {
        error = err;
      }
    });

    then('o sistema rejeita a solicitação', () => {
      expect(error).toBeDefined();
    });
    
    and('o status da resposta deve ser "400"', () => {
        expect(error.message).toBe('ID de usuário inválido.');
    });

    and('a mensagem "ID de usuário inválido." deve estar presente na resposta', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('ID de usuário inválido.');
    });
  });

  test('Tentar ver detalhes de um usuário que não existe', ({ given, when, then, and }) => {
    given(/^o usuário com ID "(.*)" não existe no sistema$/, () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });
    });

    when(/^uma requisição "GET" é enviada para "\/reports\/user\/(.*)"$/, async (userId) => {
      try {
        await ReportService.getAggregatedReportsForUser(userId);
      } catch (err) {
        error = err;
      }
    });

    then('o sistema rejeita a solicitação', () => {
        expect(error).toBeDefined();
    });

    and('o status da resposta deve ser "404"', () => {
        expect(error.message).toBe('Usuário não encontrado.');
    });

    and('a mensagem "Usuário não encontrado." deve estar presente na resposta', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Usuário não encontrado.');
    });
  });
});