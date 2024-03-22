const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors')
const port = 5000;

const ConnectDB = require('./src/db/ConnectDB');
const User = require('./src/model/userModel')

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Update your code to wait for the database connection before setting up the endpoints and starting the server:
ConnectDB().then(() => {

    app.get('/users', async (req, res) => {
        const result = await User.find();
        res.send(result)
    })
    app.get('/users/:email', async (req, res) => {
        const userEmail = req.query.email;
        res.send('something')
    })
    app.post('/user', async (req, res) => {
        console.log(req.body); // This will log the body of the POST request
        const userInfo = req.body;

        //check if user already exist in db
        const isExist = await User.findOne({ email: userInfo.email })

        if (isExist) {
            return res.status(400).json({ message: 'User already exists!' })
        }
        const createUserData = await User.create(userInfo);

        res.json({ message: 'data created' });
    });
    app.patch('/upuser', async (req, res) => {
        const updatedData = req.body;
        const findoneUpdate = await User.findOneAndUpdate(
            { email: updatedData.email },
            { username: updatedData.name, photo: updatedData.photo },
            { new: true }
        )
        if (!findoneUpdate) {
            res.json({ message: 'something went worong' })
        }
        res.send('updated')
    })

    app.delete('/users/:email', async (req, res) => {

        const { email } = req.params;

        const findAdmin = await User.findOne({email});
        // Check if user is an admin
        if (findAdmin.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin user' });
        }

        const deleteUser = await User.findOneAndDelete((email));
        if (!deleteUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    })
    app.get('/', (req, res) => {
        res.send('Server is running...');
    });

    app.listen(port, () => {
        console.log('Server is running on ', port);
    });
}).catch((error) => {
    console.error('Failed to connect to the database:', error);
});
