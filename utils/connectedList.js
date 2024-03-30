let users = new Map();

module.exports= connectedList = {
    addUser: function(userId){
        let input = {userId : userId}
        users.set(userId, input);
    },

    removeUser: function(userId){
        users.delete(userId)
    },

    getUser: function(userId){
       return users.get(userId);
    }

}