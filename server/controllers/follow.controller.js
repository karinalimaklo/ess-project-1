import Follow from '../models/follow.model.js';

export const createFollow = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    if (followerId === followingId) {
      return res.status(400).json({ message: 'Você não pode seguir a si mesmo.' });
    }

    const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });
    if (existingFollow) {
      return res.status(400).json({ message: 'Você já segue este usuário.' });
    }

    const newFollow = await Follow.create({ follower: followerId, following: followingId });
    res.status(201).json(newFollow);
  } catch (error) {
    console.error("ERRO EM createFollow:", error);
    res.status(500).json({ message: 'Erro no servidor ao tentar seguir.', error: error.message });
  }
};

export const deleteFollow = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    const result = await Follow.deleteOne({ follower: followerId, following: followingId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Relação de seguir não encontrada para deletar.' });
    }

    res.status(200).json({ message: 'Deixou de seguir com sucesso.' });
  } catch (error) {
    console.error("ERRO EM deleteFollow:", error);
    res.status(500).json({ message: 'Erro no servidor ao tentar deixar de seguir.', error: error.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const followersDocs = await Follow.find({ following: userId }).populate('follower', 'name avatar email');
    
    const followers = followersDocs.map(doc => doc.follower);
    
    res.status(200).json(followers);
  } catch (error) {
    console.error("ERRO EM getFollowers:", error);
    res.status(500).json({ message: 'Erro no servidor ao buscar seguidores.', error: error.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const followingDocs = await Follow.find({ follower: userId }).populate('following', 'name avatar email');

    const following = followingDocs.map(doc => doc.following);
    
    res.status(200).json(following);
  } catch (error) {
    console.error("ERRO EM getFollowing:", error);
    res.status(500).json({ message: 'Erro no servidor ao buscar quem o usuário segue.', error: error.message });
  }
};