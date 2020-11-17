import { Router } from 'express';
import { container } from 'tsyringe';
import UserMap from '@modules/users/map/UserMap';
import CreateSessionService from '@modules/users/services/CreateSessionService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const createSessionService = container.resolve(CreateSessionService);
  const { user, token } = await createSessionService.execute({
    email,
    password,
  });
  const userDTO = UserMap.toDTO(user);

  return response.json({ userDTO, token });
});

export default sessionsRouter;
