import 'dotenv/config'

export const config = {
    port: process.env.PORT,
    jwt: {
        secret: process.env.JWT_SECRET_KEY,
        expiration: process.env.JWT_EXPIRATION
    },
    db: {
        url: process.env.DATABASE_URL,
    },
    swagger: {
        username: process.env.SWAGGER_USERNAME,
        password: process.env.SWAGGER_PASSWORD,
    }
}