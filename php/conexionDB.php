<?php

function getConexionDB(){

    $conexion = new mysqli("localhost", "root", "", "bio2");
    
    if (!$conexion) {
        echo "error al conecatar la base de datos";
        exit;
    }

    return $conexion;
}