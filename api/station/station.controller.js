const stationService = require('./station.service')

async function getById(req, res) {
    const station = await stationService.getById(req.params.id)
    res.json(station)
}
  
async function query(req, res) {  
    const filterBy = req.query; 
    const stations = await stationService.query(filterBy)
    res.json(stations)
}

async function remove(req, res) {
    await stationService.remove(req.params.id)
    res.end()
}


async function update(req, res) {
    const station = req.body;
    await stationService.update(station)
    res.json(station)
}


async function add(req, res) {
    const station = req.body;
    station.createdAt = Date.now();
    const user = req.session.user;
    if (user) {
        station.owner = {_id: user._id, fullName: user.fullName, avatar: user.avatar}
    }
    const savedStation = await stationService.add(station);
    res.json(savedStation);
}



module.exports = {
    getById,
    query,
    remove,
    update,
    add,
}