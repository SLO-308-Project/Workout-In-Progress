import {Router} from 'express';
import {getMachines} from '../controllers/machineController';

const router = Router();

router.get('/', getMachines);

export default router;