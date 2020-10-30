/* eslint-disable prettier/prettier */
import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import AppointmentsRepository from "@modules/appointments/infra/typeorm/repositories/AppointmentsRepository";

import IUsersRepository from "@modules/users/repositories/IUsersReposirory";
import UsersRepository from "@modules/users/infra/typeorm/repositories/UsersRepository";

container.registerSingleton<IAppointmentsRepository>(
    'AppointmmentsRepository',
     AppointmentsRepository
     );

container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository
     );
