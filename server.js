// Dependencies
var express =  require('express')
var bodyParser = require('body-parser')
var path = require('path')
const bcrypt = require('bcrypt');
var session = require('express-session');
var request = require('request');

// Create express app
var app  =  express()

// Configure application
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())
app.use(session({
    secret: "$up3r$3cr3tK3y",
    resave: true,
    saveUninitialized: true,
}));
// now you can access session
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});


// Host configuration
const HOST = "0.0.0.0";
const PORT = 8000;

// User credential
const users = [{
    id: 1,
    username: 'johndoe',
    password: '$2b$10$lq5kBLti.5p/Ziq6GmXVdeVr2mMJvyPvFk.zpiy.2F1ozVqTw18cu', // passw0rd
    phone : '+91-0000000000',
    role: 'admin',
    email: "test@example.com",
    balance: "$99,999,999",
    address: "221B Baker Street, London"
}];


// Authenticate
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.redirect('/');
}


// Login route
app.post('/login', function(req, res) {
    const {username, password} = req.body;
    const user = users.find(u => u.username === username);
    console.log("[i] Trying credentials - %s:%s", username, password)

    // Check if user exists
    if (!user) {
        console.warn("[!] Could not find user: %s", username)
        return res.status(401).send({ message: 'Invalid Credentials' });
    }

    // Compare password
    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            req.session.user = user;
            console.log("[i] Logged In As - %s", username)
            return res.send({status: "ok"});
        }
        console.warn("[!] Failed to Login user - %s", username)
        return res.status(401).send({ message: 'Invalid Credentials' });
    });
});  


// show user info
app.get('/whoami', isAuthenticated, (re1, res) => {
    console.log("[i] Served User Info")
    return res.jsonp(users[0]);
});


// Console page
app.get(['/console', '/console.html'], isAuthenticated, (req, res) => {
    console.log("[i] Served Console")
    res.sendFile(path.join(__dirname, '/routes/console.html'));
});


// Favicon 
// Console page
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/media/favicon.ico'));
});

app.get('/echo', (req, res) => {
    res.jsonp(req.block);
  })
  
// Index page
app.get(['/', '/index', '/index.html'], function(req, res) {
    console.log("[i] Served index page")
    res.sendFile(path.join(__dirname, '/routes/index.html'));
}) 


// 404 error
app.get('*', function(req, res){
    console.warn("[!] Invalid URL: %s", req.originalUrl)
    res.status(404).sendFile(path.join(__dirname, '/routes/404.html'));
});


// Host Server
app.listen(PORT, HOST, () => {
    console.log('[i] Server running at http://%s:%d/', HOST, PORT);
  })
