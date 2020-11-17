import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from '@shared/infra/http/routes/index';
import '@shared/infra/typeorm';
import uploadConfig from '@config/upload';
import exceptionMiddlewares from '@shared/infra/http/middlewares/exceptionMiddlewares';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/files', express.static(uploadConfig.directory));
app.use('/', exceptionMiddlewares);

app.listen(3333, () => {
  console.log('Server started with success !');
});
