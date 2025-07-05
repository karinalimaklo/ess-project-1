import Follow from '../models/follow.model.js';

// funcion to create a follow relationship
export const createFollow = async (req, res) => {
  const { followerId, followingId } = req.body;

  if (followerId === followingId) {
    return res.status(400).json({ error: 'Você não pode seguir a si mesmo.' });
  }

  try {
    const follow = new Follow({ follower: followerId, following: followingId });
    await follow.save();
    res.status(201).json(follow);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Você já está seguindo esse usuário.' });
    }
    res.status(500).json({ error: 'Erro ao seguir usuário.' });
  }
};

// function to delete a follow relationship
export const deleteFollow = async (req, res) => {
  const { followerId, followingId } = req.body;

  try {
    const result = await Follow.findOneAndDelete({ follower: followerId, following: followingId });

    if (!result) {
      return res.status(404).json({ error: 'Você não segue esse usuário' });
    }

    res.status(200).json({ message: 'Unfollow realizado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deixar de seguir o usuário.' });
  }
};

// function to get the list of users that a user is following
export const getFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const following = await Follow.find({ follower: userId })
      .populate('following', 'username email _id')
      .sort({ createdAt: -1 });

    res.status(200).json(following.map(f => f.following));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar seguindo.' });
  }
};

// function to get the list of followers of a user
export const getFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const followers = await Follow.find({ following: userId })
      .populate('follower', 'username email _id')
      .sort({ createdAt: -1 });

    res.status(200).json(followers.map(f => f.follower));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar seguidores.' });
  }
};
