import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'

// fs.readFile('./TestComponent.vue', 'utf8', function (err, data) {
//   if (err) {
//     return console.log(err)
//   }
//   console.log(data)
// })

const port = 55555

const app = express()

app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json
app.use(cors())


// app.use(function(req, res, next) {
//   if(req.path.includes('TestComponent.vue')) {
//     const data = fs.readFileSync('./TestComponent.vue', 'utf8')
//     res.set('Content-Type', 'text/plain; charset=UTF-8')
//     res.send(data)
//   } else {
//     next()
//   }
// })

// app.get('/TestComponent.vue', function(req, res, next) {
//   const data = fs.readFileSync('./TestComponent.vue', 'utf8')
//   res.set('Content-Type', 'text/plain; charset=UTF-8')
//   res.send(data)
// })


console.log(__dirname)

// app.use(express.static('.'))
app.use(express.static(__dirname, { index:'index.html' }))

app.get('/', (req, res, next) => {
  // res.set('Cache-Control', 'no-store')
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.use(express.static(__dirname))

// 加上 0.0.0.0 取得的 req.ip 就會是 ipv4 的
app.listen(port, () => {
    console.log(`listening on ${ port }`)
})