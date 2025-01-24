
import dotenv from "dotenv";
import express from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import router from './adapters/router/index.js'

import connectToDataBase from './framework/database/connection.js'
import corsConnection from './framework/web/middlware/corsConnection.js'
import errorHandler from './framework/web/middlware/errorHandler.js'
import { createServer } from 'http'
import { socketConfig } from "./socketio.js";

dotenv.config(); // Load environment variables from .env

const app = express()
const server = createServer(app)

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
const PORT = process.env.PORT

app.use(cors(corsConnection())); 

app.use(xss()); // Protect against Cross-Site Scripting (XSS) attack

app.use(mongoSanitize())

// Connect to the database
connectToDataBase();

// Application routes
app.use('/', router);

// Handle 404 errors for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  socketConfig(server)

// Global error handler
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`server starts running at http://localhost:${PORT}`);
})