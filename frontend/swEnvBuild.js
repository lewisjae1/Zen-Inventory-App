import { writeFileSync } from 'fs'
import { config } from 'dotenv'

// This dotenv is the one used inside React.
// Load dotenv Intentionally because build process does not have access to .env file yet.
config()

const {
    VITE_API_KEY,
    VITE_AUTH_DOMAIN,
    VITE_PROJECT_ID,
    VITE_STORAGE_BUCKET,
    VITE_MESSAGING_SENDER_ID,
    VITE_APP_ID,
    VITE_MEASUREMENT_ID,
} = process.env

// const VITE_API_KEY = import.meta.env.VITE_API_KEY
// const VITE_AUTH_DOMAIN = import.meta.env.VITE_AUTH_DOMAIN
// const VITE_PROJECT_ID = import.meta.env.VITE_PROJECT_ID
// const VITE_STORAGE_BUCKET = import.meta.env.VITE_STORAGE_BUCKET
// const VITE_MESSAGING_SENDER_ID = import.meta.env.VITE_MESSAGING_SENDER_ID
// const VITE_APP_ID = import.meta.env.VITE_APP_ID
// const VITE_MEASUREMENT_ID = import.meta.env.VITE_MEASUREMENT_ID

const content = `const swEnv = {
    VITE_API_KEY: '${VITE_API_KEY}',
    VITE_AUTH_DOMAIN: '${VITE_AUTH_DOMAIN}',
    VITE_PROJECT_ID: '${VITE_PROJECT_ID}',
    VITE_STORAGE_BUCKET: '${VITE_STORAGE_BUCKET}',
    VITE_MESSAGING_SENDER_ID: '${VITE_MESSAGING_SENDER_ID}',
    VITE_APP_ID: '${VITE_APP_ID}',
    VITE_MEASUREMENT_ID: '${VITE_MEASUREMENT_ID}'
 }`

writeFileSync("./public/swEnv.js", content)