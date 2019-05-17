const Event = require('../models/event');

exports.index = async (req, res) => {
    res.locals.title = 'Events';
    res.render('events/index');
};

exports.show = async (req, res) => {
    const id = req.params.id;
    const e = await Event.findOne({_id: id});
    if (!e) {
        return res.status(404).send('Not found');
    }
    res.locals.e = e;
    res.locals.title = e.title;
    res.render('events/show');
};

exports.new = async (req, res) => {
    res.locals.title = 'New Event';
    res.render('events/new');
};

exports.createNew = async (req, res) => {
    await new Event(req.body).save();
    res.send('Nice!');
};

exports.getAllEvents = async (req, res) => {
    console.log('Querying get_all_events');

    let events = await Event.find().sort({date: -1});
    res.setHeader('Content-Type', 'application/json');
    console.log(JSON.stringify(events));
    res.send(JSON.stringify(events));
};
