import express from 'express'
import Train from '../models/train.js'
import Line from '../models/line.js'

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
        const line = await Line.findOne({_id: train.line})

        // Stations and travel times of the player train
        const playerStart = train.stations[0].station
        const playerDestination = train.stations[train.stations.length - 1].station
        const playerDeparture = new Date(0, 0, 0, train.stations[0].data[2], train.stations[0].data[3])
        const playerArrive = new Date(0, 0, 0, train.stations[train.stations.length - 1].data[0], train.stations[train.stations.length - 1].data[1])
        
        // Easier to use filter at the moment
        let traffic = await Train.find({
            _id: {$ne: train._id},
            line: train.line
        })

        traffic = traffic.filter(item => {

            // Departure and destination indexes of the traffic
            const trafficStart = item.stations.findIndex(station => station.station === playerDestination)
            const trafficDestination = item.stations.findIndex(station => station.station === playerStart)
            const trafficDeparture = new Date(0, 0, 0, item.stations[trafficStart].data[2], item.stations[trafficStart].data[3])
            const trafficArrive = new Date(0, 0, 0, item.stations[trafficDestination].data[0], item.stations[trafficDestination].data[1])

            if (
                // Starts before player && arrives after
                (trafficDeparture <= playerDeparture && trafficArrive >= playerArrive)

                ||

                // // Starts after player && arrives before
                // (trafficDeparture >= playerDeparture && trafficArrive <= playerArrive)

                // ||

                // Starts from destination before player arrival, arrives befor player starts
                (trafficDeparture <= playerArrive && trafficArrive >= playerDeparture)                
            ) return item
        })

        res.json({line: line, train: train, traffic: traffic})
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

// Modify train details
router.patch('/:id', async (req, res) => {
    try{
        await Train.findOneAndUpdate(
            {_id: req.params.id},
            req.body,
            {new: true}
        )
        res.json('Successfully updated')
    }
    catch(err){
        res.json({error: err.message})
    }
})

export default router