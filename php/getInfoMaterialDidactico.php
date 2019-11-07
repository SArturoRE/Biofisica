<?php

require "conexionDB.php";
$conexion = getConexionDB();

$datos = json_decode(file_get_contents("php://input"), true);

$tipoUsuario = $datos["tipoUsuario"];

$query = "
    select idMaterialDidactico,nombre,tipo,rutaServidor,estadoVisibilidad
    from materialDidactico
";

if($tipoUsuario == "Alumno"){
    $query .= " where estadoVisibilidad='visible'";
}


$result = $conexion->query($query);
$datos = [];

while (($row = $result->fetch_assoc())) {
    array_push($datos, $row);
}

echo json_encode($datos);

$result->free();
$conexion->close();
