<?php

$accion = $_POST['accion'];
$tarea = $_POST['tarea'];
$id_proyecto = (int) $_POST['id_proyecto'];

if ($accion === 'crear') {

       //importar la conexion
    include '../funciones/bd_conexion.php';
   
    try {
        $stmt = $conn->prepare('INSERT INTO tareas (nombre, id_proyecto) VALUES (?,?)');
        $stmt->bind_param('si', $tarea, $id_proyecto);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                   'respuesta' => 'correcto',
                   'id_proyecto' => $stmt->insert_id,
                   'tipo' => $accion,
                   'tarea' => $tarea
               );
        } else {
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
