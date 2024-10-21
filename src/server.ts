import config from './app/config'
import cors from 'cors'
import app from '../src/app'

import express from 'express'

const mongoose = require('mongoose')
// parser

app.use(express.json())
app.use(cors())
main().catch((err) => console.log(err))

async function main() {
  try {
    await mongoose.connect(config.database_url as string)

    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

main()
