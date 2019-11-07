<?php 

require "conexionDB.php";
$conexion = getConexionDB();

$idMaterialDidactico = $_POST["idMaterialDidactico"];

$query = "select removeMaterialDidactico($idMaterialDidactico)";

$result = $conexion->query($query);

$result->free();
$conexion->close();
