const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

const port = 3000
const databasePath = path.join(__dirname, 'src', 'database', 'db.json')

app.get('/contacts', (req, res) => {
  fs.readFile(databasePath, (err, data) => {
    if (err) throw err
    res.send(JSON.parse(data))
  })
})

app.post('/contacts', (req, res) => {
  const { name, phone } = req.query
  if (!name || !phone) return res.status(422).send('Unprocessable Entity.')

  const contacts = JSON.parse(
    fs.readFileSync(databasePath, err => {
      if (err) throw err
    })
  )

  const length = contacts.length
  const id = (length ? contacts[length - 1].id : 0) + 1

  contacts.push({ id, name, phone })
  fs.writeFile(databasePath, JSON.stringify(contacts, null, 2), err => {
    if (err) throw err
    res.status(201).send('Create contact!')
  })
})

app.put('/contacts/:id', (req, res) => {
  const { id } = req.params
  const { name, phone } = req.query

  if (!name && !phone) return res.status(422).send('Unprocessable Entity.')

  const contacts = JSON.parse(
    fs.readFileSync(databasePath, err => {
      if (err) throw err
    })
  )

  let foundContact = false
  const updatedContacts = contacts.map(item => {
    if (item.id === parseInt(id)) {
      foundContact = true
      item.name = name || item.name
      item.phone = phone || item.phone
    }
    return item
  })

  if (!foundContact) return res.status(404).send('Contact not found!')

  fs.writeFile(databasePath, JSON.stringify(updatedContacts, null, 2), err => {
    if (err) throw err
    res.status(200).send('Update Contact!')
  })
})

app.delete('/contacts/:id', (req, res) => {
  const { id } = req.params

  const contacts = JSON.parse(
    fs.readFileSync(databasePath, err => {
      if (err) throw err
    })
  )

  const length = contacts.length
  const contactsFiltered = contacts.filter(item => item.id !== parseInt(id))
  if (contactsFiltered.length !== length) {
    fs.writeFile(
      databasePath,
      JSON.stringify(contactsFiltered, null, 2),
      err => {
        if (err) throw err
        res.status(200).send('Delete contact!')
      }
    )
  } else {
    res.status(404).send('Contact not found!')
  }
})

app.listen(port, () => {
  console.log('Start server!')
})
