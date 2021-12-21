
const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add,
}

async function query(filterBy = {}) {
    const critirea = _buildCriteria(filterBy);  
    const collection = await dbService.getCollection('station');
    try {
        const stations = await collection.find(critirea.query).sort(critirea.sortBy).toArray();
        return stations;
    } catch (err) {
        console.log('ERROR: cannot find Stations')
        throw err;
    }
}

async function getById(stationId) {
    const collection = await dbService.getCollection('station')
    try {
        const station = await collection.findOne({ "_id": ObjectId(stationId) })
        return station;
    } catch (err) {
        console.log(`ERROR: while finding station ${stationId}`)
        throw err;
    }
}


async function remove(stationId) {
    const collection = await dbService.getCollection('station')
    try {
        await collection.deleteOne({ "_id": ObjectId(stationId) })
    } catch (err) {
        console.log(`ERROR: cannot remove station ${stationId}`)
        throw err;
    }
}

async function update(station) {
    const collection = await dbService.getCollection('station')
    station._id = ObjectId(station._id);
    
    try {
        await collection.replaceOne({ "_id": station._id }, { $set: station })
        console.log('test station rate:',station.rate)
        return station;
    } catch (err) {
        console.log(`ERROR: cannot update station ${station._id}`)
        throw err;
    }
}

async function add(station) {
    const collection = await dbService.getCollection('station');
    try {
        await collection.insertOne(station);  
        return station;
    } catch (err) {
        console.log(`ERROR: cannot insert station`)
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const critirea = {
        query: {},
        sortBy: {}
    };
    if (filterBy.txt) {
        if (filterBy.searchIn === 'genres') critirea.query.labels = { $in: [filterBy.txt] };
        else critirea.query.title = { $regex: filterBy.txt, $options: 'i' };
    } 
   
    if (filterBy.sortBy === 'date') critirea.sortBy.createdAt = -1; 
    else critirea.sortBy.title = 1;
    
    return critirea;
}