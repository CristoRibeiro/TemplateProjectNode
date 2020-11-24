import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeDiskStorageProvider from '@shared/container/provider/StorageProvider/fakes/FakeDiskStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../provider/HashProvider/fakes/FakeHashProvider';
import UpdateAvatarUserService from './UpdateAvatarUserService';

describe('UpdateAvatarUserService', () => {
  it('Should be able create a new user.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeDiskStorageProvider = new FakeDiskStorageProvider();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const { id } = await createUserService.execute({
      email: 'cris@gmail.com',
      name: 'cris',
      password: '123',
    });

    const updateAvatarUserService = new UpdateAvatarUserService(
      fakeUsersRepository,
      fakeDiskStorageProvider,
    );

    const user = await updateAvatarUserService.execute({
      user_id: id,
      filename:
        '0f7f38a9a292a8faa93e - Screenshot from 2020-08-18 13-21-18.jpg',
    });

    expect(user.avatar).toEqual(
      '0f7f38a9a292a8faa93e - Screenshot from 2020-08-18 13-21-18.jpg',
    );
  });

  it('Should not be able update avatar without user register.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeDiskStorageProvider = new FakeDiskStorageProvider();

    const updateAvatarUserService = new UpdateAvatarUserService(
      fakeUsersRepository,
      fakeDiskStorageProvider,
    );

    expect(
      updateAvatarUserService.execute({
        user_id: '12316',
        filename:
          '0f7f38a9a292a8faa93e - Screenshot from 2020-08-18 13-21-18.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able delete a avatar already existing.', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeDiskStorageProvider = new FakeDiskStorageProvider();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const deleteFile = jest.spyOn(fakeDiskStorageProvider, 'deleteFile');

    const updateAvatarUserService = new UpdateAvatarUserService(
      fakeUsersRepository,
      fakeDiskStorageProvider,
    );
    const { id } = await createUserService.execute({
      email: 'cris@gmail.com',
      name: 'cris',
      password: '123',
    });

    let user = await updateAvatarUserService.execute({
      user_id: id,
      filename: 'File1.jpg',
    });
    expect(user.avatar).toEqual('File1.jpg');

    user = await updateAvatarUserService.execute({
      user_id: id,
      filename: 'File2.jpg',
    });

    expect(user.avatar).toEqual('File2.jpg');
    expect(deleteFile).toHaveBeenCalledWith('File1.jpg');
  });
});
