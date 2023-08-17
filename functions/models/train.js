import Mongoose from "mongoose";

const stationSchema = Mongoose.Schema({
    station: {
        type: String,
        required: true
    },
    data: []    
})

const trainSchema = Mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    wagons: [],
    line: {
        type: String,
        required: true
    },
    stations: [stationSchema]
})

export default Mongoose.model('Train', trainSchema)