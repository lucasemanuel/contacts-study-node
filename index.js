const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

const port = 3000
const databasePath = path.join(__dirname, 'src', 'database', 'db.json')

app.get('/contacts', (req, res) => {
  const contacts = JSON.parse(
    fs.readFileSync(databasePath, (err, data) => {
      if (err) throw err
    })
  )

  res.send(contacts)
})

app.post('/contacts', (req, res) => {})

app.put('/contacts/:id', (req, res) => {})

app.delete('/contacts/:id', (req, res) => {})

app.listen(port, () => {
  console.log('Start server!')
})
