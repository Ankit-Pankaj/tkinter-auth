let users = new Map();

module.exports= waitingList = {
    addUser: function(userId){
        let input = {
            userId:userId
        }
        console.log('adding user from waitingList', userId)
        users.set(userId, input);
    },

    removeUser: function(userId){
        console.log('removing user from waitingList', userId)
        users.delete(userId);
    },

    getUser: function(userId){
        let userDetails = users.get(userId);
        return userDetails;
    },

    isEmpty: function(){
        if(users.size ===0){return true;}
        return false;
    },
    getRandomUser: function(){
        // return first element
        let user= users.entries().next().value;
        // console.log("aaaaaaaaaaaaaaaaaaaaaa",user[1]);
        return user[1];
    },
    getUsers(){
        return users;
    }

}