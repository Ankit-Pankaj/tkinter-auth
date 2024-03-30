
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const TEMP_USER_PASSWORD = require('../../config/variables')
const defaultPassword = this.toString(TEMP_USER_PASSWORD)

function setPassword(value) {
    return bcrypt.hashSync(value, 10);
}

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, set: setPassword },
    paid: { type: Boolean, default: false },
    name: { type: String },
    country: { type: String },
    admin:{type:Boolean, default: false}

}, { timestamps: true });


module.exports = mongoose.model("User", UserSchema)