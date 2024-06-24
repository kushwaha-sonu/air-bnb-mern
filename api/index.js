
// Import dependencies
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;


// Import image downloader
const imageDownloader = require('image-downloader');


// Import JSON Web Token and bcrypt
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Place = require('./modals/Place');
const User = require('./modals/User');
const Booking = require('./modals/Booking');



// Secret for JWT and password hashing
const secret = bcrypt.genSaltSync(10);


function getUserDataFromReq(req) {
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
    origin: 'https://air-bnb-mern-fontend.onrender.com',
}));

app.use((req, res, next) => {
    res.setTimeout(60000, () => {
        console.log('Request has timed out.');
        res.status(504).send('Request timed out.');
    });
    next();
});

// Connect to MongoDB
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
};





const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create the destination directory if it doesn't exist
        const dest = './temp/uploads';
        require('fs').mkdir(dest, { recursive: true }, (err) => {
            if (err) {
                cb(err, dest);
            } else {
                cb(null, dest);
            }
        });
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Test route
app.get('/api/test', (req, res) => {
    res.json('test ok');
});

// Register route
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFromDb = await User.findOne({ email });

        if (!userFromDb) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const passOk = bcrypt.compareSync(password, userFromDb.password);
        if (!passOk) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        jwt.sign({
            email: userFromDb.email,
            id: userFromDb._id,
        }, process.env.JWT_SECRET_TOKEN, {}, (err, token) => {
            if (err) {
                console.error('Error signing JWT token:', err);
                return res.status(500).json({ success: false, error: 'Internal server error' });
            }
            res.cookie('token', token).json({ success: true, data: userFromDb });
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
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
        // Clear the token cookie by setting an empty value and maxAge to 0
        res.clearCookie('token').json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Upload image by link route
app.post('/api/upload-by-link', async (req, res) => {
    try {
        const { link } = req.body;
        const result = await cloudinary.uploader.upload(link, { folder: 'upload-image-by-link' });// Specify your desired folder in Cloudinary
        
        res.send({
            imageUrl: result.secure_url,
            message: 'Successfully uploaded to Cloudinary',
            status: 200,
        });
    } catch (error) {
        res.send({
            error: error.message,
            message: 'Error occurred while uploading to Cloudinary',
        });
    }
});

// Multer middleware for image upload
const upload = multer({
    storage: storage
}).array("photos");

// Image upload route
app.post('/api/upload-image', async (req, res) => {

    // Removed upload.single() from route handler
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                return res.status(400).json({
                    message: err.message,
                    success: false
                });
            } else if (err) {
                // An unknown error occurred when uploading
                return res.status(500).json({
                    message: err.message,
                    success: false
                });
            }

            const uploadedFiles = [];
            const cloudinaryResponses = [];
            for (let i = 0; i < req.files.length; i++) {
                const { path, originalname } = req.files[i];
                const parts = originalname.split('.');
                const ext = parts[parts.length - 1];
                const newPath = path + '.' + ext;
                fs.renameSync(path, newPath);
                uploadedFiles.push(newPath.replace('temp\\uploads\\', ''));

                // console.log("path: " + path);
                // console.log("file path->" + newPath);

                // Assuming cloudinary is properly configured elsewhere
                const cloudinaryResponse = await cloudinary.uploader.upload(newPath, { folder: 'upload-from-device' });
                // console.log('Uploaded to Cloudinary:', cloudinaryResponse);
                cloudinaryResponses.push(cloudinaryResponse.secure_url); // Store Cloudinary response

                // Delete the temporarily saved file
                fs.unlinkSync(newPath);
            }

            res.json({
                message: "ok",
                uploadedFiles: uploadedFiles,
                cloudinaryResponses: cloudinaryResponses,
                success: true
            });
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
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

    jwt.verify(token, process.env.JWT_SECRET_KEY, {}, async (err, cookieData) => {
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
    const userData = await getUserDataFromReq(req);
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
    const userData = await getUserDataFromReq(req);

    res.json(await Booking.find({ user: userData.id }).populate('place'));

})


// Start the server
app.listen(4000,
    async () => {
        await connectDB();
        console.log('app is listening on 4000');
    });
