// src/middlewares/csrf-check.middleware.ts
import { Request, Response, NextFunction } from 'express';

export function CSRFMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Skip CSRF for sensor endpoints (ESP32 / IoT devices can't send CSRF tokens)
  const sensorRoutes = ['/api/sensors'];
  if (sensorRoutes.some((path) => req.path.startsWith(path))) {
    return next();
  }
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  const csrfCookie = req.cookies['XSRF-TOKEN'];
  const csrfHeader =
    req.headers['x-xsrf-token'] ||
    req.headers['x-csrf-token'] ||
    req.body?._csrf ||
    req.query?._csrf;

  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  if (process.env.NODE_ENV === 'development' && csrfHeader && !csrfCookie) {
    return next();
  }

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({ message: 'Invalid CSRF token or Expired' });
  }

  return next();
}
