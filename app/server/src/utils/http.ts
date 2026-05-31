import { Response } from 'express';

export const ok = <T>(res: Response, data: T, message = 'OK') => {
  return res.status(200).json({ success: true, message, data });
};

export const created = <T>(res: Response, data: T, message = 'Created') => {
  return res.status(201).json({ success: true, message, data });
};

export const fail = (res: Response, status: number, message: string) => {
  return res.status(status).json({ success: false, message });
};
