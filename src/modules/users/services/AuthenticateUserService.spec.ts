import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HasProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
    it('should be able to authenticate', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@exemple.com',
            password: '123456',
        });

        const response = await authenticateUser.execute({
            email: 'johndoe@exemple.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });
    it('should not be able to authenticate whith non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await expect(
            authenticateUser.execute({
                email: 'johndoe@exemple.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should not be able to authenticate whit wrong password', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@exemple.com',
            password: '123456',
        });

        await expect(
            authenticateUser.execute({
                email: 'johndoe@exemple.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});