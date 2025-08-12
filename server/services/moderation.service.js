import User from '../models/user.model.js';
import Report from '../models/report.model.js';

class ModerationService {

  static async getReportedUsers() {
    return await Report.aggregate([
      { $lookup: { from: 'reviews', localField: 'reviewId', foreignField: '_id', as: 'reviewInfo' } },
      { $unwind: '$reviewInfo' },
      { $group: { _id: '$reviewInfo.userId', reportsCount: { $sum: 1 }, lastReportDate: { $max: '$createdAt' } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userInfo' } },
      { $unwind: '$userInfo' },
      { $match: { 'userInfo.status': { $ne: 'Excluído' } } },
      { $project: { _id: 0, userId: '$userInfo._id', name: '$userInfo.name', status: '$userInfo.status', reports: '$reportsCount', lastReportDate: 1 } }
    ]);
  }
  
  static async sendWarning(userId, mensagem) {
    if (!mensagem) throw new Error('A mensagem de advertência é obrigatória.');
    const warningMessage = `Advertência: ${mensagem}`;
    const user = await User.findByIdAndUpdate(
      userId, 
      { $push: { warnings: { mensagem: warningMessage, date: new Date() } } },
      { new: true }
    );
    if (!user) throw new Error('Usuário não encontrado.');
    return user;
  }

  static async suspendUser(userId, dias, justificativa) {
    if (!dias || isNaN(dias) || dias <= 0) {
      throw new Error('Informe um número válido de dias.');
    }
    if (!justificativa) {
      throw new Error('Justificativa obrigatória para suspensão.');
    }
    const suspendedUntil = new Date(Date.now() + dias * 24 * 60 * 60 * 1000);
    const warningMessage = `Conta suspensa por ${dias} dia(s). Motivo: ${justificativa}`;
    const user = await User.findByIdAndUpdate(
      userId, 
      { 
        status: 'Suspenso', 
        suspendedUntil, 
        $push: { warnings: { mensagem: warningMessage, date: new Date() } }
      },
      { new: true }
    );
    if (!user) throw new Error('Usuário não encontrado.');
    return user;
  }

  static async deleteUser(userId, justificativa) {
    if (!justificativa) {
      throw new Error('Justificativa obrigatória para exclusão.');
    }
    const warningMessage = `Conta excluída. Motivo: ${justificativa}`;
    const user = await User.findByIdAndUpdate(
      userId, 
      { 
        status: 'Excluído',
        $push: { warnings: { mensagem: warningMessage, date: new Date() } }
      }, 
      { new: true }
    );
    if (!user) throw new Error('Usuário não encontrado.');
    return user;
  }

  static async resolveCase(userId) {
    const user = await User.findByIdAndUpdate(
      userId, 
      { status: 'Ativo', suspendedUntil: null, suspensionReason: null }, 
      { new: true }
    );
    if (!user) throw new Error('Usuário não encontrado.');
    return user;
  }
}

export default ModerationService;