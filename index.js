const express = require('express');
const cors = require('cors');


const connection=require("./config/db")
const productrouter = require('./route/product.route');
const authrouter = require('./route/user.route');
const auth = require('./middleware/auth.middleware');
const Analyticsrouter = require('./route/analytics.route');

const app = express();
require("dotenv").config()
const PORT = process.env.PORT ;

app.use(cors());
app.use(express.json());

app.use('/api', authrouter);
app.use('/api', auth , productrouter);
app.use('/api/analytics',auth, Analyticsrouter);

app.listen(PORT, async () => {
    try {
        await connection;
        console.log(`Server is running on port ${PORT}`);
        console.log("Connected to mongodb")
        
    } catch (error) {
        console.log("error connecting to db")
        console.log(error)
    }
});
