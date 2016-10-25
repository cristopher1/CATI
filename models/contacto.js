/**
 * Created by crisj on 18-10-2016.
 */
"use strict";

var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var Contacto = sequelize.define("Contacto", {

        nombre: DataTypes.STRING,
        apellido: DataTypes.STRING,
        numero: DataTypes.STRING,
        estadoDeLlamada: DataTypes.STRING,
    }, {
        classMethods: {
            associate: function(models) {
                Contacto.belongsTo(models.Proyecto,{
                    onDelete: "CASCADE",
                    foreignkey:{
                        allowNull:false
                    }
                })
            }
        }
    });
    return Contacto;
};