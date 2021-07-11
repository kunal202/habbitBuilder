const { Habbits } = require("../models/data")

async function createHabbit(req, res) {

    const habbitData = {
        username: req.session.user.username,
        name: req.body.name,
        description: req.body.desc,
        status: req.body.status,
        timing: req.body.status,
        frequency: req.body.freq,
        timing: req.body.time
    }
    const habbit = await Habbits.create(habbitData)
    res.redirect('/');
}

async function getHabbit(req, res) {
    res.render('habbit', {
        title: 'Signup page',
    });
}

async function createdHabbits(req, res) {
    const habbit = await Habbits.findAll(
        {
            where: {
                username: req.session.user.username
            }
        })
    res.render('createdhabbit', {
        habbit: habbit,
    });
}


module.exports = {
    createHabbit,
    getHabbit,
    createdHabbits
}