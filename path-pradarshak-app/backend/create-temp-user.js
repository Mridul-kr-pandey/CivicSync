const mongoose = require('mongoose');
const User = require('./models/User');

const uri = 'mongodb://localhost:27017/accountability_partner';

async function createTempUser() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const email = 'temp@civicsync.com';
        const password = 'tempUser123!';

        // Delete if exists
        await User.deleteOne({ email });

        const user = new User({
            name: 'Temporary User',
            email: email,
            password: password,
            role: 'citizen',
            isVerified: true
        });

        await user.save();
        console.log('User created successfully');
        console.log('Email:', email);
        console.log('Password:', password);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

createTempUser();
