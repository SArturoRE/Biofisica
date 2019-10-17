<?php
include 'conexion.php';
//recibe los datos del formularo en las variables
$mat = $_POST["matricula"];
$nom = $_POST["nombre"];
$app = $_POST["app"];
$apm = $_POST["apm"];
$pass = $_POST["pass"];
$grup = $_POST["grup"];

echo $mat . "esta es la matricula";
//es la consulta que inserta los valores en la bd
$insertar = "INSERT INTO alumnos(matricula,nombre,app,apm,contraseña,grupo) VALUES('$mat','$nom','$app','$apm','$grup','$pass')";
 //ejecuta la consulta

 $resultado = mysqli_query($conexion, 'SELCT * FROM alumnos');

 if(!$resultado)
 {
     
     echo "\n".'Error al registrar';
 }else{
     echo "Registro exitoso";
 }

 //cerramos la conexion
 mysqli_close($conexion);
?>