<?php
require "conexionDB.php";
$conexion = getConexionDB();

// $data = json_decode(file_get_contents("php://input"),true);
$data = json_decode($_GET["data"], true);
$idProfesor = $data["idProfesor"];

$dataResponse["porAplicar"] = [];
$dataResponse["enAplicacion"] = [];
$dataResponse["aplicados"] = [];

$query = "
    select t3.idExamen,nomSeccion,t3.duracion,t3.fechaAplicacion,t3.fechaLimiteAplicacion
    from seccion t1
    inner join examen_seccion t2
    on t1.idSeccion=t2.idSeccion
    inner join examen t3
    on t3.idExamen=t2.idExamen and t3.fechaAplicacion>DATE_FORMAT(NOW(),'%Y/%m/%d %H:%i:%s')
    where numTrabajador=$idProfesor
";

$result = $conexion->query($query);
// echo $query;
// print_r($conexion->error);

while(($row = $result->fetch_assoc())){
    array_push($dataResponse["porAplicar"], $row);
}
$result->free();

$query = "
    select t3.idExamen,nomSeccion,t3.duracion,t3.fechaAplicacion,t3.fechaLimiteAplicacion
    from seccion t1
    inner join examen_seccion t2
    on t1.idSeccion=t2.idSeccion
    inner join examen t3
    on t3.idExamen=t2.idExamen
    and t3.fechaAplicacion<DATE_FORMAT(NOW(),'%Y/%m/%d %H:%i:%s')
    and t3.fechaLimiteAplicacion>DATE_FORMAT(NOW(),'%Y/%m/%d %H:%i:%s')
    where numTrabajador=$idProfesor
";

$result = $conexion->query($query);
// echo $query;
// print_r($conexion->error);

while (($row = $result->fetch_assoc())) {
    array_push($dataResponse["enAplicacion"], $row);
}
$result->free();

$query = "
    select t3.idExamen,nomSeccion,t3.duracion,t3.fechaAplicacion,t3.fechaLimiteAplicacion
    from seccion t1
    inner join examen_seccion t2
    on t1.idSeccion=t2.idSeccion
    inner join examen t3
    on t3.idExamen=t2.idExamen and t3.fechaLimiteAplicacion<DATE_FORMAT(NOW(),'%Y/%m/%d %H:%i:%s')
    where numTrabajador=$idProfesor
";

$result = $conexion->query($query);
// echo $query;
// print_r($conexion->error);

while (($row = $result->fetch_assoc())) {
    array_push($dataResponse["aplicados"], $row);
}
$result->free();


echo json_encode($dataResponse);

$conexion->close();