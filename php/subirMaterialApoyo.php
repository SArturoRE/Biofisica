<?php

require "conexionDB.php";
$conexion = getConexionDB();

if ($conexion->connect_errno) {

    $data["error"] = "Fallo al conectarse a MySQL";
    $data["#"] = $mysqli->connect_errno;
    $data["descripcion"] = $mysqli->connect_error;

    echo json_encode($data);
    exit;
}

date_default_timezone_set("America/Mexico_City");
$date_time = date("dmY_His");

$tipo = $_POST["tipo"];
$rutaServidor = ".";
$estadoVisibilidad = "visible";
$name = $_FILES["filePDF"]["name"];
$tmp_name = $_FILES["filePDF"]["tmp_name"];

$name = substr($name, 0, strrpos($name, ".")) . "_" . $date_time . substr($name, strrpos($name, "."), strlen($name));

$rutaCarpeta = "../materialApoyo/";
if (!move_uploaded_file($tmp_name, $rutaCarpeta . $name)) {
    echo "Error al copiar $name...\n";
    exit;
}
$query = "select agrega_materialDidactico('$name','$tipo','$rutaServidor','$estadoVisibilidad')";
$result = $conexion->query($query);

$idMaterialDidactico = $result->fetch_assoc();

$response["name"] = $name;
$response["tipo"] = $tipo;
$response["idMaterialDidactico"] = $idMaterialDidactico;
echo json_encode($response);