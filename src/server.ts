import express from 'express';
import dotenv from 'dotenv';
import router from './routes';
dotenv.config();
const app = express();
app.use(express.json());
app.use(router);


app.listen(process.env.PORT, () =>{
    console.log(`App Runing in port ${process.env.PORT}`)
})