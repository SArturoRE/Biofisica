<?php

function getConexionDB()
{
    $conexion = new mysqli("localhost", "xDB", "15628311.xMariaDB", "biofisicaDB");

    if ($conexion->connect_errno) {

        $data["error"] = "Fallo al conectarse a MySQL";
        $data["#"] = $mysqli->connect_errno;
        $data["descripcion"] = $mysqli->connect_error;

        echo json_encode($data);
        exit;
    }

    return $conexion;
}
