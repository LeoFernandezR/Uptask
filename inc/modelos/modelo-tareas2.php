<?php
$accion = $_POST['accion'];
$id_tarea = (int) $_POST['id_tarea'];

if ($accion === "eliminar") {
    include '../funciones/bd_conexion.php';

    try {
        $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ?");
        $stmt->bind_param('i', $id_tarea);
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
}
