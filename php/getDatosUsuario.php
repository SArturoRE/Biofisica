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

if ( isset($datosUsuario["Matricula"]) ) {

    $matricula = $datosUsuario["Matricula"];
    $id = $matricula;
    $key = "alumnoRegistrado($matricula)";
    $query = "select $key";
} else {
    
    $numTrabajador = $datosUsuario["numTrabajador"];
    $key = "profesorRegistrado($numTrabajador)";
    $query = "select $key";
}

$result = $conexion->query($query);

$cad = $result->fetch_assoc();
echo json_encode(json_decode($cad[$key]));

$result->free();
$conexion->close();
