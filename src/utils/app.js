import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "../routers/auth.router.js"
import userRouter from "../routers/user.router.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: true,
    limit: "100kb"
}))
app.use(cookieParser())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)

export default app