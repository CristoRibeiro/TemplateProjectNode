import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/user';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';

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
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const userExists = await this.ormRepository.findByEmail(email);
    if (!email || !password || !name) {
      throw new AppError('Required fields.');
    }
    if (userExists) {
      throw new AppError('Email adders already used by another user.', 400);
    }
    const hashedPassword = await hash(password, 8);

    const user = this.ormRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}
export default CreateUserService;
