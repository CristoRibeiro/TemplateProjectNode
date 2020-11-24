import { Response, Request } from 'express';
import { container } from 'tsyringe';

import UserMap from '@modules/users/map/UserMap';
import CreateSessionService from '@modules/users/services/CreateSessionService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createSessionService = container.resolve(CreateSessionService);
    const { user, token } = await createSessionService.execute({
      email,
      password,
    });
    const userDTO = UserMap.toDTO(user);

    return response.json({ userDTO, token });
  }
}
