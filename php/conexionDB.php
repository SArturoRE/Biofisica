<?php

function getConexionDB(){

    $conexion = new mysqli("localhost", "xDB", "15628311.xMariaDB", "biofisicaDB");
    
    if (!$conexion) {
        echo "error al conecatar la base de datos";
        exit;
    }

    return $conexion;
}