import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { Beach } from '@src/models/beach';
import logger from '@src/utils/logger';
import { Response, Request } from 'express';
import { BaseController } from '.';

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export class BeachesController extends BaseController {
  @Post()
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new Beach({ ...req.body, user: req.user?.id });

      const result = await beach.save();

      res.status(201).send(result);
    } catch (err) {
      logger.error(err);
      this.sendUpsertErrorResponse(res, err);
    }
  }
}
