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
        const rating = Math.floor(Math.random() * 5) + 1;

        const home = new House({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            roomType: `${sample(rooms.room)}`,
            image: 'https://source.unsplash.com/collection/4666484',
            description: " Lorem ipsum dolor sit amet consectetur adipisicing elit.Harum, laudantium iusto ad cumque officiis nesciunt architecto veniam labore reprehenderit iste dolor dolore dicta dignissimos soluta magnam, vero aliquam.Asperiores, ipsam .",
            price,
            rating
        })
        await home.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})