<?php

require "conexionDB.php";
$conexion = getConexionDB();

$data = json_decode(file_get_contents("php://input"), true);

$idExamen = $data["idExamen"];

$query = "
    select t1.idPregunta,descripcion, r1, r2, r3, respuestaCorrecta
    from pregunta t1
    inner join examen t2
    on t2.idExamen=$idExamen
    inner join examen_pregunta t3
    on t3.idExamen=t2.idExamen
    where t1.idPregunta=t3.idPregunta
";

$result = $conexion->query($query);

$responseData = [];

while(($row = $result->fetch_assoc())){
    array_push($responseData, $row);
}

echo json_encode($responseData);