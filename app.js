// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- //
//                              IMPORTS                                    // 
// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- //

require('dotenv').config()
const express = require('express')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- //
//                              MONGO DB                                   // 
// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- //

//Connect to mongoose
mongoose.connect(`mongodb+srv://admin:${process.env.PASSWORD}@cluster0-lpgqf.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`, {
    useNewUrlParser: true
}).then(()=>{
    console.log(`MongoDB connected`)
}).catch(e => console.log(`${e}`))

// Load models
require('./models/Idea')
const Idea = mongoose.model('ideas')

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- //
//                              MIDDLEWARES                                // 
// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- //

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(methodOverride('_method'))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

app.use(flash())

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

app.use(express.static(__dirname))

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- //
//                                ROUTES                                   // 
// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- //

app.get('/', (req, res)=>{
    // sending to browser
    const title = 'HOME'
    res.render('index', {
        title: title
    })
})

app.get('/ideas/add', (req, res)=>{
    res.render('ideas/add')
})

app.get('/ideas/edit/:id', (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea: idea
        })
    })
})

app.get('/ideas', (req, res)=>{
    Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
        res.render('ideas/index', {
            ideas: ideas
        })
    })
})

app.post('/ideas', (req, res)=>{
    let errors = []
    if(!req.body.title){
        errors.push({text:`Please add a title`})
    }
    if(!req.body.detail){
        errors.push({text:`Please add a body to your message`})
    }
    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            detail: req.body.detail
        })
    } else {
        const newUser = {
            title: req.body.title,
            detail: req.body.detail
        }
        new Idea(newUser)
        .save()
        .then(idea => {
            req.flash('success_msg', 'Element added successfully')
            res.redirect('./ideas')
        })
    }
})

app.put('/ideas/:id', (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    }).then(idea => {
        idea.title = req.body.title,
        idea.detail = req.body.detail

        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Element updated successfully')
            res.redirect('/ideas')
        })
    })
})

app.delete('/ideas/:id', (req, res) => {
    Idea.remove({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'Element deleted successfully')
        res.redirect('/ideas')
    })
})

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- //
//                            START SERVER                                 // 
// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- //

const port = 5000

app.listen(port, ()=>{
    console.log(`server started on port ${port}`)
})

