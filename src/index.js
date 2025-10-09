import dotenv from 'dotenv'
import connectDB from './db/index.js'
import { app } from './app.js'

dotenv.config({ path: './.env' })

const Port = process.env.PORT || 8000

connectDB()
    .then(() => {
        app.listen(Port, () => {
            console.log(`✅ Server is running on http://localhost:${Port}`);
        });
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed!!!", error.message);
    });