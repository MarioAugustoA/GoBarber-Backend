import { container } from 'tsyringe';

import IHashProvider from './HasProvider/models/IHashProvider';
import BCryptHashProvider from './HasProvider/Implementations/BCrypyHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
