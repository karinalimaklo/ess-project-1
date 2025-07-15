import express from 'express';
import * as moderationController from '../controllers/moderation.controller.js';
import * as reportController from '../controllers/report.controller.js';
import * as reviewController from '../controllers/review.controller.js';

const router = express.Router();

// Rotas de Visualização do Painel de Moderação
router.get('/reported-users', moderationController.getReportedUsers);
router.get('/users/:userId/reports', reportController.getReportsForUser);

//Rotas de Ações Disciplinares sobre Usuários
router.post('/users/:userId/warn', moderationController.sendWarning);
router.post('/users/:userId/suspend', moderationController.suspendUser);
router.delete('/users/:userId', moderationController.deleteUser);
router.patch('/users/:userId/resolve', moderationController.resolveCase);

// Ocultar uma review
router.patch('/reviews/:reviewId/hide', reviewController.hideReview);


export default router;