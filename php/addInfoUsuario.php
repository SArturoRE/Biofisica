<?php

require "conexionDB.php";
$conexion = getConexionDB();

$datosUsuario = json_decode(file_get_contents("php://input"), true);

if ($conexion->connect_errno) {

    $data["error"] = "Fallo al conectarse a MySQL"; 
    $data["#"] = $mysqli->connect_errno; 
    $data["descripcion"] = $mysqli->connect_error;

    echo json_encode($data);
    exit;
}

$nombre = $datosUsuario["Nombre"];
$apellidoM = $datosUsuario["ApellidoM"];
$apellidoP = $datosUsuario["ApellidoP"];
$password = $datosUsuario["Password"];
$grupo = $datosUsuario["Grupo"];

if ( isset($datosUsuario["Matricula"]) ) {

    $matricula = $datosUsuario["Matricula"];
    $key = "agregaAlumno(
        '$nombre',
        '$apellidoM',
        '$apellidoP',
        '$password',
        '$grupo',
        '$matricula'
    )";
    $query = "select $key";
} else {
    
    $numTrabajador = $datosUsuario["numTrabajador"];
    $key = "agregaProfesor(
        '$nombre',
        '$apellidoM',
        '$apellidoP',
        '$password',
        '$grupo',
        '$numTrabajador'
    )";
    $query = "select $key";
}

$result = $conexion->query($query);
$info = $result->fetch_assoc();

echo json_encode($info[$key]);

$result->free();
$conexion->close();