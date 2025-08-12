import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Report from '../models/report.model.js';
import Review from '../models/review.model.js';
import Follow from '../models/follow.model.js';

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

  static async deleteUser(userId) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new Error('Usuário não encontrado.');
      }

      const userReviews = await Review.find({ userId: userId }).select('_id').session(session);
      const reviewIds = userReviews.map(review => review._id);

      if (reviewIds.length > 0) {
        await Report.deleteMany({
          $or: [{ reporterId: userId }, { reviewId: { $in: reviewIds } }]
        }).session(session);
      } else {
        await Report.deleteMany({ reporterId: userId }).session(session);
      }
      
      await Review.deleteMany({ userId: userId }).session(session);

      await Follow.deleteMany({
        $or: [{ follower: userId }, { following: userId }]
      }).session(session);

      await User.findByIdAndDelete(userId).session(session);

      await session.commitTransaction();
      return { message: 'Usuário e todos os dados relacionados foram excluídos com sucesso.' };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Falha ao excluir usuário: ${error.message}`);
    } finally {
      session.endSession();
    }
  }

  static async resolveCase(userId) {
    const user = await User.findByIdAndUpdate(
      userId, 
      { status: 'Ativo', suspendedUntil: null }, 
      { new: true }
    );
    if (!user) throw new Error('Usuário não encontrado.');
    return user;
  }
}

export default ModerationService;