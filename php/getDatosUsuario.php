<?php

require "conexionDB.php";
$conexion = getConexionDB();

$datosUsuario = json_decode(file_get_contents("php://input"), true);

if ($conexion->connect_errno) {

    echo "Error: Fallo al conectarse a MySQL debido a: \n";
    echo "Errno: " . $mysqli->connect_errno . "\n";
    echo "Error: " . $mysqli->connect_error . "\n";

    exit;
}

$conexion->close();

echo json_encode($datosUsuario);