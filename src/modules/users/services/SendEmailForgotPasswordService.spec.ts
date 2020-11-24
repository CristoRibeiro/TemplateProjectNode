import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import SendEmailForgotPasswordService from '@modules/users/services/SendEmailForgotPasswordService';
import FakeMailProvider from '@shared/container/provider/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let sendEmailForgotPasswordService: SendEmailForgotPasswordService;
let fakeUserTokenRepository: FakeUserTokenRepository;

describe('SendEmailForgotPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    sendEmailForgotPasswordService = new SendEmailForgotPasswordService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );
  });

  it('Should be able recover password using the email.', async () => {
    fakeUsersRepository.create({
      email: 'Iasmim@gmail.com',
      name: 'Iasmim',
      password: '123456',
    });

    const sendEmail = jest.spyOn(fakeMailProvider, 'sendEmail');

    await sendEmailForgotPasswordService.execute({
      email: 'Iasmim@gmail.com',
    });

    expect(sendEmail).toHaveBeenCalled();
  });

  it('Should not be able recover a non-existing user password.', async () => {
    await expect(
      sendEmailForgotPasswordService.execute({
        email: 'Iasmim@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able generate a forgot password token.', async () => {
    const generate = jest.spyOn(fakeUserTokenRepository, 'generate');

    const { id } = await fakeUsersRepository.create({
      email: 'Iasmim@gmail.com',
      name: 'Iasmim',
      password: '123456',
    });
    await sendEmailForgotPasswordService.execute({ email: 'Iasmim@gmail.com' });

    expect(generate).toBeCalledWith(id);
  });
});
