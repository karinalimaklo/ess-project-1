import Report from '../models/report.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

class ReportService {
  // Método para criar uma denúncia
  static async createReport({ reviewId, motivo, reporterId }) {
    if (!reviewId || !motivo || !reporterId) {
      throw new Error('ID da review, motivo e ID do denunciante são obrigatórios.');
    }
    return await Report.create({ reviewId, motivo, reporterId });
  }
  // Método para buscar uma denúncia por ID
  static async getAllReports() {
    return await Report.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: 'reviewId',
        select: 'musicTitle artista',
        populate: {
          path: 'userId',
          model: 'User',
          select: 'name email'
        }
      })
      .populate({
        path: 'reporterId',
        model: 'User',
        select: 'name email'
      });
  }
  // Método para buscar uma denúncia por ID
  static async getAggregatedReportsForUser(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('ID de usuário inválido.');
    }

    const userProfile = await User.findById(userId).select('name email status createdAt');
    if (!userProfile) {
      throw new Error('Usuário não encontrado.');
    }

    const reports = await Report.aggregate([
        { $lookup: { from: 'reviews', localField: 'reviewId', foreignField: '_id', as: 'review' } },
        { $unwind: '$review' },
        { $match: { 'review.userId': new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: '$reviewId', musicTitle: { $first: '$review.musicTitle' }, motivos: { $push: '$motivo' } } },
        { $project: { _id: 0, reviewId: '$_id', review: '$musicTitle', motivos: 1 } }
    ]);

    const aggregatedReports = reports.map(report => {
      const motiveCounts = report.motivos.reduce((acc, motivo) => {
        acc[motivo] = (acc[motivo] || 0) + 1;
        return acc;
      }, {});
      report.motivos = Object.entries(motiveCounts)
        .map(([motivo, count]) => `${motivo} (${count})`)
        .join(', ');
      return report;
    });
    
    return { userProfile, reports: aggregatedReports };
  }

  static async getGroupedReportsForUser(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('ID de usuário inválido.');
    }

    const userProfilePromise = User.findById(userId).select('name email status createdAt warnings');
    
    const userReviews = await mongoose.model('Review').find({ userId: userId }).select('_id');
    if (userReviews.length === 0) {
      const userProfile = await userProfilePromise;
      return { userProfile, reportsByReview: [] };
    }
    const reviewIds = userReviews.map(review => review._id);

    const reportsPromise = Report.aggregate([
      { $match: { reviewId: { $in: reviewIds } } },
      { $lookup: { from: 'users', localField: 'reporterId', foreignField: '_id', as: 'reporterInfo' } },
      { $unwind: '$reporterInfo' },
      {
        $group: {
          _id: '$reviewId',
          reports: {
            $push: {
              motivo: '$motivo',
              reporterName: '$reporterInfo.name',
              reportedAt: '$createdAt'
            }
          }
        }
      },
      { $lookup: { from: 'reviews', localField: '_id', foreignField: '_id', as: 'reviewInfo' } },
      { $unwind: '$reviewInfo' },
      { 
        $project: {
          _id: 0,
          review: '$reviewInfo',
          reports: '$reports'
        }
      }
    ]);
    
    const [userProfile, reportsByReview] = await Promise.all([userProfilePromise, reportsPromise]);

    if (!userProfile) {
      throw new Error('Usuário não encontrado.');
    }
    
    return { userProfile, reportsByReview };
  }
}

export default ReportService;