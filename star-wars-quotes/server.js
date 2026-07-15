require('dotenv').config()
const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const methodOverride = require('method-override')

const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))

MongoClient.connect(process.env.MONGO_URI)
  .then(client => {
    console.log('Connected to Database')

    const db = client.db('star-wars-quotesDB')
    const quotesCollection = db.collection('quotes')

    app.get('/', (req, res) => {
      quotesCollection
        .find()
        .toArray()
        .then(results => {
          res.render('index.ejs', { quotes: results })
        })
        .catch(error => console.error(error))
    })

    app.post('/quotes', (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    app.put('/quotes/:id', (req, res) => {
      quotesCollection
        .updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: { name: req.body.name, quote: req.body.quote } }
        )
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    app.delete('/quotes/:id', (req, res) => {
      quotesCollection
        .deleteOne({ _id: new ObjectId(req.params.id) })
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
  })
  .catch(error => console.error(error))
