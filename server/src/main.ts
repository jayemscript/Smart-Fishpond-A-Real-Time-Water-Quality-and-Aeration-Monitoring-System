import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './shared/filters/exception';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { CSRFMiddleware } from 'src/middlewares/csrf-check.middleware';
import { join } from 'path';

async function bootstrap() {
  // Serve local uploads folder

  const app = await NestFactory.create(AppModule);

  const expressApp = app.getHttpAdapter().getInstance() as express.Express;
  expressApp.set('trust proxy', 1);
  expressApp.disable('x-powered-by');
  expressApp.enable('strict routing');
  expressApp.use(
    '/uploads',
    express.static(join(process.cwd(), 'uploads')), // points to ./server/uploads
  );

  //Prefix all routes with /api
  app.setGlobalPrefix('api');

  //Apply global exception filter

  app.useGlobalFilters(new AllExceptionsFilter());

  const configService = app.get(ConfigService);
  /*
   * CORS SETUP
   */
  const allowedOrigins =
    configService.get<string>('CORS_ORIGINS')?.split(',') || [];
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-XSRF-TOKEN'],
    credentials: true,
  });

  app.use((req, res, next) => {
    if (req.headers.upgrade === 'websocket') {
      console.log('WebSocket upgrade detected:', req.url);
    }
    next();
  });

  /** app nest js logs for incomin request */
  app.use((req, res, next) => {
    // console.log('>>> Incoming Request');
    // console.log('Host:', req.headers['host']);
    // console.log('X-Forwarded-Proto:', req.headers['x-forwarded-proto']);
    // console.log('X-Forwarded-For:', req.headers['x-forwarded-for']);
    // console.log('Cookies:', req.headers['cookie']);
    next();
  });

  // ----- Middlewares -----
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.headers.upgrade === 'websocket') {
      return next();
    }

    const excludedRoutes = [
      '/api/auth/sign-in',
      '/api/auth/register',
      '/api/auth/check',
      '/api/auth/verify-passkey',
      '/api/auth/refresh',
      '/api/auth/logout',
      '/api/sensors/data',
      '/api/sensors/temperature',
      '/api/sensors/water-level',
      '/api/sensors/turbidity',
      '/api/sensors/ph-water',
      '/api/sensors/do',
    ];

    if (excludedRoutes.some((path) => req.path.startsWith(path))) {
      return next();
    }

    return CSRFMiddleware(req, res, next);
  });

  // MAINTENANCE MODE NOTICE

  const port = Number(configService.get('PORT')) || 3005;
  await app.listen(port);
  const nodeEnv = configService.get<string>('NODE_ENV');

  if (nodeEnv === 'development') {
    console.log(`SERVER IS RUNNING ON PORT: ${port}`);
    console.log(`MODE:${nodeEnv}`);
  } else if (nodeEnv === 'production') {
    console.log(`SERVER IS RUNNING ON PORT: ${port}`);
    console.log(`MODE:${nodeEnv}`);
  } else if (nodeEnv === 'maintenance') {
    console.log(`SERVER IS RUNNING ON PORT: ${port}`);
    console.log(`MODE:${nodeEnv}`);
    console.log(
      'The system is currently under maintenance. Please try again later.',
    );
  } else {
    console.log(`SERVER IS RUNNING ON PORT: ${port}`);
  }
  console.log(`go to http://localhost:${port}/api for checking the endpoint`);
}
bootstrap();
