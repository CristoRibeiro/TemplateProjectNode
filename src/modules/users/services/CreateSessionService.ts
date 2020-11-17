import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/user';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  email: string;
  password: string;
}
interface IResponse {
  user: User;
  token: string;
}
@injectable()
class CreateSessionService {
  public constructor(
    @inject('UserRepository')
    private ormRepository: IUserRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const messageIncorrectCombination = 'Incorrect combination password/email';
    const user = await this.ormRepository.findByEmail(email);

    if (!user) {
      throw new AppError(messageIncorrectCombination, 401);
    }

    const passwordCorrect = await compare(password, user.password);

    if (!passwordCorrect) {
      throw new AppError(messageIncorrectCombination, 401);
    }
    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ user_name: user.name }, secret, {
      subject: user.id,
      expiresIn,
    });
    return { user, token };
  }
}
export default CreateSessionService;
