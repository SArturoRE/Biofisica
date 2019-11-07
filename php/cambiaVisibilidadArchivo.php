<?php
require "conexionDB.php";
$conexion = getConexionDB();


$data = json_decode(json_encode($_POST), true);

$visibilidad = $data["visibilidad"];
$idMaterialDidactico = $data["idMaterialDidactico"];

$query = "
update materialDidactico
set estadoVisibilidad='$visibilidad'
where idMaterialDidactico=$idMaterialDidactico";

echo $query;

$result = $conexion->query($query);

$conexion->close();