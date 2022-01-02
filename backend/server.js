// Mark LaFreniere
// Last Modified: 12/2/2021

// Used extensions below...
// npm i express
// npm i cors
// npm i mysql

// import
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');

// set port number
const portNum = 3000;
const sqlportNum = 3306;

// create connection information for db
const connection = mysql.createConnection({
    host: 'localhost',
    port: sqlportNum,
    user: 'someuser',
    password: 'password',
    database: 'katstopdb'
});

// set cors -- dangerous, I know
app.use(cors({origin: '*'}));

// allow body parsing
app.use(express.json());

// connect to the db
connection.connect((err) => {
    if(err) throw err;
    console.log("Connected to database!");
});

// GET for logging in
app.get('/login', (req, res) => {

    console.log('checking client: \nUsername: ' + req.query.username 
                + ' \nPassword: ' + req.query.password);

    // database interaction here
    connection.query(`SELECT username, passwrd FROM login WHERE username = ?`,[
        req.query.username
    ], function(err,result){
        // if query is not empty... meaning no matching username
        if(result.length > 0){
            // if passwords in query matches with selected username
            if(result[0].passwrd === req.query.password){
                console.log("credentials match!");
                // send go ahead message to newsfeed
                res.send(JSON.stringify({message: 'direct'}));

            }
            else{
                console.log("password does not match with username");
                // prevent log in
                res.send(JSON.stringify({message: 'nodirect'}));
            }
        }
        else{
            console.log("no similiar username in db");
            // prevent log in
            res.send(JSON.stringify({message: 'nodirect'}));
        }
    });

});

// GET for getting profile info
app.get('/fetchprofile', (req, res) => {
    console.log('fetching profile info: \nUsername: ' + req.query.username);

    // retrieve info with SELECT
    connection.query(`SELECT image, bio, posts FROM profile WHERE username=?`,[
        req.query.username
    ], function(err, result) {
        console.log(result[0].image,result[0].bio,result[0].posts);
        res.send(JSON.stringify({image: result[0].image, message: result[0].bio, posts: result[0].posts}));
    })
});



// POST for creating account
app.post('/create-user', (req, res) => {

    console.log('creating client: \nUsername: ' + req.body.username
                + ' \nPassword: ' + req.body.password1);

    // database interaction here
    connection.query(`INSERT INTO login(username, passwrd) VALUES(?, ?)`,[
        req.body.username,
        req.body.password1
    ], function(err) {
        if(err){
            console.log("username already exists");
            // if matching username cancel account creation
            res.send(JSON.stringify({message: 'nocreated'}));
        }
        else {
            console.log("data added");
            connection.query(`INSERT INTO profile VALUES (?, 'DefaultProfile.png', '(no bio)', 0)`,[
                req.body.username
            ]);
            // if no matching username then create account
            res.send(JSON.stringify({message: 'created'}));
        }
    });
});

// create a post
app.post('/create-post', (req, res) => {

    let postid;
    let nowDate = new Date(); 
    let datePost = (nowDate.getMonth() + 1) + '-' + nowDate.getDate() + '-' + nowDate.getFullYear(); 

    console.log('Creating post: \nUsername: ' + req.body.username
                + ' \nBody: ' + req.body.postsBody);

    // find new post id
    connection.query(`SELECT MAX(postid) as max FROM posts`, function(err, result){
        // if no posts in table, set first post id as 1000, else increment
        if(!result[0].max){
            postid = 1000;
        }
        else{
            postid = result[0].max + 1;
        }
        // then get the profile image from the poster
        connection.query(`SELECT image FROM profile WHERE username = ?`,[
            req.body.username
        ], function(err2, resultImage){
            console.log(resultImage[0].image);
            // then insert all relevent info into the post table
            connection.query(`INSERT INTO posts(postid,username,date,body,image) VALUES(?,?,?,?,?)`,[
                postid,
                req.body.username,
                datePost,
                req.body.postsBody,
                resultImage[0].image
            ], function(err){
                if(err) {throw err;}
                res.send(JSON.stringify({message: 'made'}));
            });
        });

        // update database for users post counter (++)
        connection.query(`UPDATE profile SET posts = posts + 1 WHERE username = ?`,[
            req.body.username
        ]);
    })
});

// update profile information
app.put('/update-user', (req,res) =>{
    console.log('updating client: \nUsername: ' + req.body.username
    + ' \nimage: ' + req.body.imageGet + ' \nbio: ' + req.body.bioGet);

    // update profile with new information
    connection.query(`UPDATE profile SET image = ?, bio = ? WHERE username = ?`,[
        req.body.imageGet, 
        req.body.bioGet, 
        req.body.username
    ], function(err){
        // handle potential errors
        if(err){
            res.send(JSON.stringify({message: 'error'}));
        }
        else{
            res.send(JSON.stringify({message: 'updated'}));
        }
    });

    // update images for posts too, as they have an image field
    connection.query(`UPDATE posts SET image = ? WHERE username = ?`,[
        req.body.imageGet,
        req.body.username
    ]);

});

// fetch post for display on profile page
app.get('/fetchprofileposts', (req, res) => {
    console.log('fetching profile post: \nUsername: ' + req.query.username);

    // simply get all post information for one user
    connection.query(`SELECT postid, username, date, body, image FROM posts WHERE username=? ORDER BY postid DESC`,[
        req.query.username
    ], function(err, result) {
        res.send(result);
    })
});

app.get('/fetchotherposts', (req, res) => {
    console.log('fetching other posts: no param');

    // get all post information, could get big!
    connection.query(`SELECT postid, username, date, body, image FROM posts ORDER BY postid DESC`,[
        req.query.username
    ], function(err, result) {
        res.send(result);
    })
});

// server to listen on port 3000
app.listen(portNum, () => {
    console.log(`listening on port ${portNum}`);
})