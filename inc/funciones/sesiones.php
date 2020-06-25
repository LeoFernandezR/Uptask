<?php

function usuarioAutenticado() {
    if(!revisar_usuario()) {
        header('Location:login.php');
        exit();
    }
}

function revisar_usuario() {
    return isset($_SESSION['nombre']);
}
session_start();
usuarioAutenticado();