const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
require("./db/conn");
const bcrypt = require('bcrypt')
const Register = require('./models/registers')
const port = process.env.PORT || 5000;

const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// Set up static directory to serve
app.use(express.static(staticPath));

// Set up view engine and views directory
app.set('view engine', 'hbs');
app.set('views', templatePath);

// Register partials directory
hbs.registerPartials(partialsPath);

// Define a route that renders the 'index' view
app.get('/', (req, res) => {
    res.render('index'); // Assuming you have an 'index.hbs' file in the 'views' folder
});

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    try {
        const { fname, email, password, repassword } = req.body;

        if (password === repassword) {
            const existingUser = await Register.findOne({ email: email });

            if (existingUser) {
                res.status(400).send('Email already registered');
            } else {
                const RegisterVisitor = new Register({
                    fname,
                    email,
                    password,
                    repassword,
                });

                //   const token =RegisterVisitor.generateAuthToken();


                const registered = await RegisterVisitor.save();
                res.status(201).render('login');
            }
        } else {
            res.send('Your password is not matched');
        }
    } catch (error) {
        console.error("Error:", error);

        // Check for unique constraint violation
        if (error.code === 11000 && error.keyPattern.email) {
            res.status(400).send('Email already registered');
        } else {
            res.status(400).send(error.message || 'Registration failed');
        }
    }
});



app.get('/login', (req, res) => {
    res.render('login')
})

//login check
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await Register.findOne({ email: email });
        if (user) {
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (isPasswordMatch) {
                res.status(201).render('index');
            } else {
                res.send('Invalid login details');
            }
        } else {
            res.send('User not found');
        }
    } catch (error) {
        res.status(400).send('Invalid login details');
    }
});


app.get('/contact', (req, res) => {
    res.render('contact')
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.listen(port, () => {
    console.log('Backend connected');
});
