eventListeners();
//lista de proyectos
var listaProyectos = document.querySelector("ul#proyectos");
function eventListeners() {
  //Document ready
  document.addEventListener("DOMContentLoaded", function () {
    actualizarProgreso();
  });
  // boton para crear proyecto
  document
    .querySelector(".crear-proyecto a")
    .addEventListener("click", nuevoProyecto);

  //Boton para una nueva tarea
  document
    .querySelector(".nueva-tarea")
    .addEventListener("click", agregarTarea);
  // Botones para las acciones de las tares
  document
    .querySelector(".listado-pendientes")
    .addEventListener("click", accionesTareas);
}
function nuevoProyecto(e) {
  e.preventDefault();

  // Crea un input para el nombre del nuevo proyecto
  var nuevoProyecto = document.createElement("li");
  nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
  listaProyectos.appendChild(nuevoProyecto);

  // seleccionar el id con el nuevo proyecto

  const inputNuevoProyecto = document.querySelector("#nuevo-proyecto");

  //al presionar enter crear el proyecto

  inputNuevoProyecto.addEventListener("keypress", function (e) {
    var tecla = e.which || e.keyCode;

    if (tecla === 13) {
      guardarProyectoDB(inputNuevoProyecto.value);
      listaProyectos.removeChild(nuevoProyecto);
    }
  });
}
function guardarProyectoDB(nombreProyecto) {
  const xhr = new XMLHttpRequest(),
    datos = new FormData();

  datos.append("proyecto", nombreProyecto);
  datos.append("accion", "crear");

  xhr.open("POST", "inc/modelos/modelo-proyecto.php", true);

  xhr.onload = function () {
    if (this.status === 200) {
      const respuesta = JSON.parse(xhr.responseText),
        proyecto = respuesta.nombre_proyecto,
        id_proyecto = respuesta.id_proyecto,
        tipo = respuesta.tipo,
        resultado = respuesta.respuesta;
      console.log(respuesta);
      // Comprobar la insercion

      if (resultado === "correcto") {
        //fue exitoso
        if (tipo === "crear") {
          // Se creo un nuevo proyecto
          //inyectar en el HTML
          var nuevoProyecto = document.createElement("li");
          nuevoProyecto.innerHTML = `
            <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                ${proyecto}
            </a>
          `;
          listaProyectos.appendChild(nuevoProyecto);

          swal({
            title: "Proyecto Creado",
            text: "El proyecto: " + proyecto + " se creo correctamente",
            type: "success",
          }).then((resultado) => {
            if (resultado.value) {
              window.location.href = "index.php?id_proyecto=" + id_proyecto;
            }
          });
          //redireccionar
        } else {
          // se actualiza o se elimina
        }
      } else {
        // hubo un error
        swal({
          title: "Error",
          text: "Hubo un error",
          type: "error",
        });
      }
    }
  };

  xhr.send(datos);
}
function agregarTarea(e) {
  e.preventDefault();
  const nombreTarea = document.querySelector(".nombre-tarea").value;
  //validar que el campo tenga algo escrito

  if (nombreTarea === "") {
    swal({
      title: "Error",
      text: "Una tarea no puede ir vacia",
      type: "error",
    });
  } else {
    // la tarea tiene algo, insertar en PHP

    //crear llamado a Ajax

    const xhr = new XMLHttpRequest(),
      datos = new FormData();
    datos.append("tarea", nombreTarea);
    datos.append("accion", "crear");
    datos.append("id_proyecto", document.querySelector("#id_proyecto").value);

    xhr.open("POST", "inc/modelos/modelo-tareas.php", true);
    xhr.onload = function () {
      if (this.status === 200) {
        const respuesta = JSON.parse(xhr.responseText),
          resultado = respuesta.respuesta,
          tarea = respuesta.tarea,
          id_insertado = respuesta.id_proyecto,
          tipo = respuesta.tipo;

        if (resultado === "correcto") {
          if (tipo === "crear") {
            swal({
              title: "Tarea Creada",
              text: "La tarea: " + tarea + " se creó correctamente",
              type: "success",
            });

            // seleccionar el parrafo con la lista vacia
            const listaVacia = document.querySelectorAll(".lista-vacia");
            if (listaVacia.length > 0) {
              document.querySelector(".lista-vacia").remove();
            }
            // construir el template
            const nuevaTarea = document.createElement("li");
            nuevaTarea.id = "tarea:" + id_insertado;
            nuevaTarea.classList.add("tarea");

            // construir el html
            nuevaTarea.innerHTML = `
              <p>${tarea}</p>
              <div class="acciones">
                <i class="far fa-check-circle"></i>
                <i class="fas fa-trash"></i>
              </div>
            `;
            //agregar al html
            const listadoTareas = document.querySelector(
              ".listado-pendientes ul"
            );
            listadoTareas.appendChild(nuevaTarea);
            //limpiar el formulario
            document.querySelector(".agregar-tarea").reset();
            actualizarProgreso();
          }
        } else {
          swal({
            title: "Error",
            text: "Hubo un error",
            type: "error",
          });
        }
      }
    };
    xhr.send(datos);
  }
}
function accionesTareas(e) {
  e.preventDefault();
  if (e.target.classList.contains("fa-check-circle")) {
    if (e.target.classList.contains("completo")) {
      e.target.classList.remove("completo");
      cambiarEstadoTarea(e.target, 0);
    } else {
      e.target.classList.add("completo");
      cambiarEstadoTarea(e.target, 1);
    }
  }

  if (e.target.classList.contains("fa-trash")) {
    swal({
      title: "¿Seguro(a)?",
      text: "Esta accion no se puede deshacer",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Si, borrar!",
      cancelButtonText: "Cancelar",
    }).then((resultado) => {
      if (resultado.value) {
        var tareaEliminar = e.target.parentElement.parentElement;
        //Borrar de la BD
        eliminarTareaBD(tareaEliminar);
        //Borrar del html
        tareaEliminar.remove();
        swal("Eliminado", "La tarea fue eliminada", "success");
      }
    });
  }
}
function cambiarEstadoTarea(tarea, estado) {
  const idTarea = tarea.parentElement.parentElement.id.split(":");
  const xhr = new XMLHttpRequest();
  const datos = new FormData();
  datos.append("id_tarea", idTarea[1]);
  datos.append("accion", "actualizar");
  datos.append("estado", estado);
  xhr.open("POST", "inc/modelos/modelo-tareas3.php", true);
  xhr.onload = function () {
    if (this.status === 200) {
      actualizarProgreso();
    }
  };
  xhr.send(datos);
}
function eliminarTareaBD(tarea) {
  const idTarea = tarea.id.split(":");
  const xhr = new XMLHttpRequest();
  const datos = new FormData();
  datos.append("id_tarea", idTarea[1]);
  datos.append("accion", "eliminar");
  xhr.open("POST", "inc/modelos/modelo-tareas2.php", true);
  xhr.onload = function () {
    if (this.status === 200) {
      const listaTareaRestantes = document.querySelectorAll("li.tarea");
      if (listaTareaRestantes.length === 0) {
        document.querySelector(".listado-pendientes ul").innerHTML =
          "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
      }
      actualizarProgreso();
    }
  };
  xhr.send(datos);
}
function actualizarProgreso() {
  // Obtener todas las tareas

  const tareas = document.querySelectorAll("li.tarea");
  // Obtener las tareas completas
  const tareasCompletadas = document.querySelectorAll("i.completo");
  // Determinar el avance
  const avance = (tareasCompletadas.length / tareas.length) * 100;
  // Asignar el avance de la barra
  const porcentaje = document.querySelector("#porcentaje");
  porcentaje.style.width = avance.toFixed(2) + "%";

  if (avance === 100) {
    swal({
      title: "¡Felicidades!",
      text: "Has realizado todas las tareas",
      type: "success",
    });
  }
}
