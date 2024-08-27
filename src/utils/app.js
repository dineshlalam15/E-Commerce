import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "../routers/auth.router.js"
const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: true,
    limit: "100kb"
}))
app.use(cookieParser())

app.use('/api/v1/auth', authRouter)

export default app