import express from 'express'
import cors from 'cors'
import path from 'path'

const port = 55555

const app = express()

app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json
app.use(cors())

// app.use(express.static('.'))
app.use(express.static(__dirname, { index:'index.html' }))

// 加上 0.0.0.0 取得的 req.ip 就會是 ipv4 的
app.listen(port, () => {
    console.log(`listening on ${ port }`)
})