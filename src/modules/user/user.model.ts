import bcrypt from 'bcrypt'
import { TUser } from './user.interface'
import { required } from 'joi'

import { model, Schema } from 'mongoose'
import config from '../../app/config'

const userShema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['stusent', 'faculty', 'admin'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// pre save middeleware/hook

userShema.pre('save', async function (next) {
  console.log(this, 'pre hook : we will save data')
  const user = this
  //  hasing to the db

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrpt_salt_rounds),
  )

  next()
})

userShema.post('save', function (doc, next) {
  doc.password = ''
  console.log(this, 'hash password')

  next()
})

export const User = model<TUser>('User', userShema)
