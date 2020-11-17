import path from 'path';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/user';
import uploadConfig from '@config/upload';
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
  ) {}

  public async execute({ user_id, filename }: IRequest): Promise<User> {
    const user = await this.ormRepository.findById(user_id);

    if (!user) {
      throw new Error('Only user authenticated can alter Avatar');
    }
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    user.avatar = filename;
    await this.ormRepository.save(user);

    return user;
  }
}

export default UpdateAvatarUserService;
