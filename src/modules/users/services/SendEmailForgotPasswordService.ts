import IMailProvider from '@shared/container/provider/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendEmailForgotPasswordService {
  public constructor(
    @inject('UserRepository')
    private ormRepository: IUserRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.ormRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Usuário não cadastrado!');
    }
    await this.userTokenRepository.generate(user.id);

    await this.mailProvider.sendEmail(
      email,
      'Pedido de reset de password enviado com sucesso.',
    );
  }
}
export default SendEmailForgotPasswordService;
