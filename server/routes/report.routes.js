import express from 'express'; // Default

// Import "report" controller functions
import { createReport, getReports, getReportsByUser, getGroupedReports } from '../controllers/report.controller.js';

const router = express.Router(); // Default

// Define routes for "report" operations
router.post('/', createReport);
router.get('/', getReports);

// rota para buscar denúncias por usuário
router.get('/by-user/:userId', getReportsByUser);
router.get('/grouped/:userId', getGroupedReports);

export default router; // Default
