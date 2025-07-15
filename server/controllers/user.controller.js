import User from '../models/user.model.js';
import UserService from '../services/user.service.js';

export const getUsers = async (req, res) => {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Erro no servidor ao buscar usuários.', error: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserService.getUserById(id);
        res.status(200).json(user);
    } catch (error) {
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Erro no servidor ao buscar usuário.', error: error.message });
    }
};