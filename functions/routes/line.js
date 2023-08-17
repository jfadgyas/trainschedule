import express from 'express'
import Line from '../models/line.js'
import Train from '../models/train.js'

const router = express.Router()

// Get all lines
router.get('/', async (req, res) => {
    try{
        const lines = await Line.find()
        res.json(lines)
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
})

// Get all trains (for 1 line)
router.get('/:id', async (req, res) => {
    try{
        const trains = await Train.find({line: req.params.id})
        res.json(trains)
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
})

// Post new line
router.post('/', async (req, res) => {
    try{
        const newLine = new Line(req.body)
        await newLine.save()
        res.json({success: 'Successfully saved line'})
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
})

export default router