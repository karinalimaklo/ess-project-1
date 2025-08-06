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
    return await Follow.deleteOne({ follower: followerId, following: followingId });
  }

  static async getFollowing(userId) {
    return await Follow.find({ follower: userId }).populate('following', 'name');
  }

  static async getFollowers(userId) {
    return await Follow.find({ following: userId }).populate('follower', 'name');
  }
}

export default FollowService;