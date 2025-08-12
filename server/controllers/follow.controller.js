import FollowService from '../services/follow.service.js';

export const createFollow = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    const newFollow = await FollowService.createFollow(followerId, followingId);
    res.status(201).json(newFollow);
  } catch (error) {
    console.error("ERRO EM createFollow:", error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteFollow = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    await FollowService.deleteFollow(followerId, followingId);
    res.status(200).json({ message: 'Deixou de seguir com sucesso.' });
  } catch (error) {
    console.error("ERRO EM deleteFollow:", error);
    res.status(404).json({ message: error.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const followers = await FollowService.getFollowers(userId); 
    res.status(200).json(followers);
  } catch (error) {
    console.error("ERRO EM getFollowers:", error);
    res.status(500).json({ message: 'Erro no servidor ao buscar seguidores.', error: error.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const following = await FollowService.getFollowing(userId);
    res.status(200).json(following);
  } catch (error) {
    console.error("ERRO EM getFollowing:", error);
    res.status(500).json({ message: 'Erro no servidor ao buscar quem o usuário segue.', error: error.message });
  }
};