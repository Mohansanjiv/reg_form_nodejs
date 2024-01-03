const mongoose = require('mongoose');
const jwt =require('jsonwebtoken');
const bcrypt = require('bcrypt');

const visitorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    repassword: {
        type: String,
        required: true,
    }
    
});


visitorSchema.pre('save', async function(next){
    if (this.isModified('password')) {
        
        this.password = await bcrypt.hash(this.password, 10);
        
        // Ensure repassword is set to a valid value
        this.repassword = ''; 
    }
    next();
});


// Now we need to create a collection
const Register = mongoose.model('Register', visitorSchema);
module.exports = Register;
