require('dotenv').config()
const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const methodOverride = require('method-override')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')

const app = express()

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

let quotesCollection

MongoClient.connect(process.env.MONGO_URI)
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotesDB')
    quotesCollection = db.collection('quotes')

    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`)
    })
  })
  .catch(error => console.error(error))

app.get('/', (req, res) => {
  quotesCollection
    .find()
    .toArray()
    .then(results => {
      res.render('index.ejs', { quotes: results })
    })
    .catch(error => console.error(error))
})

app.get('/api/quotes', (req, res) => {
  quotesCollection
    .find()
    .toArray()
    .then(results => {
      res.json(results)
    })
    .catch(error => res.status(500).json({ error: error.message }))
})

app.post('/quotes', (req, res) => {
  quotesCollection
    .insertOne(req.body)
    .then(() => {
      if (req.is('application/json')) {
        res.status(201).json({ message: 'Quote created' })
      } else {
        res.redirect('/')
      }
    })
    .catch(error => res.status(500).json({ error: error.message }))
})

app.put('/quotes/:id', (req, res) => {
  quotesCollection
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name: req.body.name, quote: req.body.quote } }
    )
    .then(() => {
      if (req.is('application/json')) {
        res.status(200).json({ message: 'Quote updated' })
      } else {
        res.redirect('/')
      }
    })
    .catch(error => res.status(500).json({ error: error.message }))
})

app.delete('/quotes/:id', (req, res) => {
  quotesCollection
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then(() => {
      if (req.is('application/json')) {
        res.status(200).json({ message: 'Quote deleted' })
      } else {
        res.redirect('/')
      }
    })
    .catch(error => res.status(500).json({ error: error.message }))
})
