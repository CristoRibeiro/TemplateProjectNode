import express from 'express';
import multer from 'multer';
import UserMap from '@modules/users/map/UserMap';
import { container } from 'tsyringe';

import uploadConfig from '@config/upload';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateAvatarUserService from '@modules/users/services/UpdateAvatarUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = express.Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUserService = container.resolve(CreateUserService);

  const user = await createUserService.execute({ name, email, password });

  return response.json(UserMap.toDTO(user));
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    try {
      const updateAvatarUserService = container.resolve(
        UpdateAvatarUserService,
      );

      const user = await updateAvatarUserService.execute({
        user_id: request.user.id,
        filename: request.file.filename,
      });
      return response.json(UserMap.toDTO(user));
    } catch (error) {
      return response.status(error.status).json({ error: error.message });
    }
  },
);
export default usersRouter;
