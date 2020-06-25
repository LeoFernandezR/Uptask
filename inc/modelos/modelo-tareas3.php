<?php
$accion = $_POST['accion'];
$id_tarea = (int) $_POST['id_tarea'];
$estado = $_POST['estado'];

if ($accion === 'actualizar') {
    include '../funciones/bd_conexion.php';

    try {
        $stmt = $conn->prepare("UPDATE tareas set estado = ? WHERE id = ?");
        $stmt->bind_param('ii', $estado, $id_tarea);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto'
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
};
