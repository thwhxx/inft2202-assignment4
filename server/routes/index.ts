import express from 'express';
const router = express.Router();
import Contact from "../models/contact";

//http://localhost:3000/home

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home', page: 'home', displayName: ''});
});

router.get('/home', function(req, res, next) {
    res.render('index', { title: 'Home', page: 'home', displayName: ''});
});

router.get('/article', function(req, res, next) {
    res.render('index', { title: 'Article', page: 'article', displayName: ''});
});

router.get('/blog', function(req, res, next) {
    res.render('index', { title: 'Blog', page: 'blog', displayName: ''});
});

router.get('/careers', function(req, res, next) {
    res.render('index', { title: 'Careeers', page: 'careers', displayName: ''});
});

router.get('/contactus', function(req, res, next) {
    res.render('index', { title: 'Contact Us', page: 'contactus', displayName: ''});
});

router.get('/contact-list', function(req, res, next) {

    Contact.find().then(function (data){
        console.log(data);
        res.render('index', { title: 'Contact List', page: 'contact-list', contacts: data, displayName: ''});

    }).catch(function (err){
        console.error("Encounters error reading from the database" + err);
        res.end();
    });
});


router.get('/edit/:id', function(req, res, next) {

    let id = req.params.id;

    Contact.findById(id).then(function (contactToEdit){
        res.render('index', { title: 'Edit Contact', page: 'edit',
            contact: contactToEdit, displayName: ''});
    }).catch(function (err){
        console.log(err);
        res.end();

    });

});

router.get('/events', function(req, res, next) {
    res.render('index', { title: 'Events', page: 'events', displayName: ''});
});

router.get('/eventsplanning', function(req, res, next) {
    res.render('index', { title: 'Events Planning', page: 'eventsplanning', displayName: ''});
});

router.get('/gallery', function(req, res, next) {
    res.render('index', { title: 'Gallery', page: 'gallery', displayName: ''});
});

router.get('/login', function(req, res, next) {
    res.render('index', { title: 'Login', page: 'login', displayName: ''});
});

router.get('/add', function(req, res, next) {
    res.render('index', { title: 'Add Contact', page: 'edit', contact: '', displayName: ''});
});
router.get('/portfolio', function(req, res, next) {
    res.render('index', { title: 'Our Portfolio', page: 'portfolio', displayName: ''});
});

router.get('/privacypolicy', function(req, res, next) {
    res.render('index', { title: 'Privacy Policy', page: 'privacypolicy', displayName: ''});
});

router.get('/register', function(req, res, next) {
    res.render('index', { title: 'Register', page: 'register', displayName: ''});
});

router.get('/services', function(req, res, next) {
    res.render('index', { title: 'Our Services', page: 'services', displayName: ''});
});

router.get('/team', function(req, res, next) {
    res.render('index', { title: 'Our Team', page: 'team', displayName: ''});
});

router.get('/termsofservice', function(req, res, next) {
    res.render('index', { title: 'Terms of Service', page: 'termsofservice', displayName: ''});
});

router.get('/delete/:id', function (req, res, next){

    let id  = req.params.id;

    Contact.deleteOne({_id: id}).then(function (){
        res.redirect('/contact-list');
    }).catch(function (err){
        console.error(err);
        res.end();
    })

});

/** POST ROUTES**/
router.post('/edit/:id', function (req, res, next){

    let id = req.params.id;

    let updatedContact = new Contact (
        {
            "_id": id,
            "FullName": req.body.fullName,
            "ContactNumber": req.body.contactNumber,
            "EmailAddress": req.body.emailAddress,
        }
    );

    Contact.updateOne({_id: id}, updatedContact).then(function (){
        res.redirect('/contact-list');
    }).catch(function (err){
        console.error(err);
        res.end()
    })


});

router.post('/add', function (req, res, next){
    let newContact = new Contact (
        {

            "FullName": req.body.fullName,
            "ContactNumber": req.body.contactNumber,
            "EmailAddress": req.body.emailAddress,
        }
    );

    Contact.create(newContact).then(function (){
        res.redirect('/contact-list');
    }).catch(function (err){
        console.error(err);
        res.end();
    })

});

export default router;
