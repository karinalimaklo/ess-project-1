import ReportService from '../services/report.service.js';

export const createReport = async (req, res) => {
  try {
    const reportData = {
      reviewId: req.body.reviewId,
      motivo: req.body.motivo,
      reporterId: req.body.reporterId
    };
    
    const report = await ReportService.createReport(reportData);
    res.status(201).json({ message: 'Denúncia criada com sucesso!', report });
  } catch (error) {
    if (error.message.includes('obrigatórios')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro ao criar denúncia.', error: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await ReportService.getAllReports();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar denúncias.', error: error.message });
  }
};

export const getReportsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await ReportService.getAggregatedReportsForUser(userId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes('inválido') || error.message.includes('não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro ao buscar detalhes das denúncias.', error: error.message });
  }
};

