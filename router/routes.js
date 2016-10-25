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

    app.get('/logout', isLoggedIn, function(req, res) {
        req.logout();
        res.redirect('/');
    });


    app.get('/verUsuario', isLoggedIn, function (req, res) {
        if(req.user.permiso == "ADMIN") {
            res.render('VerUsuario.html');
        }else{
            res.render('profile.html', {
                user : req.user
            });
        }
    });

    app.get('/crearUsuario',isLoggedIn ,function (req, res) {
        if(req.user.permiso == "ADMIN"){
            res.render('CrearUsuario.html', {title: 'Registrar Usuarios'});
        }else{
            res.render('profile.html', {
                user : req.user
            });
        }

    });

    app.get('/cargar_base_de_datos', isLoggedIn, function (req, res) {
        if(req.user.permiso == "ADMIN"){
            res.render('SubirArchivo.html', {error: ""});
        }else{
            res.render('profile.html', {
                user : req.user
            });
        }
    });

    app.get('/llamar', isLoggedIn, function (req, res) {
        res.render('Llamar.html');
    });

    app.get('/modificar_usuario', isLoggedIn,function (req, res) {
        res.render('ModificarUsuario.html');
    });

    app.get('/crear_proyecto', isLoggedIn,function (req, res) {
        if(req.user.permiso == "ADMIN") {
            res.render('CrearProyecto.html');
        }else{
            res.render('profile.html', {
                user : req.user
            });
        }
    });

    app.get('/eliminar_proyecto', isLoggedIn,function (req, res) {
        if(req.user.permiso == "ADMIN") {
            res.render('EliminarProyecto.html');
        }else{
            res.render('profile.html', {
                user : req.user
            });
        }
    });

    app.get('/listar_proyecto', isLoggedIn,function (req, res) {
        res.render('ListarProyecto.html');
    });

    app.get('/modificar_proyecto', isLoggedIn,function (req, res) {
        console.log(req)
        if(req.user.permiso == "ADMIN") {
            res.render('ModificarProyecto.html');
        }else{
            res.render('profile.html', {
                user : req.user
            });
        }
    });

    app.get('/agregar_usuario', isLoggedIn,function (req, res) {
        console.log(req)
        if(req.user.permiso == "ADMIN") {
            res.render('AgregarAlProyecto.html');
        }else{
            res.render('profile.html', {
                user : req.user
            });
        }
    });

    app.get('/quitar_usuario', isLoggedIn,function (req, res) {
        console.log(req)
        if(req.user.permiso == "ADMIN") {
            res.render('QuitarDelProyecto.html');
        }else{
            res.render('profile.html', {
                user : req.user
            });
        }
    });

    app.get('/menu', isLoggedIn,function (req, res) {
        res.render('Menu.html');
    });

    app.get('/modificar_estado', isLoggedIn,function (req, res) {
        if(req.user.permiso == "ADMIN") {
            res.render('ModificarEstadoLlamada.html');
        }else{
            res.render('profile.html', {
                user : req.user
            });
        }
    });

    app.get('/guardarArchivo', isLoggedIn,function (req,res) {
        console.log(req)
        res.render("CargarBaseDeDatos.html", {exito: "archivo valido, haga click en el botón para cargar la base de datos"});
    })

    app.post('/upload',isLoggedIn,function(req, res) {
        var sampleFile;
        var csv = require('ya-csv');
        var verificar_errores = 0;
        var i = 0
        var data = []
        if (!req.files) {
            res.render("SubirArchivo.html", {error: "no selecciono archivo"});
        }
        try {
            sampleFile = req.files.archivo;
            console.log(sampleFile.mimetype)
            if (sampleFile.mimetype == "application/vnd.ms-excel"){
                sampleFile.mv('./conection/' + sampleFile.name, function (err) {
                    if (err) {
                        res.render("SubirArchivo.html", {error: "archivo no es valido"})
                    }
                    else {
                        //verifica si hay cuatro campos en el archivo//
                        var reader = csv.createCsvFileReader("./conection/" + sampleFile.name);
                        reader.on('data', function (rec) {
                            if(i!= 0){
                                if(rec.length != 4){
                                    verificar_errores++
                                }
                            }
                            i++;
                        }).on('end', function () {
                            if(verificar_errores != 0){
                                res.render("SubirArchivo.html", {error: "el archivo no tiene la estructura: Nombre; Apellido; Número telefonico; Estado de la llamada"})
                            }
                            else {
                                res.redirect("/guardarArchivo");
                            }
                        });
                    }
                });
            }
            else{
                res.render("SubirArchivo.html", {error: "El archivo no tiene extensión .csv"})
            }
        }
        catch (ex){
            res.render("SubirArchivo.html", {error: "Error en el archivo"})
        }

    })

}



function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

/*
var resultado=[];
var csv = require('ya-csv');
i = 0
var reader = csv.createCsvFileReader('./conection/'+sampleFile.name);
var data = [];
reader.on('data', function(rec) {
    if(i != 0){
        data.push(rec);
        console.log(rec[1])
    }
    i++;
}).on('end', function() {
    console.log(data);
});
*/