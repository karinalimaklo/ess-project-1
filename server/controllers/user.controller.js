import User from '../models/user.model.js';
import UserService from '../services/user.service.js';
import Follow from '../models/follow.model.js'; 

export const createUser = async (req, res) => {
  // Cria um novo usuário no banco de dados
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Por favor, preencha todos os campos." });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Este e-mail já está em uso." });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "Usuário criado com sucesso!",
    });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};

export const getUsers = async (req, res) => {
    try {
      // Busca todos os usuários no banco de dados
      const users = await User.find({});
  
      // Retorna a lista de usuários em formato JSON
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const [
            user,
            followersCount,
            followingCount
        ] = await Promise.all([
            UserService.getUserById(userId),
            Follow.countDocuments({ following: userId }),
            Follow.countDocuments({ follower: userId })
        ]);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            followersCount: followersCount,
            followingCount: followingCount
        });

    } catch (error) {
        if (error.message === 'Usuário não encontrado.') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};