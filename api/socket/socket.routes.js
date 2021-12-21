
module.exports = connectSockets


function connectSockets(io) {
    io.on('connection', socket => { /// user connected

        socket.on('chat station', stationId => {
            if (socket.station) {
                socket.leave(socket.station);
            }
            socket.join(stationId);
            socket.station = stationId;           
        });
        socket.on('chat msg', msg => {
            io.to(socket.station).emit('chat newMsg', msg);
        });
        socket.on('chat is-typing', (from) => {
            socket.to(socket.station).broadcast.emit('chat typing', from);
        });
        socket.on('chat stop-typing', () => {  
            socket.to(socket.station).broadcast.emit('chat one-stoped-typing');
        });
    })
}