import {Router} from 'express';
import {getMachines, addMachines, deleteMachines} from '../controllers/machineController';

const router = Router();

router.get('/', getMachines);
router.post('/', addMachines);
router.delete('/:id', deleteMachines);

export default router;