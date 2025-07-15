import FollowService from '../services/follow.service.js';

// follow a user
export const createFollow = async (req, res) => {
    try {
        const followerId = req.user._id;
        const { followingId } = req.body;

        if (!followingId) {
            return res.status(400).json({ error: 'O ID do usuário a ser seguido (followingId) é obrigatório.' });
        }

        const newFollow = await FollowService.createFollow(followerId, followingId);
        res.status(201).json(newFollow);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 

// unfollow a user
export const deleteFollow = async (req, res) => {
    try {
        const followerId = req.user._id;
        const { followingId } = req.body;

        if (!followingId) {
            return res.status(400).json({ error: 'O ID do usuário a ser deixado de seguir (followingId) é obrigatório.' });
        }

        await FollowService.deleteFollow(followerId, followingId);
        res.status(200).json({ message: 'Unfollow realizado com sucesso.' });
    } catch (error) {
        if (error.message === 'Follow não encontrado') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Erro ao deixar de seguir o usuário.' });
    }
};

// list of users that a specific user is following
export const getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;
        const followingList = await FollowService.getFollowing(userId);
        
        const users = followingList.map(item => item.following);
        
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar a lista de usuários seguidos.' });
    }
};

// list of users that follow a specific user
export const getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;
        const followersList = await FollowService.getFollowers(userId);

        const users = followersList.map(item => item.follower);

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar a lista de seguidores.' });
    }
};