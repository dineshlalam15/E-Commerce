import express from "express";

const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: true,
    limit: "100kb"
}))

export default app