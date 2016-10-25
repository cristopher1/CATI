//Dependecies
var express = require('express');
var router= express.Router();
var mysql = require('mysql');
var url = require('url');
//var Usuario = require('../models/usuario.js');
//var Rol= require('../models/rol.js');
//var Usuario= require('../models/usuario.js');
var models  = require('../models');
var excel = require('../conection');


// Routes
/*router.get('/usuarios', function(req,res){
	res.send('api esta funcionando');
});*/

/*router.get('/', function(req,res){
	res.render('api', {title: 'Mi primer Aplicacion Web'});
});*/

//Return router
module.exports = router;

//GET permisos

router.get('/permisos', function(req, res, next) {
	var permiso = [];
	try {
		permiso.push(req.user.permiso);
			res.json(permiso)
	} catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});

//GET usuarios
router.get('/usuarios', function(req, res, next) {
	try {
		/*var query = url.parse(req.url,true).query;
		 console.log(query);*/
		models.Usuario.findAll({where: {$not: {id: req.user.id}}}).then(function (user) {
			//for(var x=0;x<user.length;x++){
			//console.log(user[x].username);
			//res.render('VerUsuario.html', {title: 'Listar Usuarios', resultado: user});
			res.json(user);
			//}
		});
		//res.render('VerUsuario.html', {title: 'Listar Usuarios'});
	} catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});



//GET un usuario con id determinado
router.get('/usuarios/:id', function(req, res, next) {
	try {
		//var query = url.parse(req.url,true).query;
		//console.log(query);
		console.log(req.params.id);
		models.Usuario.findAll({
			where: {
				id: req.params.id,
			}
		}).then(function (user) {
			//for(var x=0;x<user.length;x++){
			//console.log(user[x].username);
			//console.log(user.get('username'));
			res.json(user);
			//}
		});
	} catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});

//POST crear usuario
router.post('/usuarios', function(req,res,next){
try{
	console.log(req.body.permiso);
	var resultado=[];
	if(req.body.email && req.body.username && req.body.password && req.body.permiso) {
		models.Usuario.findOne({where: {username: req.body.username}})
			.then(function (usuario) {
			try{
				usuario.length;
				resultado.push("ya existe un usuario con ese nombre")
				res.json(resultado)

			}catch (ex){
				models.Usuario.create({
					username: req.body.username,
					password: req.body.password,
					email: req.body.email
				}).then(function (user) {
					models.Rol.create({
						permiso: req.body.permiso,
						UsuarioId: user.id
					}).then(function (rol) {
						resultado.push(user);
						resultado.push(rol);
						res.json(resultado);
					});
				});
			}
		})
	}
	else{
		resultado.push("datos incompletos")
		res.json(resultado)
	}
}catch(ex){
	    console.error("Internal error:"+ex);
	    return next(ex);
	}
});

//modificar usuario//
router.put('/usuarios/', function(req,res,next){
	try{
		models.Usuario.findOne({where : { id:req.user.id }}).then(function (user) {
			//for(var x=0;x<user.length;x++){
			//console.log(user.username);
			if(req.body.username){
				if(req.body.email) {
					user.updateAttributes({
						username: req.body.username,
						email: req.body.email
					}).then(function (result) {
						res.json(result);
					})
				}
				else {
					user.updateAttributes({
						username: req.body.username
					}).then(function (result) {
						res.json(result);
					})
				}
			}
			else if(req.body.email) {
				user.updateAttributes({
					email: req.body.email
				}).then(function (result) {
					res.json(result);
				})
			}
			else{
				var resultado = []
				res.json(resultado)
			}
		});
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});

router.delete('/usuarios/:id', function(req,res,next){
	try{
		models.Usuario.destroy({where: {id: req.params.id} }).then(function () {
			return models.Usuario.findAll().then(function (user) {
				res.json(user);
			})
		})
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});


/////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////


//POST crear proyecto//
router.post('/proyectos', function(req,res,next){
	try{
		console.log(req.body.permiso);
		var resultado=[];
		if(req.body.nombreProyecto) {
			models.Proyecto.create({
				nombreProyecto: req.body.nombreProyecto
			}).then(function (proyecto) {
				models.UsuarioProyecto.create({
						UsuarioId: req.user.id,
						ProyectoId: proyecto.id
					}
				).then(function (usuarioproyecto) {
					resultado.push(proyecto);
					resultado.push(usuarioproyecto);
					res.json(resultado);
				});
			});
		}else{
			resultado.push("datos incompletos")
			res.json(resultado)
		}
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});



//borrar proyecto//
router.delete('/proyectos/:id', function(req,res,next){
	try{
		models.Proyecto.destroy({where: {id: req.params.id} }).then(function () {
			return models.Proyecto.findAll().then(function (proyecto) {
				res.json(proyecto);
			})
		})
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});

//GET proyectos a los que pertenece un determinado usuario o administrador
router.get('/proyectos', function(req, res, next) {
	try {
		/*var query = url.parse(req.url,true).query;
		 console.log(query);*/
		models.UsuarioProyecto.findAll({where: {UsuarioId: req.user.id}}).then(function (proyectos) {
			var resultado = []
			for(var x = 0; x < proyectos.length; x++){
				resultado.push(proyectos[x].dataValues.ProyectoId)
			}
			models.Proyecto.findAll({where: {id: {$in: resultado}}}).then(function (user) {
				res.json(user);
			})
		});
		//res.render('VerUsuario.html', {title: 'Listar Usuarios'});
	} catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});

//modificar proyectos//
router.put('/proyectos/:id', function(req,res,next){
    try{
    	if(req.body.nombreProyecto) {
			models.Proyecto.findOne({where: {id: req.params.id}}).then(function (proyecto) {
				//for(var x=0;x<user.length;x++){
				//console.log(user.username);
				proyecto.updateAttributes({
					nombreProyecto: req.body.nombreProyecto,
				}).then(function (result) {
					res.json(result);
				})
			})
		}else{
			var resultado = []
			res.json(resultado);
		}
    }
    catch(ex){
        console.error("Internal error:"+ex);
        return next(ex);
    }
});

//agregar usuario a proyecto//
router.post('/usuarioProyecto/:id', function(req,res,next){
	try{
		var resultado=[];
		models.UsuarioProyecto.create({
				ProyectoId: req.body.idProyecto,
				UsuarioId: req.params.id
			}
		).then(function (usuarioproyecto){
				resultado.push(usuarioproyecto);
				res.json(resultado);
		});
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});

//quitar usuario a proyecto//
router.delete('/usuarioProyectoQuitar/:id/:idProyecto', function(req,res,next){
	try{
		var resultado=[];
		models.UsuarioProyecto.destroy({where: {ProyectoId: req.params.idProyecto, UsuarioId: req.params.id}
		}).then(function (usuarioproyecto){
			resultado.push(usuarioproyecto);
			res.json(resultado);
		});
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});

///////////////////////////////////////////////////
//////////////////////////////////////////////////

//modificar llamadas//
router.put('/llamada/:id', function(req,res,next){
	try{
		if(req.body.nuevoEstado) {
			models.Contacto.findOne({
				where: {
					ProyectoId: req.params.id,
					ContactoId: req.body.idcontacto
				}
			}).then(function (llamada) {
				//for(var x=0;x<user.length;x++){
				//console.log(user.username);
				llamada.updateAttributes({
					estadoDeLlamada: req.body.nuevoEstado,
				}).then(function (result) {
					res.json(result);
				})
			})
		}else{
			res.json(result);
		}
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});

////////////////////////////////////////////////////////

//borrar contactos de un proyecto determinado//
router.delete('/contacto/:idProyecto', function(req,res,next){
	try{
		models.Contacto.destroy({where: {ProyectoId: req.params.idProyecto} }).then(function () {
			return models.Contacto.findAll().then(function (contacto) {
				res.json(contacto);
			})
		})
	}
	catch(ex){
		return next(ex);
	}
});

//cargar base de datos//
router.post('/Cargar_base_de_datos/:id',function (req,res,next) {
	try{
		var resultado=[];
		var csv = require('ya-csv');
		var i = 0
		var data = []
		var reader = csv.createCsvFileReader("./conection/" + req.body.nombreArchivo);
		reader.on('data', function (rec) {
			if (i != 0) {
				models.Contacto.create({
					nombre: rec[0],
					apellido: rec[1],
					numero: rec[2],
					estadoDeLlamada: rec[3],
					ProyectoId: req.params.id
				}).then(function (contacto) {
					resultado.push(contacto);
				});
			}
			i++;

		}).on('end', function () {
			res.json(resultado);
		});
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});

//GET contactos, obtener contactos al azar
router.get('/contacto/:id', function(req, res, next) {
	try {
		models.Contacto.findAll({where: {ProyectoId: req.params.id, estadoDeLlamada: "no"}}).then(function (user) {
			var resultado = []
			if(user != 0) {
				var aleatorio = Math.round(Math.random() * ((user.length) - 1))
				resultado.push(user[aleatorio])
				res.json(resultado);
			}else{
				resultado.push("no hay contactos")
				res.json(resultado);
			}

		});
		//res.render('VerUsuario.html', {title: 'Listar Usuarios'});
	} catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});

//GET de usuarios que no estan en el proyecto correspondiente
router.get('/usuario/:idProyecto', function(req, res, next) {
	try {
		var resultado = []
		models.UsuarioProyecto.findAll({where: {ProyectoId: req.params.idProyecto}})
			.then(function (user) {
				try{
					user.length;
					for(var x = 0; x < user.length; x++){
						resultado.push(user[x].dataValues.UsuarioId)
					}
					models.Usuario.findAll({where: {id: {$notIn: resultado}}}).then(function (usuarios) {
						res.json(usuarios)
					})
				}
				catch(ex){
					res.json(resultado)
				}
			})
	} catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});

//GET de usuarios que estan en el proyecto correspondiente
router.get('/usuarioQuitar/:idProyecto', function(req, res, next) {
	try {
		var resultado = []
		models.UsuarioProyecto.findAll({where: {ProyectoId: req.params.idProyecto}})
			.then(function (user) {
				try{
					user.length;
					for(var x = 0; x < user.length; x++){
						if(user[x].dataValues.UsuarioId != req.user.id) {
							resultado.push(user[x].dataValues.UsuarioId)
						}
					}
					models.Usuario.findAll({where: {id: {$in: resultado}}}).then(function (usuarios) {
						res.json(usuarios)
					})
				}
				catch(ex){
					res.json(resultado)
				}
			})
	} catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});