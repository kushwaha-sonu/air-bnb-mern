
// Import dependencies
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');

// Import models
const Place = require('./modals/Place');
const User = require('./modals/User');
const Booking = require('./modals/Booking');

// Import image downloader
const imageDownloader = require('image-downloader');

// Import JSON Web Token and bcrypt
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
require('dotenv').config();
const mongoose = require('mongoose');

// Secret for JWT and password hashing
const secret = bcryptjs.genSaltSync(10);


// Set up static folder for uploaded images
app.use('/api/upload-image', express.static(__dirname + '/temp/uploads'));

function getUserDataFromReq(req){
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY, {}, async (err, cookieData) => {
            if (err) {
                throw err;
            } 

            resolve(cookieData);
        })
    })

}



// Use JSON for requests and cookies
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'https://air-bnb-mern-v7a1.vercel.app/',
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL);

// Test route
app.get('/api/test', (req, res) => {
    res.json('test ok');
});

// Register route
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.create({
            name,
            email,
            password: bcryptjs.hashSync(password, secret),
        });
        res.json(user);
    } catch (e) {
        res.status(422).json(e);
    }

});

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFromDb = await User.findOne({ email });
        if (userFromDb) {
            const passOk = bcryptjs.compareSync(password, userFromDb.password);
            if (passOk) {
                jwt.sign({
                    email: userFromDb.email,
                    id: userFromDb._id,

                }, process.env.JWT_SECRET_KEY, {}, (err, token) => {
                    if (err) {
                        throw err;
                    }
                    res.cookie('token', token).json(userFromDb);
                });
            } else {
                res.status(422).json('pass not ok');
            }
        } else {
            res.json('not ok');
        }
    } catch (e) {
        res.status(422).json(e);
    }

});

// Profile route
app.get('/api/profile', (req, res) => {

    try {
        const { token } = req.cookies;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, cookieData) => {
                if (err) {
                    throw err;
                }
                const { name, email, _id } = await User.findById(cookieData.id);
                res.json({ name, email, _id });
            });
        } else {
            res.json({});
        }

    } catch (e) {

    }
});

// Logout route
app.post('/api/logout', (req, res) => {
    try {
        res.cookie('token', '').json(true);
    } catch (e) {
        res.json(e);
    }
});

// Upload image by link route
app.post('/api/upload-by-link', async (req, res) => {
    try {
        const { link } = req.body;
        const newname = Date.now() + '.jpg';
        const savedImage = await imageDownloader.image({
            url: link,
            dest: __dirname + '/temp/uploads/' + newname,
        });

        res.send({
            image: newname,
            message: 'successfully uploaded',
            status: 200,
        });
    } catch (er) {
        res.send({
            error: er.message,
            message: 'error occurred',
        });
    }
});

// Multer middleware for image upload
const photosMiddleware = multer({
    dest: 'temp/uploads',
});

// Image upload route
app.post('/api/upload-image', photosMiddleware.array('photos', 100), async (req, res) => {
    try {
        const uploadedFiles = [];
        for (let i = 0; i < req.files.length; i++) {
            const { path, originalname } = req.files[i];
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const newPath = path + '.' + ext;
            fs.renameSync(path, newPath);
            uploadedFiles.push(newPath.replace('uploads\\', ''));
        }
        console.log(uploadedFiles);

        res.json(uploadedFiles);
    } catch (error) {
        console.log(error);
        res.json({
            message: error.message,
            success: false,
        });
    }
});

// Places route
app.post('/api/places', (req, res) => {
    const { token } = req.cookies;
    const { title, address, addPhotos, perks,
        extraInfo, checkInTime, checkOutTime,
        maxGuest, description, price } = req.body;

    jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, cookieData) => {
        if (err) {
            throw err;
        }
        const placeDoc = await Place.create({
            owner: cookieData.id,
            title: title,
            address: address,
            photos: addPhotos,
            description: description,
            perks: perks,
            extraInfo: extraInfo,
            checkIn: checkInTime,
            checkOut: checkOutTime,
            maxGuests: maxGuest,
            price: price
        });

        res.json(placeDoc);
    });
});

// Get places route
app.get('/api/places', (req, res) => {
    const { token } = req.cookies;

    jwt.verify(token, jwtSecret, {}, async (err, cookieData) => {
        if (err) {
            throw err;
        }

        const { id } = cookieData;

        res.json(await Place.find({ owner: id }));
    });
});

// Get place by ID route
app.get('/api/places/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
});

// Update place route
app.put('/api/places', async (req, res) => {
    const { token } = req.cookies;

    const { id, title, address, addPhotos, perks,
        extraInfo, checkInTime, checkOutTime,
        maxGuest, description, price } = req.body;


    jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, cookieData) => {
        const placeDoc = await Place.findById(id);

        if (err) {
            throw err;
        }

        if (cookieData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title: title,
                address: address,
                photos: addPhotos,
                description: description,
                perks: perks,
                extraInfo: extraInfo,
                checkIn: checkInTime,
                checkOut: checkOutTime,
                maxGuests: maxGuest,
                price: price
            });
        }

        await placeDoc.save();

        res.json('ok');
    });
});



app.get('/api/home-places', async (req, res) => {

    try {
        const allPlaces = await Place.find();
        res.json(allPlaces)
    } catch (error) {
        res.json({
            message: error.message,
            success: false,
        })
    }

})


app.post('/api/bookings', async (req, res) => {
    const userData=await getUserDataFromReq(req);
    try {
        const data = await req.body;
        const bookingDoc = await Booking.create({
            place: data.place,
            name: data.name,
            user: userData.id,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            phone: data.phone,
            price: data.price,
            numberOfGuests: data.numberOfGuests

        })
        res.json(bookingDoc);

    } catch (error) {
        res.json({
            error: error.message,
            success: false,
        })
    }

})




app.get('/api/bookings', async (req, res) => {
    const { token } = req.cookies;
    const userData=await getUserDataFromReq(req);

    res.json(await Booking.find({user:userData.id}).populate('place'));

})


// Start the server
app.listen(4000, () => {
    console.log('app is listening on 4000');
});
