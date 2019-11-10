<?php

require "conexionDB.php";

$datosUsuario = json_decode(file_get_contents("php://input"), true);

$password_Temp = $datosUsuario["PasswordConfirm"];
$password = $datosUsuario["Password"];

if ($password_Temp != $password) {
    $response_to_usuario["error"] = "verifica las contraseñas ingresadas";
    echo json_encode($response_to_usuario);
    exit;
}

$conexion = getConexionDB();

$nombre = trim($datosUsuario["Nombre"]);
$apellidoM = trim($datosUsuario["ApellidoM"]);
$apellidoP = trim($datosUsuario["ApellidoP"]);
$grupo = trim($datosUsuario["Grupo"]);
$secciones = str_replace(" ", "", $datosUsuario["Secciones"]);
$secciones = explode(",", $secciones);

if (isset($datosUsuario["Matricula"])) {

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
$info = json_decode($info[$key], true);
$result->free();

if (isset($info["error"])) {
    echo json_encode($info);
    $conexion->close();
    exit;
}
$info["error"] = "";

if (isset($datosUsuario["Matricula"])) {
    foreach ($secciones as $seccion) {
        $key = "addAlumnoSeccion($matricula,'$seccion')";
        $query = "select $key";
        $result = $conexion->query($query);
        $res = $result->fetch_assoc();
        $res = json_decode($res[$key], true);
        if (isset($res["error"])) {
            $info["error"] .= "<br>" . $res["error"];
        }
    }
} else {
    foreach ($secciones as $seccion) {
        $key = "addSeccion($numTrabajador,'$seccion')";
        $query = "select $key";
        $result = $conexion->query($query);
        $res = $result->fetch_assoc();
        $res = json_decode($res[$key], true);
        if (isset($res["error"])) {
            $info["error"] .= "<br>" . $res["error"];
        }
    }
}

echo json_encode($info);
$conexion->close();
