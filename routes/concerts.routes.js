const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

router.route('/concerts').get((req, res) => {
    res.json(db.concerts);
});

router.route('/concerts/random').get((req, res) => {
    const randomIndex = Math.floor(Math.random() * db.concerts.length);
    const randomConcert = db.concerts[randomIndex];
    res.json(randomConcert);
});

router.route('/concerts/:id').get((req, res) => {
    const concert = db.concerts.find(entry => entry.id === parseInt(req.params.id));
    if (concert) {
        res.json(concert);
    } else {
        res.status(404).json({ message: 'Concert not found' });
    }
});

router.route('/concerts').post((req, res) => {
    const { performer, genre, price, day, image } = req.body;
    if (!performer || !genre || !price || !day || !image) {
        res.status(400).json({ message: 'All fields are required' });
    } else {
        const newConcert = {
            id: uuidv4(),
            performer,
            genre,
            price,
            day,
            image,
        };
        db.concerts.push(newConcert);
        res.json({ message: 'OK' });
    }
});

router.route('/concerts/:id').put((req, res) => {
    const { performer, genre, price, day, image } = req.body;
    const concert = db.concerts.find(entry => entry.id === parseInt(req.params.id));
    if (!concert) {
        res.status(404).json({ message: 'Concert not found' });
    } else {
        if (performer) concert.performer = performer;
        if (genre) concert.genre = genre;
        if (price) concert.price = price;
        if (day) concert.day = day;
        if (image) concert.image = image;
        res.json({ message: 'OK' });
    }
});

router.route('/concerts/:id').delete((req, res) => {
    const index = db.concerts.findIndex(entry => entry.id === parseInt(req.params.id));
    if (index === -1) {
        res.status(404).json({ message: 'Concert not found' });
    } else {
        db.concerts.splice(index, 1);
        res.json({ message: 'OK' });
    }
});

module.exports = router;