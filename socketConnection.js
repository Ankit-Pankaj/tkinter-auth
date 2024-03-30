// const server = require('./index').server
const variables = require('./config/variables')
const newSocket = require('./newSocket')
module.exports = function(server){
    const io = require('socket.io')(server,{cors:{origin:variables.CLIENT_SERVER}});

    const rooms = [];
    const waitingRoom = new Map();
    const connectedUsers = new Map();
    newSocket(io);
    io.on('connection', (socket)=>{
        console.log('socket connected')
        waitingRoom.set(socket.id, socket.id); // user added to waiting room
        socket.join(socket.id); // join a room with its socket_id itself
        console.log('waiting room are', waitingRoom);
    
        // join a room 

        socket.on('joinRoom', ()=>{
            let room_id= socket.id
            if(waitingRoom.size <=1){
                io.in(room_id).emit('failure', 'No user available');
                return;
            }
            else{
                for(let [key, partner_id] of waitingRoom){
                    // console.log(waitingRoom);
                    let user_id = socket.id;
                    if(partner_id != user_id){
                        io
                            .of('/')
                            .in(user_id)
                            .in(partner_id)
                            .emit('room_detail',   {
                                'user_id':socket.id,
                                'partner_id': partner_id,
                                'room_id':user_id
                            })
                        io
                            .in(partner_id)
                            .emit('room_detail',   {
                                'user_id':partner_id,
                                'partner_id': user_id,
                                'room_id':user_id
                            })
                        io.in(user_id).in(partner_id).emit('success', "succesfully connected");
                        waitingRoom.delete(user_id);
                        waitingRoom.delete(partner_id);
                        connectedUsers.set(room_id, {'user_id':user_id, 'partner_id':partner_id});
                        console.log('connectedUsers are' , connectedUsers);
                        console.log('waitingRoom are' , waitingRoom);
                        return;
                    }
                }
                io.emit('failure', 'some error occured');
                return;
            }
        })
    
        // leaving a room
        socket.on('leave', (res)=>{
            // console.log('user has left the room');
            console.log(waitingRoom);
            let room_id = socket.rooms;
            connectedUsers.delete(room_id);
            waitingRoom.set(res.user_id, res.user_id);
            waitingRoom.set(res.partner_id, res.partner_id);
            // console.log(waitingRoom);
            console.log(res.user_id, res.partner_id);
            io.to(res.user_id).to(res.partner_id).emit('update_isConnected');
        })
    
        // on disconnect
        socket.on('disconnecting', ()=>{
            
            let room_id = socket.rooms;
            let user_id = socket.id;
            // console.log(room_id);
            if(waitingRoom.has(user_id)){waitingRoom.delete(user_id);}
            else if(connectedUsers.has(room_id)){
                connectedUsers.delete(room_id);
            }
            // console.log('connectedUsers are' , connectedUsers);
            console.log('waitingRoom are ' , waitingRoom);
        })
    
        socket.on('sendMessage',(data)=>{
            io.in(data.receiver).emit('receiveMessage', {'msg': data.msg})
        })
    })

    return io;

}


