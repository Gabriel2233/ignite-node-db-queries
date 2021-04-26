import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    // need to apply relations, ontherwise model will not return games to bellow method
    const user = await this.repository.findOneOrFail({
      id: user_id
    }, {
      relations: ["games"]
    });

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(
      'SELECT * FROM users ORDER BY first_name ASC'
    ); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(
      `SELECT * FROM users WHERE Lower(first_name) = Lower($1) AND Lower(last_name) = Lower($2)`,
      [first_name, last_name]
    ); // Complete usando raw query
  }
}
