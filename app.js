const express = require('express');
const cors = require('cors');
const {MongoClient} = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on the port number ${PORT}`));

function authentication(req, res, next)
{
    var authHeader = req.headers.authorization;
    if(!authHeader)
        return res.json("Unauthorized access").status(401);

    var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
    if(username==='admin' && password==='123456')
        next();
    else
        return res.json("Unauthorized access").status(401);
}

app.use(authentication);

//Configuration (MONGODB)
var curl = "mongodb://localhost:27017";
var client = new MongoClient(curl); 

//TESTING
app.get('/klef/test', async function(req, res){
    //res.send("Koneru Lakshmaiah Education Foundation");
    res.json("Koneru Lakshmaiah Education Foundation");
});

app.post('/klef/cse', async function(req, res){
    res.json(req.body);
    //res.json("Computer Science and Engineering");
});

//REGISTRATION MODULE
app.post('/registration/signup', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('MSWD1');
        users = db.collection('MSWD1');
        data = await users.insertOne(req.body);
        conn.close();
        res.json("Registered successfully...");
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//LOGIN MODULE
app.post('/login/signin', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('MSWD1');
        users = db.collection('MSWD1');
        data = await users.count(req.body);
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//HOME MODULE
app.post('/home/uname', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('MSWD1');
        users = db.collection('MSWD1');
        data = await users.find(req.body, {projection:{firstname: true, lastname: true}}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/home/menu', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('MSWD1');
        menu = db.collection('menu1');
        data = await menu.find({}).sort({mid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/home/menus', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('MSWD1');
        menus = db.collection('menus1');
        data = await menus.find(req.body).sort({smid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//CHANGE PASSWORD
app.post('/cp/updatepwd', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('MSWD1');
        users = db.collection('MSWD1');
        data = await users.updateOne({emailid : req.body.emailid}, {$set : {pwd : req.body.pwd}});
        conn.close();
        res.json("Password has been updated");
    }catch(err)
    {
        res.json(err).status(404);
    }
});

// Modify your Express backend to include a route for fetching profile details
app.post('/home/profile', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('MSWD1');
        users = db.collection('MSWD1');
        // Assuming the email ID is stored in req.body.emailid
        data = await users.findOne({ emailid: req.body.emailid });
        conn.close();
        res.json(data); // Assuming user data is returned as JSON
    }catch(err)
    {
        res.json(err).status(404);
    }
});


// POST route to add a review

//CHANGE PASSWORD BASED ON EMAIL
app.post('/forgotpassword/fp2', async function(req, res){
    try
    {
        const { UserName, newpassword } = req.body;
        conn = await client.connect();
        db = conn.db('MSWD1');
        users = db.collection('MSWD1');
        // Find the user with the provided email address
        const user = await users.findOne({ emailid: UserName });
        if (!user) {
            // If user not found, send an error response
            return res.status(404).json({ error: 'User not found' });
        }
        // Update the password for the found user
        await users.updateOne({ emailid: UserName }, { $set: { pwd: newpassword } });
        conn.close();
        res.json("Password has been updated");
    } catch(err)
    {
        console.error('Error updating password:', err);
        res.status(500).json({ error: 'Failed to update password' });
    }
});

// POST route to add a review
// app.post('/ratings/add', async function(req, res){
//     try {
//         const { rating } = req.body;
//         // Here you can store the rating in your database
//         // For demonstration, let's assume you have a collection named 'ratings'
//         // and you're storing the ratings along with the user's email ID
//         conn = await client.connect();
//         db = conn.db('MSWD1');
//         ratings = db.collection('ratings');
//         await ratings.insertOne({ emailid: req.body.emailid, rating: rating });
//         conn.close();
//         res.json("Rating submitted successfully");
//     } catch(err) {
//         console.error('Error submitting rating:', err);
//         res.status(500).json({ error: 'Failed to submit rating' });
//     }
// });
// POST route to add a review
// app.post('/ratings/add', async function(req, res){
//     try {
//         const { firstName, rating } = req.body;
//         // Here you can store the rating along with the user's first name in your database
//         conn = await client.connect();
//         db = conn.db('MSWD1');
//         ratings = db.collection('ratings');
//         await ratings.insertOne({ firstName: firstName, rating: rating });
//         conn.close();
//         res.json("Rating submitted successfully");
//     } catch(err) {
//         console.error('Error submitting rating:', err);
//         res.status(500).json({ error: 'Failed to submit rating' });
//     }
// });

// app.post('/ratings/add', async function(req, res){
//     try {
//         const { firstName, rating } = req.body;
//         // Here you can store the rating along with the user's first name in your database
//         conn = await client.connect();
//         db = conn.db('MSWD1');
//         ratings = db.collection('ratings');
//         await ratings.insertOne({ firstName: firstName, rating: rating });
//         conn.close();
//         res.json("Rating submitted successfully");
//     } catch(err) {
//         console.error('Error submitting rating:', err);
//         res.status(500).json({ error: 'Failed to submit rating' });
//     }
// });

app.post('/ratings/add', async function(req, res){
    try {
        const { monument, emailid, rating } = req.body;
        // Here you can store the rating along with the user's email and monument name in your database
        conn = await client.connect();
        db = conn.db('MSWD1');
        ratings = db.collection('ratings');
        await ratings.insertOne({ monument: monument, emailid: req.body.emailid, rating: rating });
        conn.close();
        res.json("Rating submitted successfully");
    } catch(err) {
        console.error('Error submitting rating:', err);
        res.status(500).json({ error: 'Failed to submit rating' });
    }
});


// app.post('/ratings/add', async function(req, res){
//     try {
//         const { monument, username, rating } = req.body;
//         // Here you can fetch the user's email from the MSWD1 collection based on their username
//         conn = await client.connect();
//         db = conn.db('MSWD1');
//         users = db.collection('MSWD1');
//         const userData = await users.findOne({ username: username });
//         if (!userData) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         const userEmail = userData.emailid;
//         // Store the rating along with the user's email and monument name in your database
//         ratings = db.collection('ratings');
//         await ratings.insertOne({ monument: monument, emailid: userEmail, rating: rating });
//         conn.close();
//         res.json("Rating submitted successfully");
//     } catch(err) {
//         console.error('Error submitting rating:', err);
//         res.status(500).json({ error: 'Failed to submit rating' });
//     }
// });


// Fetch all ratings for the Taj Mahal
app.get('/ratings/tajmahal', async function(req, res){
    try {
        conn = await client.connect();
        db = conn.db('MSWD1');
        ratings = db.collection('ratings');
        const tajMahalRatings = await ratings.find({ monument: 'Taj Mahal' }).toArray();
        conn.close();
        res.json(tajMahalRatings);
    } catch(err) {
        console.error('Error fetching ratings:', err);
        res.status(500).json({ error: 'Failed to fetch ratings' });
    }
});

