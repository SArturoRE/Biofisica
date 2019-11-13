<?php

function getConexionDB()
{
    $conexion = new mysqli("localhost", "root", "", "biofisicaDB");

    if ($conexion->connect_errno) {

        $data["error"] = "Fallo al conectarse a MySQL";
        $data["#"] = $mysqli->connect_errno;
        $data["descripcion"] = $mysqli->connect_error;

        echo json_encode($data);
        exit;
    }

    return $conexion;
}
