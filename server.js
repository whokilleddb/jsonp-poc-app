// Dependencies
var express =  require('express')
var bodyParser = require('body-parser')
var path = require('path')
const bcrypt = require('bcrypt');
var session = require('express-session');

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
    username: 'farid',
    password: '$2b$10$lq5kBLti.5p/Ziq6GmXVdeVr2mMJvyPvFk.zpiy.2F1ozVqTw18cu', // passw0rd
    team : 'rocket',
    acc: 'XQC-MK-LUD'
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
    user_info = {
        id: users[0].id,
        name: users[0].username,
        team: users[0].team,
        acc: users[0].acc,
    };
    console.log("[i] Served User Info")
    return res.send(JSON.stringify(user_info));
});

// Console page
app.get(['/console', '/console.html'], isAuthenticated, (req, res) => {
    console.log("[i] Served Console")
    res.sendFile(path.join(__dirname, '/routes/console.html'));
});  


// Index page
app.get(['/', '/index', '/index.html'], function(req, res) {
    console.log("[i] Served index page")
    res.sendFile(path.join(__dirname, '/routes/index.html'));
});  

// 404 error
app.get('*', function(req, res){
    console.warn("[!] Invalid URL: %s", req.originalUrl)
    res.status(404).sendFile(path.join(__dirname, '/routes/404.html'));
});

app.listen(PORT, HOST, () => {
    console.log('[i] Server running at http://%s:%d/', HOST, PORT);
  })