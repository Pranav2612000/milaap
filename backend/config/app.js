// Libs & utils
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import { pathConfig } from './';
const cors = require('cors');
//=====================================
//  GLOBAL APP CONFIGURATION
//-------------------------------------
export const appConfig = {
  // server address

  configureApp: (app) => {
    // server address
    app.use(cors());
    app.options('*', cors());
    // HTTP headers
    app.disable('x-powered-by');
    app.use(helmet.frameguard({ action: 'deny' }));
    app.use(helmet.noSniff());
    app.use(helmet.xssFilter());
    app.use(helmet.ieNoOpen());

    // gzip compression
    app.use(compression());

    app.use(express.json({ limit: '50mb' }));
    // static files
    // app.use(express.static(pathConfig.static, { index: false }));
  }
};
