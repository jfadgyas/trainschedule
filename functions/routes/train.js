import express from 'express'
import Train from '../models/train.js'

const router = express.Router()

// Get all trains
router.get('/', async (req, res) => {
    const trains = await Train.find()
    res.json(trains)
})

// Get trains for 1 line
router.get('/line/:line', async (req,res) => {
    const trains = await Train.find({
        line: req.params.line
    })
    res.json(trains)
})

// Get 1 train (and traffic around this)
router.get('/:id', async (req, res) => {
    try{
        const train = await Train.findOne({_id: req.params.id})
        
        const destinationIndex = train.stations.length - 1
        
        // Easier to use filter at the moment
        let traffic = await Train.find({
            _id: {$ne: train._id},
            line: train.line
        })
        traffic = traffic.filter(item => 

            // Starts before player && arrives after
            (
                (+item.stations[0].data[2] <= +train.stations[0].data[2] &&
                +item.stations[0].data[3] <= +train.stations[0].data[3])
                &&
                (+item.stations[destinationIndex].data[0] >= +train.stations[destinationIndex].data[0] &&
                +item.stations[destinationIndex].data[1] >= +train.stations[destinationIndex].data[1])
            )
            
            ||

            // // Starts after player && arrives before
            // ((+item.stations[0].data[2] >= +train.stations[0].data[2] &&
            // +item.stations[0].data[3] >= +train.stations[0].data[3]) &&
            // (+item.stations[destinationIndex].data[2] <= +train.stations[destinationIndex].data[2] &&
            // +item.stations[destinationIndex].data[3] <= +train.stations[destinationIndex].data[3]))
             
            // ||

            // // Starts from destination before player arrival
            (+item.stations[destinationIndex].data[2] <= train.stations[destinationIndex].data[0] &&
            +item.stations[destinationIndex].data[3] <= train.stations[destinationIndex].data[1])
        )

        res.json({train: train, traffic: traffic})
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
})

// Post new train
router.post('/', async (req, res) => {
    try{
        const newTrain = new Train(req.body)
        await newTrain.save()
        res.json({success: 'New train saved'})
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
})

export default router