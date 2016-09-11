/**
 * Created by famancil on 23-08-16.
 */
var app = angular.module("myApp",[]);

app.controller("myCtrl", function($scope,$http) {
    $scope.title="Listar Usuario";
    $scope.title2="Registrar Usuario";
    $scope.formData = {};
    //$scope.session = Session;
    /*$scope.firstName = "John";
    $scope.lastName= "Doe";*/
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
                console.log(data);
            })
            .error(function(data) {
                console.log('Error:' + data);
            });
    };
    $scope.deleteUsuario = function(id) {
        $http.delete('/api/usuarios/' + id)
            .success(function(data) {
                $scope.todos = data;
                alert("se han eliminado los datos correctamente");
                console.log(data);
            })
            .error(function(data) {
                alert("no se pudieron eliminar los datos");
                console.log('Error:' + data);
            });

    };

    //probar esta funcion
    $scope.modificarUsuario = function(id) {
        $http.put('/api/usuarios/', $scope.formData)
            .success(function() {
                alert("se han guardado los datos correctamente");
            })
            .error(function(data) {
                console.log('Error:' + data);
                alert("no se pudieron guardar los datos");
            });
    };

});

app.controller("conecction_excel", function ($scope, $http) {

    //hay que tener en cuenta que get sirve para recibir respuestas desde el servidor al usuario
    // post sirve para enviar consultas(informacion) del usuario al servidor

    // por eso los formularios usan metodo post, se puede hacer get tambien, pero el post fue diseñado para esa tarea en particular

    $scope.my_database = {};
    $scope.crear_coneccion = function () {
        //$http.post('/api/Cargar_base_de_datos');
        var respuesta = $http.post('/api/Cargar_base_de_datos', $scope.my_database);
        respuesta.success(function (respuesta) {
            if(respuesta){
                alert("se ha cargado la base de datos exitosamente");
            }
            else{
                alert("error al cargar la base de datos");
            }
        });
    }
});





/*app.controller("mysCtrl", function($scope,$http) {
    //$scope.title = "Listar Usuario";
    $scope.title2 = "Registrar Usuario";
});*/