const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

router.route('/seats').get((req, res) => {
    res.json(db.seats);
});

router.route('/seats/random').get((req, res) => {
    const randomIndex = Math.floor(Math.random() * db.seats.length);
    const randomSeat = db.seats[randomIndex];
    res.json(randomSeat);
});

router.route('/seats/:id').get((req, res) => {
    const seat = db.seats.find(entry => entry.id === parseInt(req.params.id));
    if (seat) {
        res.json(seat);
    } else {
        res.status(404).json({ message: 'Seat not found' });
    }
});

router.route('/seats').post((req, res) => {
    const { day, seat, client, email} = req.body;
    if (!day || !seat || !client || !email) {
        res.status(400).json({ message: 'All fields are required' });
    } else {
        const parsedDay = parseInt(day);
        const parsedSeat = parseInt(seat);

        const isTaken = db.seats.some(item => item.day === parsedDay && item.seat === parsedSeat);
        if (isTaken) {
            return res.status(409).json({ message: 'The slot is already taken...' });
        }
        
        const newSeat = {
            id: uuidv4(),
            day: parsedDay,
            seat:parsedSeat,
            client,
            email,
        };
        db.seats.push(newSeat);
        res.json({ message: 'OK' });
    }
});

router.route('/seats/:id').put((req, res) => {
    const { day, seat, client, email} = req.body;
    const st = db.seats.find(entry => entry.id === parseInt(req.params.id));
    if (!st) {
        res.status(404).json({ message: 'Seat not found' });
    } else {
        if (day) st.day = day;
        if (seat) st.seat = seat;
        if (client) st.client = client;
        if (email) st.email = email;
        res.json({ message: 'OK' });
    }
});

router.route('/seats/:id').delete((req, res) => {
    const index = db.seats.findIndex(entry => entry.id === parseInt(req.params.id));
    if (index === -1) {
        res.status(404).json({ message: 'Seat not found' });
    } else {
        db.seats.splice(index, 1);
        res.json({ message: 'OK' });
    }
});

module.exports = router;