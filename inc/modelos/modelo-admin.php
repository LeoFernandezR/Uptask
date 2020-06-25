<?php

$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if($accion === 'crear') {
 //Código para crear los administradores 
 

 //hashear passwords
    $opciones = array(
        'cost' => 12
    );
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);

    //importar la conexion
    include '../funciones/conexion.php';

    try {
        $stmt = $conn->prepare('INSERT INTO usuarios (usuario, password) VALUES (?, ?)');
        $stmt->bind_param('ss', $usuario, $hash_password);
        $stmt->execute();
        if($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
            );
        }else {
            $repuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

echo json_encode($respuesta);
}


if($accion === 'login') {
    //escribir codigo para que logueen los administradores
    include '../funciones/conexion.php';

    try {
        $stmt = $conn->prepare('SELECT usuario, id, password FROM usuarios WHERE usuario = ?');
        $stmt->bind_param('s', $usuario);
        $stmt->execute();
        $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario);
        $stmt->fetch();
        if($nombre_usuario) {
            if(password_verify($password, $pass_usuario )) {
                //iniciamos la sesion
                session_start();
                $_SESSION['nombre'] = $usuario;
                $_SESSION['id'] = $id_usuario;
                $_SESSION['login'] = true;
                //login correcto
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'nombre' => $nombre_usuario,
                    'tipo' => $accion
                );
            } else {
                $respuesta = array(
                    'resultado' => 'Password Incorrecto'
                );
            }
        } else {
            $respuesta = array(
                'error' => 'Usuario no existe'
            );
        }
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        $respuesta = array(
            'pass' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}