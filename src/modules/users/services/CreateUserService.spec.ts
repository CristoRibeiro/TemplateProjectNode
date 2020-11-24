import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../provider/HashProvider/fakes/FakeHashProvider';

describe('CreateUserService', () => {
  it('Should be able create a new user.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const appointment = await createUserService.execute({
      email: 'Iasmim@gmail.com',
      name: 'Iasmim',
      password: '123',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('Should not be able create a new user with duplicate email.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      name: 'Iasmim@gmail.com',
      email: 'Iasmim@gmail.com',
      password: '01234',
    });

    expect(
      createUserService.execute({
        name: 'Iasmim@gmail.com',
        email: 'Iasmim@gmail.com',
        password: 'ds545',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able create a new user without required fields.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    expect(
      createUserService.execute({
        name: 'Iasmim',
        email: '',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(
      createUserService.execute({
        name: 'Iasmim',
        email: 'ds5dsd',
        password: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
