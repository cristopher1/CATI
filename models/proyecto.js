/**
 * Created by famancil on 21-08-16.
 */
"use strict";
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var Proyecto = sequelize.define("Proyecto", {
        nombreProyecto: DataTypes.STRING,
        urlEncuesta: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Proyecto.belongsToMany(models.Usuario,{
                    through: "UsuarioProyecto"
                }),
                Proyecto.hasMany(models.Contacto)
            }
        }
});
    return Proyecto;
};
