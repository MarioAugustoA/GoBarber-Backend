import { Router } from 'express';


import ensureAthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAthenticated);
// http://localhost:3333
// appointmentsRouter.get('/', async (request, response) => {
//     const appointments = await appointmentsRepository.find();

//     return response.json(appointments);
// });
appointmentsRouter.post('/', appointmentsController.create);
    // eslint-disable-next-line camelcase


export default appointmentsRouter;
