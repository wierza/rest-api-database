const Testimonial = require('../models/testimonials.model');
const sanitize = require('mongo-sanitize');

exports.getAll = async (req, res) => {
    try {
        res.json(await Testimonial.find());
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
};

exports.getRandom = async (req, res) => {
    try {
        const count = await Testimonial.countDocuments();
        const rand = Math.floor(Math.random() * count);
        const tstm = await Testimonial.findOne().skip(rand);
        if (!tstm) res.status(404).json({ message: 'Not found' });
        else res.json(tstm);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
};

exports.getById = async (req, res) => {
    try {
        const tstm = await Testimonial.findById(req.params.id);
        if (!tstm) res.status(404).json({ message: 'Not found' });
        else res.json(tstm);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
};

exports.addTestimonial = async (req, res) => {
    try {
        const author = sanitize(req.body.author);
        const text = sanitize(req.body.text);
        
        const newTestimonial = new Testimonial({ author: author, text: text });
        await newTestimonial.save();
        res.json({ message: 'OK' });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

exports.putTestimonial = async (req, res) => {
    const { author, text } = req.body;
    try {
        const tstm = await Testimonial.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { author: author, text: text } },
            { new: true }
        );
        if (!tstm) {
            return res.status(404).json({ message: 'Not found...' });
        }
        res.json(tstm);
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

exports.deleteTestimonial = async (req, res) => {
    try {
        const tstm = await Testimonial.findById(req.params.id);
        if (!tstm) {
            return res.status(404).json({ message: 'Not found...' });
        }
        const deletedTstm = await Testimonial.findOneAndDelete({ _id: req.params.id });
        res.json(deletedTstm);
    } catch (err) {
        res.status(500).json({ message: err });
    }
};