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
    password: '$2b$10$lq5kBLti.5p/Ziq6GmXVdeVr2mMJvyPvFk.zpiy.2F1ozVqTw18cu' // passw0rd
}];

// Authenticate
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).send({ message: 'Not authenticated' });
}


// Login route
app.post('/login', function(req, res) {
    const {username, password} = req.body;
    const user = users.find(u => u.username === username);

    // Check if user exists
    if (!user) {
        console.log("Failed Login attempt - %s:%s", username, password)
        return res.status(401).send({ message: 'Invalid Credentials' });
    }

    // Compare password
    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            req.session.user = user;
            console.log("Logged In As - %s:%s", username, password)
            return res.send({status: "ok"});
        }
        console.log("Failed Login attempt - %s:%s", username, password)
        return res.status(401).send({ message: 'Invalid Credentials' });
    });
});  

// Dashboard page
app.get(['/console', '/console.html'], isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '/routes/console.html'));
});  


// Index page
app.get(['/', '/index', '/index.html'], function(req, res) {
    res.sendFile(path.join(__dirname, '/routes/index.html'));
});  

// 404 error
app.get('*', function(req, res){
    res.status(404).sendFile(path.join(__dirname, '/routes/404.html'));
});

app.listen(PORT, HOST, () => {
    console.log('Server running at http://%s:%d/', HOST, PORT);
  })