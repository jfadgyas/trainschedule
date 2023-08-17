import Mongoose from "mongoose";

const lineSchema = Mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    line: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    stations: [String]
})

export default Mongoose.model('Line', lineSchema)