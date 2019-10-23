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

$query = "
    select idMaterialDidactico,nombre,tipo,rutaServidor,estadoVisibilidad
    from materialDidactico
";

$result = $conexion->query($query);
$datos = [];

while (($row = $result->fetch_assoc())) {
    array_push($datos, $row);
}

echo json_encode($datos);
