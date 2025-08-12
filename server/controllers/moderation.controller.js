import ModerationService from '../services/moderation.service.js';

export const getReportedUsers = async (req, res) => {
  try {
    const result = await ModerationService.getReportedUsers();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários reportados.', error: error.message });
  }
};

export const sendWarning = async (req, res) => {
  try {
    const { userId } = req.params;
    const { mensagem } = req.body;
    await ModerationService.sendWarning(userId, mensagem);
    res.status(200).json({ message: 'Advertência enviada com sucesso.' });
  } catch (error) {
    if (error.message.includes('obrigatória')) {
      return res.status(400).json({ message: error.message }); // Erro de input do cliente
    }
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({ message: error.message }); // Recurso não existe
    }
    res.status(500).json({ message: 'Erro ao enviar advertência.', error: error.message });
  }
};

export const suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { dias, justificativa } = req.body;
    await ModerationService.suspendUser(userId, dias, justificativa);
    res.status(200).json({ message: `Usuário suspenso por ${dias} dias.` });
  } catch (error) {
    if (error.message.includes('válido') || error.message.includes('obrigatória')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro ao suspender usuário.', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { justificativa } = req.body;
    await ModerationService.deleteUser(userId, justificativa);
    res.status(200).json({ message: 'Conta de usuário excluída com sucesso.' });
  } catch (error) {
    if (error.message.includes('obrigatória')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro ao excluir usuário.', error: error.message });
  }
};

export const resolveCase = async (req, res) => {
  try {
    const { userId } = req.params;
    await ModerationService.resolveCase(userId);
    res.status(200).json({ message: 'Caso arquivado e usuário reativado.' });
  } catch (error) {
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro ao arquivar caso.', error: error.message });
  }
};