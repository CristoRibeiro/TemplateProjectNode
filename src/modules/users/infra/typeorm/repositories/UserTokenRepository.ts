import { getRepository, Repository } from 'typeorm';
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import UserToken from '../entities/UserToken';

class UserTokenRepository implements IUserTokenRepository {
  private repositoryOrm: Repository<UserToken>;

  constructor() {
    this.repositoryOrm = getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.repositoryOrm.create({ user_id });

    await this.repositoryOrm.save(userToken);

    return userToken;
  }
}
export default UserTokenRepository;
