import config from './app/config'
import cors from 'cors'
import app from '../src/app'
import mongoose from 'mongoose'
import express from 'express'

import { Server } from 'http'
let server : Server;

// Middleware
app.use(express.json())
app.use(cors())

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.database_url as string)
    console.log('Database connected successfully')

    // Start the Express server
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`)
    })
  } catch (error) {
    console.error(
      'Error connecting to the database or starting the server:',
      error,
    )
  }
}

// Start the application
main()

process.on('unhandledRejection', () => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});