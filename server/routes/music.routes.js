import express from 'express';

import {
  createMusic,
  searchMusic,
  getMusicDetails,
  updateMusic,
  deleteMusic,
} from '../controllers/music.controller.js';

const router = express.Router();

router.post('/', createMusic);     
router.get('/search', searchMusic);                        
router.get('/:id', getMusicDetails);                     
router.put('/:id', updateMusic);                         
router.delete('/:id', deleteMusic);                       

export default router;
