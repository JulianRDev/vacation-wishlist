const mongoose = require("mongoose")
const Schema = mongoose.Schema

const DestinationSchema = new Schema({
    image: String,
    name: {type: String, unique: true},
    location: String,
    description: String
})

const Destination = mongoose.model("Destination", DestinationSchema)

module.exports = {Destination}