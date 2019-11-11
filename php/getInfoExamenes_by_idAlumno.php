<?php
require "conexionDB.php";
$conexion = getConexionDB();

// $data = json_decode(file_get_contents("php://input"),true);
$data = json_decode($_GET["data"], true);
$idAlumno = $data["idAlumno"];

$dataResponse["porAplicar"] = [];
$dataResponse["enAplicacion"] = [];
$dataResponse["aplicados"] = [];

$query = "
    select t5.idExamen,nomSeccion,t5.duracion,t5.fechaAplicacion,t5.fechaLimiteAplicacion, concat(nombre,' ', apellidoP) as nomProfesor
    from seccion t1
    inner join alumno_seccion t2
    on t1.idSeccion=t2.idSeccion
    inner join alumno t3
    on t2.matricula=t3.matricula
    inner join examen_seccion t4
    on t1.idSeccion=t4.idSeccion
    inner join examen t5
    on t5.idExamen=t4.idExamen and t5.fechaAplicacion>DATE_FORMAT(NOW(),'%Y/%m/%d %H:%i:%s')
    inner join profesor t6
    on t1.numTrabajador=t6.numTrabajador
    inner join usuario t7
    on t6.idUsuario=t6.idUsuario
    where t3.matricula=$idAlumno
";

$result = $conexion->query($query);
// echo $query;
// print_r($conexion->error);

while (($row = $result->fetch_assoc())) {
    array_push($dataResponse["porAplicar"], $row);
}
$result->free();

$query = "
    select t5.idExamen,nomSeccion,t5.duracion,t5.fechaAplicacion,t5.fechaLimiteAplicacion, concat(nombre, apellidoP) as nomProfesor
    from seccion t1
    inner join alumno_seccion t2
    on t1.idSeccion=t2.idSeccion
    inner join alumno t3
    on t2.matricula=t3.matricula
    inner join examen_seccion t4
    on t1.idSeccion=t4.idSeccion
    inner join examen t5
    on t5.idExamen=t4.idExamen
    and t5.fechaAplicacion<DATE_FORMAT(NOW(),'%Y/%m/%d %H:%i:%s')
    and t5.fechaLimiteAplicacion>DATE_FORMAT(NOW(),'%Y/%m/%d %H:%i:%s')
    inner join profesor t6
    on t1.numTrabajador=t6.numTrabajador
    inner join usuario t7
    on t6.idUsuario=t6.idUsuario
    where t3.matricula=$idAlumno
";

$result = $conexion->query($query);
// echo $query;
// print_r($conexion->error);

while (($row = $result->fetch_assoc())) {
    array_push($dataResponse["enAplicacion"], $row);
}
$result->free();

$query = "
    select t5.idExamen,nomSeccion,t5.duracion,t5.fechaAplicacion,t5.fechaLimiteAplicacion, concat(nombre, apellidoP) as nomProfesor
    from seccion t1
    inner join alumno_seccion t2
    on t1.idSeccion=t2.idSeccion
    inner join alumno t3
    on t2.matricula=t3.matricula
    inner join examen_seccion t4
    on t1.idSeccion=t4.idSeccion
    inner join examen t5
    on t5.idExamen=t4.idExamen and t5.fechaLimiteAplicacion<DATE_FORMAT(NOW(),'%Y/%m/%d %H:%i:%s')
    inner join profesor t6
    on t1.numTrabajador=t6.numTrabajador
    inner join usuario t7
    on t6.idUsuario=t6.idUsuario
    where t3.matricula=$idAlumno
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
