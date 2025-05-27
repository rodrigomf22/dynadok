import { Router } from 'express';
import clienteRoutes from './clienteRoutes';

const router = Router();

router.use('/clientes', clienteRoutes);

export default router;
