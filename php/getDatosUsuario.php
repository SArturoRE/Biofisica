<?php

require "conexionDB.php";
$conexion = getConexionDB();

$datosUsuario_Temp = json_decode(file_get_contents("php://input"), true);

if ( isset($datosUsuario_Temp["Matricula"]) ) {

    $matricula = $datosUsuario_Temp["Matricula"];
    $id = $matricula;
    $key = "alumnoRegistrado($matricula)";
    $query = "select $key";
} else {
    
    $numTrabajador = $datosUsuario_Temp["numTrabajador"];
    $key = "profesorRegistrado($numTrabajador)";
    $query = "select $key";
}

$result = $conexion->query($query);

$cad = $result->fetch_assoc();

$response_to_client = json_decode($cad[$key], true);

$passwordUser = $response_to_client["password"];
$passwordUser_Temp = $datosUsuario_Temp["Password"];
if ($passwordUser != $passwordUser_Temp){
    $response_to_client = [];
    $response_to_client["error"] = "contraseña incorrecta";
}
echo json_encode($response_to_client);

$result->free();
$conexion->close();
