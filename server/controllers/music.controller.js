import MusicService from '../services/music.service.js';

export const createMusic = async (req, res) => {
	try {
		const music = await MusicService.createMusic(req.body);
		res.status(201).json({ message: 'Música criada com sucesso!', music });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const searchMusic = async (req, res) => {
	try {
		const musics = await MusicService.searchMusic(req.query.termo);
		res.json(musics);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getMusicDetails = async (req, res) => {
	try {
		const music = await MusicService.getMusicDetails(req.params.id);
		res.json(music);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const updateMusic = async (req, res) => {
	try {
		const updated = await MusicService.updateMusic(req.params.id, req.body);
		res.status(200).json({ message: 'Música atualizada com sucesso!', music: updated });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const deleteMusic = async (req, res) => {
	try {
		await MusicService.deleteMusic(req.params.id);
		res.status(200).json({ message: 'Música removida com sucesso.' });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
