import { inject, injectable } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import IStorageProvider from '@shared/container/provider/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  user_id: string;
  filename: string;
}
@injectable()
class UpdateAvatarUserService {
  public constructor(
    @inject('UserRepository')
    private ormRepository: IUserRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, filename }: IRequest): Promise<User> {
    const user = await this.ormRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only user authenticated can alter Avatar');
    }
    if (user.avatar) {
      this.storageProvider.deleteFile(user.avatar);
    }
    user.avatar = await this.storageProvider.saveFile(filename);

    await this.ormRepository.save(user);

    return user;
  }
}

export default UpdateAvatarUserService;
