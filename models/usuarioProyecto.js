/**
 * Created by crisj on 15-10-2016.
 */

"use strict";
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var UsuarioProyecto = sequelize.define("UsuarioProyecto", {
    }, {
        classMethods: {
            associate: function(models) {
                UsuarioProyecto.belongsTo(models.Proyecto,{
                    onDelete: "CASCADE",
                    foreignKey:{
                        allowNull: false
                    }
                }),
                UsuarioProyecto.belongsTo(models.Usuario,{
                    onDelete: "CASCADE",
                    foreignKey:{
                        allowNull: false
                    }
                });
            }
        }
    });

    return UsuarioProyecto;
};