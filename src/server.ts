import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from './routes/index';
import './database';
import uploadConfig from './config/upload';
import exceptionMiddlewares from './middlewares/exceptionMiddlewares';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/files', express.static(uploadConfig.directory));
app.use('/', exceptionMiddlewares);

app.listen(3333, () => {
  console.log('Server started with success !');
});