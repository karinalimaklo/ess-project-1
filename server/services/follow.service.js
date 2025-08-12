import Follow from '../models/follow.model.js';

class FollowService {
  // ... createFollow e deleteFollow permanecem os mesmos ...
  static async createFollow(followerId, followingId) {
    if (followerId === followingId) {
      throw new Error('Você não pode seguir a si mesmo.');
    }

    const existing = await Follow.findOne({ follower: followerId, following: followingId });
    if (existing) {
      throw new Error('Você já está seguindo esse usuário.');
    }

    return await Follow.create({ follower: followerId, following: followingId });
  }

  static async deleteFollow(followerId, followingId) {
    const result = await Follow.deleteOne({ follower: followerId, following: followingId });
      if (result.deletedCount === 0) {
        throw new Error('Relação de seguir não encontrada para deletar.');
      }
      return result;
  }

  // --- CORREÇÃO AQUI ---
  static async getFollowing(userId) {
    // 1. Busque os documentos e popule os dados do usuário que é seguido
    const followingDocs = await Follow.find({ follower: userId }).populate('following', 'name avatar email');
    // 2. Extraia APENAS o objeto do usuário de cada documento
    return followingDocs.map(doc => doc.following);
  }

  // --- E CORREÇÃO AQUI ---
  static async getFollowers(userId) {
    // 1. Busque os documentos e popule os dados do usuário seguidor
    const followersDocs = await Follow.find({ following: userId }).populate('follower', 'name avatar email');
    // 2. Extraia APENAS o objeto do usuário de cada documento
    return followersDocs.map(doc => doc.follower);
  }
}

export default FollowService;