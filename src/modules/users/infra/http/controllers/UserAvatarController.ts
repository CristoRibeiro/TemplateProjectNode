import { Response, Request } from 'express';
import { container } from 'tsyringe';

import UpdateAvatarUserService from '@modules/users/services/UpdateAvatarUserService';
import UserMap from '@modules/users/map/UserMap';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
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
  }
}
