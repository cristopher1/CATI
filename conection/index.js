/**
 * Created by crisj on 07-09-2016.
 **/
//buscar informacion sobre formidable, ya que por lo visto no se podran usar las funciones que se  crearan en esta parte
//hasta que se guarde el archivo en la carpeta del proyecto
'use strict';
var fs = require('fs');
var csv = require('ya-csv');
var leer;
module.exports = function cargar_base_de_datos(nombre) {
        if(fs.exists('hhh.csv')){
            leer = csv.createCsvFileReader(nombre);
            return true;
        }
        else{
            return  false;
        }
    };

