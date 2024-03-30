
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const TEMP_USER_PASSWORD = require('../../config/variables')
const bcrypt = require('bcrypt')

function setPassword(value) {
    console.log('444444444444444444', TEMP_USER_PASSWORD)
    return bcrypt.hashSync(value, 10);
}

const defaultPassword = this.toString(TEMP_USER_PASSWORD)

const UserSchema = new Schema({
    username: String,
    gender: String,
    temp: {type:Boolean, default:true},
    interests:Array,
    emailId:String,
    password: { type: String, default:defaultPassword, require:true, set: setPassword }
}, {timestamps:true});

UserSchema.index({createdAt:1}, {expireAfterSeconds:86400});

UserSchema.post('save', async (user)=>{
    try{
        if(user.temp){
            email=`${user._id}@email.com`
            await user.model('User').findOneAndUpdate({_id:user._id}, {emailId:email})
        }
    }
    catch(err){
        console.log(err)
    }

})

module.exports= mongoose.model("User", UserSchema)