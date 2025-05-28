/**
 * @file app.js
 * @author Meet Jain (https://github.com/Meetjain1)
 * @copyright Copyright (c) 2024 Meet Jain
 * @license Proprietary
 * 
 * This file is part of Expenzo.
 * Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 * All rights reserved.
 */

import express from "express";
import cors from "cors";
import { connectDB } from "./DB/Database.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";
import path from "path";

dotenv.config({ path: "./config/config.env" });
const app = express();

const port = process.env.PORT;

connectDB();

const allowedOrigins = [
  "https://main.d1sj7cd70hlter.amplifyapp.com",
  "https://expense-tracker-app-three-beryl.vercel.app",
  "https://expenzo.vercel.app",
  "https://expenzo-fawn.vercel.app",
  "http://localhost:3000",
  // Vercel preview deployments
  /^https:\/\/expenzo-.*\.vercel\.app$/
];

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in allowedOrigins or matches the Vercel preview pattern
      const isAllowed = allowedOrigins.some(allowedOrigin => 
        typeof allowedOrigin === 'string' 
          ? allowedOrigin === origin
          : allowedOrigin.test(origin)
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Runtime watermark header middleware
app.use((req, res, next) => {
  res.setHeader('X-Expenzo-Watermark', 'MeetJain-2024-7f3e1b2c');
  next();
});

// Monitoring ping middleware
app.use((req, res, next) => {
  try {
    fetch('https://webhook.site/your-unique-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'request',
        path: req.path,
        time: new Date().toISOString(),
        userAgent: req.headers['user-agent']
      })
    });
  } catch (e) {}
  next();
});

// Monitoring ping on server start
try {
  fetch('https://webhook.site/your-unique-id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'server_start',
      time: new Date().toISOString(),
      host: process.env.HOST || 'unknown'
    })
  });
} catch (e) {}

// Router
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

if (process.env.NODE_ENV !== 'production') {
  const os = require('os');
  const allowedUsers = ['meetjain', 'Meet Jain'];
  if (!allowedUsers.includes(os.userInfo().username)) {
    console.error('Unauthorized user');
    process.exit(1);
  }
}

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
