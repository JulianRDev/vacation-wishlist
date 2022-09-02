console.log('May you forever vacation')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const fetch = require('node-fetch')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 8000


const url = process.env.MONGODB_URL

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(cors({
 origin:'*'
}));

MongoClient.connect(url, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('destinations-cards')
        const destinationsCardsCollection = db.collection('destinations')

        app.set('view engine', 'ejs')

        app.get('/', (req, res) => {

            db.collection('destinations').find().toArray()
                .then(results => {
                    res.render('index.ejs', { destinations: results })
                    console.log(results)
                })
                .catch(error => console.error(error))
        })

        app.post('/destinations', async (req, res) => {
            console.log(req.body)

            let name = req.body.name
            let location = req.body.location
            let image
            try {
                let destImg = await fetch(`https://api.unsplash.com/search/photos/?client_id=${process.env.CLIENT_ID}&query=${name, location}&orientation=landscape&h=200`)
                image = await destImg.json()
            }
            catch {
                image = "img/vaca.jpeg"
            } finally {
                let random = Math.floor(Math.random() * image.results.length)
                req.body.image = image.results[random].urls.raw

                destinationsCardsCollection.insertOne(req.body)
                    .then(result => {
                        res.redirect('/')
                        console.log(result)
                    })
                    .catch(error => console.error(error))
                console.log(req.body)
            }
        })

        app.put('/destinations', async (req,res) => {
            let objectId = ObjectId(req.body._id)
            let name = req.body.name
            let location = req.body.location
            let image

            try{
                let destImg = await fetch(`https://api.unsplash.com/search/photos/?client_id=${process.env.CLIENT_ID}&query=${name, location}&orientation=landscape&h=200`)
                image = await destImg.json()
            }catch{
                image = "img/vaca.jpeg"
            }finally{

                let random = Math.floor(Math.random() * image.results.length)
                req.body.image = image.results[random].urls.raw

            destinationsCardsCollection.findOneAndUpdate({_id: objectId},
                {
                    $set:{
                        name: req.body.name,
                        location: req.body.location,
                        description: req.body.description,
                        image: req.body.image
                    }
                },{
                    upsert: true
                }
                )
                .then(result => 
                    res.json('Successfully updated'))
                .catch(error => console.error(error))
            }
        })

        app.delete('/destinations', (req,res) => {
            console.log(req.body)
            let objectId = new ObjectId(req.body._id)
            console.log(objectId)
            destinationsCardsCollection.deleteOne(
                {_id: objectId}
            )
            .then(result => {
                res.json('Card Deleted')
            })
            .catch(error => console.error(error))
        })

        app.listen(port, () => {
            console.log('listening on 8000')
        })
    })
    .catch(error => console.error(error))