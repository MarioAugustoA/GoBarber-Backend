import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HasProvider/fakes/FakeHashProvider';
import FakeUsertokensRepository from '../repositories/fakes/FakeUserTokenRepository';
// import UserToken from '../infra/typeorm/entities/UserToken';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsertokensRepository: FakeUsertokensRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUsertokensRepository = new FakeUsertokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUsertokensRepository,
            fakeHashProvider,
        );
    });

    it('should be able to reset the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const { token } = await fakeUsertokensRepository.generate(user.id);

        const generateHssh = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPassword.execute({
            password: '123123',
            token,
        });

        const updateUser = await fakeUsersRepository.findById(user.id);

        expect(generateHssh).toBeCalledWith('123123');
        expect(updateUser?.password).toBe('123123');
    });

    it('should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPassword.execute({
                token: 'non-existing-token',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with non-existing user', async () => {
        const { token } = await fakeUsertokensRepository.generate(
            'non-existing-user',
        );

        await expect(
            resetPassword.execute({
                token,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password if passed more than 2 hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const { token } = await fakeUsertokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPassword.execute({
                password: '123123',
                token,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
