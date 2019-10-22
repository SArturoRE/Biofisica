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

$idMaterialDidactico = $_POST["idMaterialDidactico"];

$query = "select removeMaterialDidactico($idMaterialDidactico)";

$result = $conexion->query($query);