import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import CreateUserServece from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();

const upload = multer(uploadConfig);

// http://localhost:3333

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    const usersrepository = new UsersRepository();
    const createUser = new CreateUserServece(usersrepository);

    const user = await createUser.execute({
        name,
        email,
        password,
    });

    delete user.password;

    return response.send(user);
    // eslint-disable-next-line camelcase
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const usersrepository = new UsersRepository();
        const updateUserAvatar = new UpdateUserAvatarService(usersrepository);

        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        });

        delete user.password;

        return response.json(user);
    },
);

export default usersRouter;
