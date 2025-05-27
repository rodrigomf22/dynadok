import { Router } from 'express';
import { ClienteController } from '../controllers/ClienteController';
import { validateCreateCliente } from '../validators/CreateClienteValidator';
import { validateMongoIdParam } from '../validators/clienteIdValidator';

const router = Router();
const controller = new ClienteController();

router.post('/', validateCreateCliente, (req, res) => controller.create(req, res));
router.get('/', (req, res) => controller.findAll(req, res));
router.get('/:id', validateMongoIdParam('id'), (req, res) => controller.findById(req, res));
router.put('/:id', validateMongoIdParam('id'), (req, res) => controller.update(req, res));

export default router;
