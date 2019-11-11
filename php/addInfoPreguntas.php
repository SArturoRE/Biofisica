<?php

require "conexionDB.php";
$conexion = getConexionDB();

$datosPreguntas = json_decode(file_get_contents("php://input"), true);

$temp = array_shift($datosPreguntas);
$idProfesor = $temp["idProfesor"];
$preguntasParaExamen = $temp["PreguntasParaExamen"];
$seccion = $temp["SeccionExamen"];
$duracionExamen_input = $temp["DuracionExamen"];
$fechaAplicacionExamen_input = $temp["FechaAplicacionExamen"];
$fechaLimiteAplicacionExamen_input = $temp["FechaLimiteAplicacionExamen"];

if ($preguntasParaExamen == "1") {
    $key = "addExamen(
        '$duracionExamen_input',
        '$fechaAplicacionExamen_input',
        '$fechaLimiteAplicacionExamen_input'
    )";
    $query = "select $key";
    $result = $conexion->query($query);

    $res = $result->fetch_assoc();
    $idExamen = $res[$key];

    $key = "addExamenSeccion($idExamen, '$seccion', $idProfesor)";
    $query = "select $key";
    $result = $conexion->query($query);
    print_r($conexion->error);
    $res = $result->fetch_assoc();
    $info = json_decode($res[$key], true);
    if (isset($info["error"])) {
        echo json_encode($info);
        exit;
    }

}

foreach ($datosPreguntas as $datosPregunta) {
    $descripcion = $datosPregunta["Descripcion"];
    $respuestaCorrecta = $datosPregunta[$datosPregunta["RespuestaCorrecta"]];
    unset($datosPregunta[$datosPregunta["RespuestaCorrecta"]]);
    $unidad = $datosPregunta["Unidad"];

    if (!isset($datosPregunta["A"])) {

        $r1 = $datosPregunta["B"];
        $r2 = $datosPregunta["C"];
        $r3 = $datosPregunta["D"];
    } else if (!isset($datosPregunta["B"])) {

        $r1 = $datosPregunta["A"];
        $r2 = $datosPregunta["C"];
        $r3 = $datosPregunta["D"];
    } else if (!isset($datosPregunta["C"])) {

        $r1 = $datosPregunta["A"];
        $r2 = $datosPregunta["B"];
        $r3 = $datosPregunta["D"];
    } else if (!isset($datosPregunta["D"])) {

        $r1 = $datosPregunta["A"];
        $r2 = $datosPregunta["B"];
        $r3 = $datosPregunta["C"];
    }

    if ($preguntasParaExamen == "1") {
        $key = "addExamenPregunta($idExamen,";
    } else {
        $key = "addPregunta(";
    }
    $key .= "'$descripcion', '$r1', '$r2', '$r3', '$respuestaCorrecta', $unidad)";

    $query = "select $key";
    $result = $conexion->query($query);
}

$info = [];
echo json_encode($info);

$conexion->close();
