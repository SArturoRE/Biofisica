<?php

require "conexionDB.php";

$datosUsuario = json_decode(file_get_contents("php://input"), true);

$password_Temp = $datosUsuario["PasswordConfirm"];
$password = $datosUsuario["Password"];

if ($password_Temp != $password){
    $response_to_usuario["error"] = "verifica las contraseñas ingresadas";
    echo json_encode($response_to_usuario);
    exit;
}

$conexion = getConexionDB();

$nombre = $datosUsuario["Nombre"];
$apellidoM = $datosUsuario["ApellidoM"];
$apellidoP = $datosUsuario["ApellidoP"];
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

echo json_encode(json_decode($info[$key]));

$result->free();
$conexion->close();