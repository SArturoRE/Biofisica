<?php

require "conexionDB.php";
$conexion = getConexion();

$datosUsuario = [];

if ($conexion->connect_errno) {

    echo "Error: Fallo al conectarse a MySQL debido a: \n";
    echo "Errno: " . $mysqli->connect_errno . "\n";
    echo "Error: " . $mysqli->connect_error . "\n";

    exit;
}

$conexion->close();
