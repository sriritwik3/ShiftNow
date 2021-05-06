const mongoose = require('mongoose');
const cities = require('./cities');
const rooms = require('./rooms');
const House = require('../models/house');


mongoose.connect('mongodb://localhost:27017/shiftnow', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected!!!!");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await House.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 2000) + 3000;
        //const rating = Math.floor(Math.random() * 5) + 1;

        const home = new House({
            owner: '6085b4f65bed7b0c0412dced',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            roomType: `${sample(rooms.room)}`,
            availability: `${sample(rooms.availability)}`,
            parking: `${sample(rooms.parking)}`,
            description: " Lorem ipsum dolor sit amet consectetur adipisicing elit.Harum, laudantium iusto ad cumque officiis nesciunt architecto veniam labore reprehenderit iste dolor dolore dicta dignissimos soluta magnam, vero aliquam.Asperiores, ipsam .",
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/shiftnow/image/upload/v1620150380/ShiftNow/lcc5nwvihijqo58z5zmn.jpg',
                    filename: 'ShiftNow/lcc5nwvihijqo58z5zmn'
                },
                {
                    url: 'https://res.cloudinary.com/shiftnow/image/upload/v1620150383/ShiftNow/u1zamcdfvmuhhzwz86jm.jpg',
                    filename: 'ShiftNow/u1zamcdfvmuhhzwz86jm'
                }
            ]
        })
        await home.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})