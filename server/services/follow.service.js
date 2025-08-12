import Follow from '../models/follow.model.js';

class FollowService {
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

  static async getFollowing(userId) {
    const followingDocs = await Follow.find({ follower: userId }).populate('following', 'name avatar email');
    return followingDocs.map(doc => doc.following);
  }

  static async getFollowers(userId) {
    const followersDocs = await Follow.find({ following: userId }).populate('follower', 'name avatar email');
    return followersDocs.map(doc => doc.follower);
  }
}

export default FollowService;