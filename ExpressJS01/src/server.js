import 'dotenv/config';
import express from 'express';
import configViewEngine from './config/viewEngine.js';
import connection from './config/database.js';
import cors from 'cors';
import { getHomepage } from './controllers/homeController.js';
import apiRoutes from './routes/api.js';
import path from 'path';

import productApi from './routes/productApi.js';
import categoryApi from './routes/categoryApi.js';
import cartApi from './routes/cartApi.js';
import orderApi from './routes/orderApi.js';

const app = express();

const port = process.env.PORT || 8888;

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ================= APIs =================
app.use('/v1/api/', productApi);

app.use('/v1/api/', categoryApi);

app.use('/v1/api/', cartApi);

app.use('/v1/api/', orderApi);

// ================= VIEW ENGINE =================
configViewEngine(app);

// ================= WEB ROUTE =================
const webAPI = express.Router();

webAPI.get("/", getHomepage);

app.use('/', webAPI);

// ================= OTHER API =================
app.use('/v1/api/', apiRoutes);

// ================= STATIC FILE =================
app.use(
    '/images',
    express.static(
        path.join(process.cwd(), 'src/public/images')
    )
);

// ================= START SERVER =================
(async () => {

    try {

        await connection();

        app.listen(port, () => {

            console.log(
                `Backend Nodejs App listening on port ${port}`
            );
        });

    } catch (error) {

        console.log(
            ">>> Error connect to DB: ",
            error
        );
    }

})();