// Requirements
import express, {urlencoded, json} from 'express'
import ServerlessHttp from 'serverless-http'
import cors from 'cors'
import 'dotenv/config'
import Mongoose from 'mongoose'

// Import routes
import lineRoute from './routes/line.js'
import trainRoute from './routes/train.js'

// Variables
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Routes
app.use('/line', lineRoute)
app.use('/train', trainRoute)

// Connect to DB
try {
    await Mongoose.connect(process.env.URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    console.log('Connected to database')
}
catch(err){
    console.log(err)
}

// Start app
app.listen(port, () => console.log(`Listening on ${port}`))
export const handler = ServerlessHttp(app)