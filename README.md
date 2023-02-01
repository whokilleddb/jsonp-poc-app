# JSONP PoC
This repository contains a Proof-of-Concept web application to demonstrate JSONP attacks. The application contains a simple login feature with cookie-based authentication. The application makes a request to `/whoami` to fetch user data which returns a `jsonp` response and can be used to bypass SOP policy of the browser!

# Deployment

To run the code, first install all the dependencies with:
```bash
$ npm install
```

Once installed, you can start the application with:
```bash
$ npm start
```

This should start the application over port `3000` on `localhost`