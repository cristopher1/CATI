/**
 * Created by famancil on 23-08-16.
 */
var app = angular.module("myApp",[]);

app.directive('miArchivo', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {
                iElement.on("change",function (e) {
                    $parse(iAttrs.miArchivo).assign(scope,iElement[0].files[0]);
                })
            }
        };
    })

app.controller("myCtrl", function($scope,$http) {
    $scope.seleccionado = "verProyectos";
    $scope.title="Listar Usuario";
    $scope.title2="Registrar Usuario";
    $scope.formData = {};
    $scope.miarchivo;

    $http.get('/api/usuarios')
        .success(function(data) {
            $scope.users = data;
            console.log(data)
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.crearUsuario = function(){
        $http.post('/api/usuarios', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.todos = data;
                if(data.length > 1){
                    alert("Se a creado usuario correctamente")
                    location.href = "crearUsuario"
                }
                else{
                    alert(data[0])
                }
                console.log(data);
            })
            .error(function(data) {
                alert("No se pudo crear usuario");
                console.log('Error:' + data);
            });
    };
    $scope.deleteUsuario = function(id) {
        $http.delete('/api/usuarios/' + id)
            .success(function(data) {
                $scope.todos = data;
                alert("se han eliminado los datos correctamente");
                location.href = "verUsuario"
                console.log(data);
            })
            .error(function(data) {
                alert("no se pudieron eliminar los datos");
                console.log('Error:' + data);
            });
    };

    $scope.modificarUsuario = function(id) {
        $http.put('/api/usuarios/', $scope.formData)
            .success(function(resultado) {
                if(resultado != 0) {
                    alert("se han guardado los datos correctamente");
                    location.href = "modificar_usuario"
                }else{
                    alert("datos incompletos")
                }
            })
            .error(function(data) {
                console.log('Error:' + data);
                alert("no se pudieron guardar los datos");
            });
    };

    $http.get('/api/proyectos')
        .success(function(data) {
            $scope.proyecto = data;
            console.log(data)
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.crearProyecto = function(){
        $http.post('/api/proyectos', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.todos = data;
                if(data.length > 1) {
                    alert("Proyecto creado exitosamente")
                    location.href = "crear_proyecto"
                }else{
                    alert(data[0])
                }
                console.log(data);
            })
            .error(function(data) {
                alert("Error al intentar crear el proyecto")
                console.log('Error:' + data);
            });
    };
    $scope.deleteProyecto = function(id) {
        $http.delete('/api/proyectos/' + id)
            .success(function(data) {
                $scope.todos = data;
                alert("se ha eliminado el proyecto correctamente");
                location.href = "listar_proyecto"
                console.log(data);
            })
            .error(function(data) {
                alert("no se pudo eliminar el proyecto");
                console.log('Error:' + data);
            });
    };

    $scope.seleccionar = function(id, opcion){
        localStorage.setItem("IdProyecto", id)
        if(opcion == 'agregar'){
            location.href = "agregar_usuario"
        }
        else if(opcion == 'quitar'){
            location.href = "quitar_usuario"
        }
        else {
            location.href = "modificar_proyecto"
        }
    };

    $scope.ingresar = function (id) {
        localStorage.setItem("IdProyecto", id)
        location.href = "menu"
    }

    $scope.modificarProyecto = function() {
        $scope.idProyecto = localStorage.getItem("IdProyecto")
        $http.put('/api/proyectos/' + $scope.idProyecto, $scope.formData)
            .success(function(data) {
                if(data.length != 0){
                    alert("se han guardado los datos correctamente");
                    location.href = "listar_proyecto"
                }else{
                    alert("datos incompletos")
                }

            })
            .error(function(data) {
                console.log('Error:' + data);
                alert("no se pudieron guardar los datos");
            });

    };

    $scope.agregarAProyecto = function (id) {
        $scope.formData.idProyecto = localStorage.getItem("IdProyecto")
        $http.post('/api/usuarioProyecto/' + id, $scope.formData)
            .success(function (data) {
                $scope.formData = {};
                $scope.todos = data;
                alert("Se ha agregado el usuario al proyecto exitosamente")
                location.href = "agregar_usuario"
                console.log(data);
            })
            .error(function (data) {
                alert("Error al intentar agregar usuario al proyecto")
                console.log('Error:' + data);
            });
    }

    $scope.quitarDelProyecto = function (id) {
        $scope.formData.idProyecto = localStorage.getItem("IdProyecto")
        $http.delete('/api/usuarioProyectoQuitar/' + id +'/' + $scope.formData.idProyecto)
            .success(function (data) {
                $scope.formData = {};
                $scope.todos = data;
                alert("Se ha quitado el usuario del proyecto exitosamente")
                location.href = "quitar_usuario"
                console.log(data);
            })
            .error(function (data) {
                alert("Error al intentar quitar usuario al proyecto")
                console.log('Error:' + data);
            });
    }

    $scope.seleccionarUsuario = function (id) {
        localStorage.setItem("IdUsuario", id);
        location.href = "modificar"
    }

    $scope.seleccionarArchivo = function() {
        localStorage.setItem("nombreArchivo", $scope.miarchivo.name)
    }

    $scope.cargarBase = function () {
        $scope.id = localStorage.getItem("IdProyecto")
        $scope.formData.nombreArchivo = localStorage.getItem("nombreArchivo")

        //como cada proyecto tiene solo una base de datos si el administrador agrega una nueva base de datos, la anterior es eliminada//
        $http.delete("/api/contacto/" + $scope.id);
        $http.post('/api/Cargar_base_de_datos/' + $scope.id, $scope.formData)
            .success(function (data) {
                alert("base de datos cargada exitosamente");
                location.href = "cargar_base_de_datos"
            })
            .error(function (data) {
                alert("error al cargar base de datos");
            });
    }

    $scope.Llamar = function (numero,id){
        localStorage.setItem("IdContacto", id);
        localStorage.setItem("llamadaRealizada",true);
        //Skype.ui({
          //  name: "call",
            //element: "call_32",
        //    participants: ["+569"+numero]
        //});
        //Skype.tryAnalyzeSkypeUri('call', '0');
        location.href = "skype:"+"+569"+numero+"?call";
        //document.getElementById("call_32").innerHTML = "";
    }

    $scope.modificarEstado = function() {
        $scope.formData.idcontacto = localStorage.getItem("IdContacto");
        $scope.formData.RealizarLlamada = localStorage.getItem("llamadaRealizada");
        $scope.id = localStorage.getItem("IdProyecto");
        $http.put('/api/llamada/' + $scope.id, $scope.formData)
            .success(function(resultado) {
                location.href = "Llamar"
                alert(resultado);
                if(resultado[0] != "no ha ingresado datos"){
                }
            })
            .error(function(data) {
                console.log('Error:' + data);
                alert("no se pudieron guardar los datos");
            });
    };

    $http.get('/api/usuario/' + localStorage.getItem("IdProyecto"))
        .success(function(data) {
            $scope.usuarios = data;
            console.log(data)
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $http.get('/api/contacto/' + localStorage.getItem("IdProyecto"))
        .success(function(data) {
            $scope.contactos = data;
            console.log(data)
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $http.get('/api/usuarioQuitar/' + localStorage.getItem("IdProyecto"))
        .success(function(data) {
            $scope.usuarioAQuitar = data;
            console.log(data)
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $http.get('/api/permisos')
        .success(function(data) {
            $scope.permisos = data;
            console.log(data)
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

});
