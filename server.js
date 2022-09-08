console.log('May you forever vacation')

const express = require('express')
const bodyParser = require('body-parser')

const {Destination} = require("./models/destinations")

const app = express()
const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId
const fetch = require('node-fetch')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 8000

const url = process.env.MONGODB_URL

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(__dirname + '/public'))
app.use(cors({
 origin:'*'
}));
mongoose.connect(url, {useNewUrlParser: true})

const db = mongoose.connection

db.once('open', _ => {
    console.log('Database connected: congragulations')
    app.listen(port, () => {
        console.log('listening on 8000')   
         })
  })
  
  db.on('error', err => {
    console.error('connection error:', err)
  })

  app.get("/", async(req,res) => {
    const allDestinations = await Destination.find();
    res.render('index.ejs', { destinations: allDestinations })
    
  })

  app.post("/destinations", async (req,res) => {

    let destImg = await fetch(`https://api.unsplash.com/search/photos/?client_id=${process.env.CLIENT_ID}&query=${req.body.name, req.body.location}&orientation=landscape&h=200`)
    let allImg = await destImg.json()
    
    let imgUrl
    console.log(allImg)
    let random = Math.floor(Math.random() * allImg.results.length)
    if(allImg.results.length > 0 )
    {imgUrl = allImg.results[random].urls.raw }
    

    const newDestination = new Destination({
        image : imgUrl,
        name : req.body.name,
        location : req.body.location,
        description: req.body.description})

     await newDestination.save()


    res.redirect("/")
  })

  app.put("/destinations", async (req,res) => {
    let objectId = ObjectId(req.body._id)

    let destImg = await fetch(`https://api.unsplash.com/search/photos/?client_id=${process.env.CLIENT_ID}&query=${req.body.name, req.body.location}&orientation=landscape&h=200`)
    let allImg = await destImg.json()
    
    let imgUrl
    console.log(allImg)
    let random = Math.floor(Math.random() * allImg.results.length)
    if(allImg.results.length > 0 )
    {imgUrl = allImg.results[random].urls.raw }
    else{
        imgUrl = "img/vaca.jpeg"
    }
    

    await Destination.findOneAndUpdate({_id: objectId},{
        name: req.body.name,
        location: req.body.location,
        description: req.body.description,
        image: imgUrl
    })
    res.json("Success")
  })

  app.delete("/destinations", async (req,res) => {
    let objectId = new ObjectId(req.body._id)
        
    await Destination.deleteOne(
            {_id: objectId}
        )

    res.json("card deleted")
  })
