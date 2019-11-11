<?php

require "conexionDB.php";
$conexion = getConexionDB();

$data = json_decode(file_get_contents("php://input"), true);

$temp = array_shift($data);
$idAlumno = $temp["idAlumno"];
$idExamen = $temp["idExamen"];

$query = "
    insert into historialRespuestas(matricula, idPregunta, respuestaSeleccionada)
    values
";
$numPreguntas = 0;
foreach($data as $preguntaInfo){
    $numPreguntas++;
    $idPregunta = $preguntaInfo['idPregunta'];
    
    $respuestaSeleccionada = $preguntaInfo['respuestaSeleccionada'];
    $query .= "($idAlumno, $idPregunta, '$respuestaSeleccionada'),";
}

$query = rtrim($query, ",");
$result = $conexion->query($query);

$query = "
    select count(t1.idPregunta) as numRespuestasCorrectas
    from pregunta t1
    inner join alumno t2
    on t2.matricula=$idAlumno
    inner join examen t3
    on t3.idExamen=$idExamen
    inner join examen_pregunta t4
    on t4.idExamen=t3.idExamen
    inner join historialRespuestas t5
    on t1.idPregunta=t5.idPregunta and t5.matricula=t2.matricula
    where t1.idPregunta=t4.idPregunta and t5.respuestaSeleccionada=t1.respuestaCorrecta
";

$result = $conexion->query($query);
print_r($conexion->error);
$numRespuestasCorrectas = $result->fetch_assoc();

$responseData["numPreguntas"] = $numPreguntas;
$responseData["numRespuestasCorrectas"] = $numRespuestasCorrectas["numRespuestasCorrectas"];

echo json_encode($responseData);

$result->free();
$conexion->close();