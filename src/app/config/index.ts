import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join((process.cwd(), '.env')) })

export default {
  port: process.env.PORT,
  NODE_ENV :process.env.NODE_ENV,
  database_url: process.env.DB_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASSS,
  super_admin_pass:process.env.SUPER_ADMIN_PASS,
  jwt_access_secret:process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in :process.env.JWT_ACCESS_EXPIRED_IN ,
  jwt_refresh_expires_in:process.env.JWT_REFRESH_EXPIRED_IN,
  jwt_refresh_secret:process.env.JWT_REFRESH_SECRET,
  reset_pass_ui_link :process.env.RESET_PASS_UI_LINK,
  email_user:process.env.EMAIL_USER,
  email_pass:process.env.EMAIL_PASS

}







