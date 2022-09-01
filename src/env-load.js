require('dotenv').config()

module.exports  = {
    PORT: process.env.PORT,
    DATABASE: process.env.DATABASE,
    JWT_SECRET: process.env.JWT_SECRET,
    SECURE_COOKIE: process.env.JWT_SECURE_COOKIE,
}