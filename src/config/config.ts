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
    },
    r2: {
        bucket: process.env.R2_BUCKET,
        endpoint: process.env.R2_ENDPOINT,
        accessKey: process.env.R2_ACCESS_KEY,
        secretKey: process.env.R2_SECRET_KEY,
        publicUrl: process.env.R2_PUBLIC_URL,
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
    }
}