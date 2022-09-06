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
app.use(express.static(__dirname + '/public'))
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
                })
                .catch(error => console.error(error))
        })

        app.post('/destinations', async (req, res) => {

            
            try {
                let destImg = await fetch(`https://api.unsplash.com/search/photos/?client_id=${process.env.CLIENT_ID}&query=${req.body.name, req.body.location}&orientation=landscape&h=200`)
                let allImg = await destImg.json()

                let imgUrl
                console.log(allImg)
                let random = Math.floor(Math.random() * allImg.results.length)
                if(allImg.results.length > 0 )
                {imgUrl = allImg.results[random].urls.raw }
            

                destinationsCardsCollection.insertOne({
                    image : imgUrl,
                    name : req.body.name,
                    location : req.body.location,
                    description: req.body.description

                })
                    .then(result => {
                        res.redirect('/')
                    })
                    .catch(error => console.error(error))
                }
                catch(error){
                    console.error(error)
                }
        })

        app.put('/destinations', async (req,res) => {
            let objectId = ObjectId(req.body._id)

            try{
                let destImg = await fetch(`https://api.unsplash.com/search/photos/?client_id=${process.env.CLIENT_ID}&query=${req.body.name, req.body.location}&orientation=landscape&h=200`)
                let allImg = await destImg.json()

                let imgUrl
                console.log(allImg)
                let random = Math.floor(Math.random() * allImg.results.length)
                if(allImg.results.length > 0 )
                {imgUrl = allImg.results[random].urls.raw }

            destinationsCardsCollection.findOneAndUpdate({_id: objectId},
                {
                    $set:{
                        name: req.body.name,
                        location: req.body.location,
                        description: req.body.description,
                        image: imgUrl
                    }
                },{
                    upsert: true
                }
                )
                .then(result => 
                    res.json('Successfully updated'))
                .catch(error => console.error(error))
            }
            catch(error){
                console.error(error)
            }
        })

        app.delete('/destinations', (req,res) => {
            let objectId = new ObjectId(req.body._id)
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