import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { fail, ok } from '../utils/http';

export const dashboardController = {
  async userDashboard(req: Request, res: Response) {
    if (!req.user) {
      return fail(res, 401, 'Unauthorized');
    }

    const stats = await dashboardService.getUserDashboard(req.user.id);
    return ok(res, { stats });
  }
};
