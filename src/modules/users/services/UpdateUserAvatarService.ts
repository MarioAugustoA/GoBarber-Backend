import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUserReposirory';

import User from '../infra/typeorm/entities/User';
/* eslint-disable camelcase */
interface IRequest {
    user_id: string;
    avatarFilename: string;
}

class UpdateUserAvatarService {
    constructor( private  usersRepository: IUsersRepository){}

    public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {

        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError(
                'Only authenticated users can change avatar',
                401,
            );
        }
        if (user.avatar) {
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );
            const userAvatarFileExits = await fs.promises.stat(
                userAvatarFilePath,
            );

            if (userAvatarFileExits) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFilename;

        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;