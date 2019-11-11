<?php
require "conexionDB.php";
$conexion = getConexionDB();

$data = json_decode(file_get_contents("php://input"), true);

$idProfesor = $data["idProfesor"];
$SeccionExamen = $data["SeccionExamen"];
$DuracionExamen = $data["DuracionExamen"];
$FechaAplicacionExamen = $data["FechaAplicacionExamen"];
$FechaLimiteAplicacionExamen = $data["FechaLimiteAplicacionExamen"];
$NumPreguntas = $data["NumPreguntas"];
$Unidad = $data["Unidad"];


// agrega la informacion del examen a la base de datos

$key = "addExamen('$DuracionExamen', '$FechaAplicacionExamen', '$FechaLimiteAplicacionExamen')";
$query = "select $key";
$result = $conexion->query($query);
$res = $result->fetch_assoc();
$idExamen = $res[$key];


// verifica si la seccion existe, de lo contrario elimina el examen creado anteriormente

$key = "addExamenSeccion($idExamen,'$SeccionExamen',$idProfesor)";
$query = "select $key";
$result = $conexion->query($query);
$res = $result->fetch_assoc();
$info = json_decode($res[$key], true);

if(isset($info["error"])){
    echo json_encode($info);
    exit;
}


// obtiene $NumPreguntas aleatorias del banco de preguntas

$query = "
    select idPregunta from pregunta where unidad=$Unidad order by rand() limit $NumPreguntas
";

$result = $conexion->query($query);
print_r($conexion->error);

$query = "insert into examen_pregunta(idExamen, idPregunta) values";
while(($row = $result->fetch_assoc())){
    $idPregunta = $row["idPregunta"];
    $query .= "($idExamen, $idPregunta),";
}

$result->free();


$query = rtrim($query,",");
$result = $conexion->query($query);

$response["idExamen"] = $idExamen;
$response["nomSeccion"] = $SeccionExamen;
$response["duracion"] = $DuracionExamen;
$response["fechaAplicacion"] = $FechaAplicacionExamen;
$response["fechaLimiteAplicacion"] = $FechaLimiteAplicacionExamen;

echo json_encode($response);

$conexion->close();