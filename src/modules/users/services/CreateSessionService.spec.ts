import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateSessionService from '@modules/users/services/CreateSessionService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../provider/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

describe('CreateSessionService', () => {
  it('Should be able create a new session.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createSessionService = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      email: 'Iasmim@gmail.com',
      password: '123',
      name: 'iasmim,',
    });

    const data = await createSessionService.execute({
      email: 'Iasmim@gmail.com',
      password: '123',
    });

    expect(data).toHaveProperty('token');
    expect(data.user).toEqual(user);
  });

  it('Should not be able create a new session for user not register.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createSessionService = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    expect(async () =>
      createSessionService.execute({
        email: 'cris@gmail.com',
        password: 'cbhjckjie',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able create a new session for wrong password.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createSessionService = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      email: 'cris@gmail.com',
      password: '123',
      name: 'cris',
    });

    expect(async () =>
      createSessionService.execute({
        email: 'cris@gmail.com',
        password: 'cbhjckjie',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
