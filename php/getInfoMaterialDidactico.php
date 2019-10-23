<?php

require "conexionDB.php";
$conexion = getConexionDB();

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
