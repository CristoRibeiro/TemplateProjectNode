import { getRepository, Repository } from 'typeorm';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IUserCreateDTO from '@modules/users/dtos/IUserCreateDTO';
import User from '../entities/User';

class UserRepository implements IUserRepository {
  private repositoryOrm: Repository<User>;

  constructor() {
    this.repositoryOrm = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const userById = await this.repositoryOrm.findOne(id);
    return userById;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const userByEmail = await this.repositoryOrm.findOne({
      where: { email },
    });

    return userByEmail;
  }

  public async create(data: IUserCreateDTO): Promise<User> {
    const user = this.repositoryOrm.create(data);

    await this.repositoryOrm.save(user);

    return user;
  }

  public async save(data: User): Promise<User> {
    const user = await this.repositoryOrm.save(data);

    return user;
  }
}
export default UserRepository;
