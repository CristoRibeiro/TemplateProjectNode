import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import { IHashProvider } from '../provider/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  public constructor(
    @inject('UserRepository')
    private ormRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const userExists = await this.ormRepository.findByEmail(email);
    if (!email || !password || !name) {
      throw new AppError('Required fields.');
    }
    if (userExists) {
      throw new AppError('Email adders already used by another user.', 401);
    }
    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = this.ormRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}
export default CreateUserService;
