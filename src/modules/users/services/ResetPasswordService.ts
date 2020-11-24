import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  public constructor(
    @inject('UserRepository')
    private ormRepository: IUserRepository,
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('Token inválido');
    }

    const user = await this.ormRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('Usuário não encontrado!');
    }

    user.password = password;

    await this.ormRepository.save(user);
  }
}
export default ResetPasswordService;
