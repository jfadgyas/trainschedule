import express from 'express'
import Train from '../models/train.js'

const router = express.Router()

// Get 1 train (and traffic around this)
router.get('/:id', async (req, res) => {
    try{
        const train = await Train.findOne({_id: req.params.id})
        res.json(train)
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