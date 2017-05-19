var Message = require('./models/post');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });




    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', //redirect to the secure profile section
        failureRedirect : '/signup', //redirect back to the signup page if there is an error
        failureFlash : true //allow flash messages

    }));



    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });



    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/messages', // redirect to the messageboard
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));






    // =====================================
    // MESSAGE BOARD =======================
    // =====================================
    // show the message board
    app.get('/messages', isLoggedIn,function(req, res) {
        // render the page and pass in any flash data if it exists
        getMessages().then((messages)=>{
            res.render('board.ejs', {messages: messages});

        })

    });


    // =====================================
    // MESSAGE POST ========================
    // =====================================
    // post messages

    app.post('/messages', isLoggedIn, function(req, res, next){
        console.log('hello world');
        console.log(req.body);
        console.log(req.user._id);
        var message = new Message({userID: req.user._id, message: req.body.message, date: new Date()});
            // message.message = req.params.message;
            console.log(message);
            // message.date = new Date();
            message.save(function () {
            getMessages().then((messages)=>(
                res.render('board.ejs', {messages: messages})
            ))
        });
    })


    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
          return next();
        }
        res.redirect('/login');
    }


    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });



}; // end module.exports (app, passport)

function getMessages(query){
    return new Promise(function(resolve, reject){
       Message
        .find(query)
        .populate("userID")
        .exec((err, messages) => {
            console.log(messages);
            if(err) reject(err);
            resolve (messages);
        }) 
    });
}







// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}