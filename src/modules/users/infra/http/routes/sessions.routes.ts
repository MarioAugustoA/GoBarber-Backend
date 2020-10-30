import { Router } from 'express';

import SessionController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionController = new SessionController();
// http://localhost:3333

sessionsRouter.post('/', sessionController.create);

export default sessionsRouter;
