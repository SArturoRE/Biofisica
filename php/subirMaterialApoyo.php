<?php

require "conexionDB.php";
$conexion = getConexionDB();

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
echo "terminado";

$query = "select agrega_materialDidactico('$name','$tipo','$rutaServidor','$estadoVisibilidad')";
$result = $conexion->query($query);