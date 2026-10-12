import { dashboardSummary } from '../services/habitService.js';

export async function dashboard(req, res, next) {
  try {
    res.json({ dashboard: await dashboardSummary(req.user, req.query.date) });
  } catch (err) {
    next(err);
  }
}
