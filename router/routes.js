/**
 * Created by famancil on 21-08-16.
 */

module.exports = function(app, passport) {

    app.get('/', function (req, res) {
        res.render('index.html', {title: 'Mi primer Aplicacion Web'});
    });

    /*app.get('/prueba', function (req, res) {
        res.render('prueba.html');
    });*/

    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.html', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        //console.log(req)
        res.render('profile.html', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    app.get('/verUsuario', function (req, res) {
        res.render('VerUsuario.html');
    });

    app.get('/crearUsuario', function (req, res) {
        res.render('CrearUsuario.html', {title: 'Registrar Usuarios'});
    });

    app.get('/cargar_base_de_datos', function (req, res) {
        res.render('CargarBaseDeDatos.html');
    });

    app.get('/llamar', function (req, res) {
        res.render('Llamar.html');
    });

    app.get('/modificar_usuario', function (req, res) {
        res.render('ModificarUsuario.html');
    });
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}