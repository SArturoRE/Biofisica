<?php
require "conexionDB.php";
$conexion = getConexionDB();


$query = "
    select idMaterialDidactico,estadoVisibilidad
    from materialDidactico
";

$result = $conexion->query($query);
$data = [];
while(($row = $result->fetch_assoc())) {
    $data[$row["idMaterialDidactico"]] = $row["estadoVisibilidad"];
}

echo json_encode($data);

$result->free();
$conexion->close();
