import IUserRepository from '@modules/users/repositories/IUserRepository';
import IUserCreateDTO from '@modules/users/dtos/IUserCreateDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import { uuid } from 'uuidv4';

class FakeUsersRepository implements IUserRepository {
  private users: User[] = [];

  public async findAll(): Promise<Array<User> | undefined> {
    return this.users;
  }

  public async findById(id: string): Promise<User | undefined> {
    const userById = this.users.find(user => user.id === id);
    return userById;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const userByEmail = this.users.find(user => user.email === email);
    return userByEmail;
  }

  public async create(data: IUserCreateDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid() }, data);
    this.users.push(user);

    return user;
  }

  public async save(data: User): Promise<User> {
    const indexUser = this.users.findIndex(user => user.id === data.id);
    this.users[indexUser] = data;

    return this.users[indexUser];
  }
}
export default FakeUsersRepository;
