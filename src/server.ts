import express from 'express';
import dotenv from 'dotenv';
import router from './routes';
import { serve, setup } from 'swagger-ui-express'
import apiSpecif from './openapi.json'
dotenv.config();
const app = express();
app.use(express.json());
app.use(router);
app.use('/', serve, setup(apiSpecif))
const PORT =  process.env.PORT ?? 80;
1
app.listen(PORT , () =>{
    console.log(`App Runing in port ${PORT}`)
})