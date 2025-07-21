import express from 'express';
import { createFollow, deleteFollow, getFollowers, getFollowing} from '../controllers/follow.controller.js';

const router = express.Router();

router.post('/', createFollow); //follow a user                  
router.delete('/', deleteFollow); //unfollow a user                
router.get('/followers/:userId', getFollowers); //get followers of a user 
router.get('/following/:userId', getFollowing); //get users that a user is following

export default router;
