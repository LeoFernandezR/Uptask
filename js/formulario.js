eventListeners();

function eventListeners() {
  const submitFormulario = document
    .querySelector("#formulario")
    .addEventListener("submit", validarRegistro);
}

function validarRegistro(e) {
  e.preventDefault();

  const usuario = document.querySelector("#usuario").value,
    password = document.querySelector("#password").value,
    tipo = document.querySelector("#tipo").value;

  if (usuario === "" || password === "") {
    swal({
      // la validacion falló
      type: "error",
      title: "¡Hubo un error!",
      text: "Ambos campos son obligatorios.",
    });
  } else {
    // Ambos son correctos, mandar ejecutar AJAX

    const datos = new FormData();
    datos.append("usuario", usuario);
    datos.append("password", password);
    datos.append("accion", tipo);

    //crear el llamado a ajax

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "inc/modelos/modelo-admin.php", true);

    xhr.onload = function () {
      if (this.status === 200) {
        const respuesta = JSON.parse(xhr.responseText);
        if (respuesta.respuesta === "correcto") {
          // Si es un nuevo usuario

          if (respuesta.tipo === "crear") {
            swal({
              title: "Usuario Creado",
              text: "El usuario se creo correctamente",
              type: "success",
            });
          } else if (respuesta.tipo === "login") {
            swal({
              title: "Ha iniciado sesión",
              text: "Presiona OK para abrir el dashboard",
              type: "success",
            }).then((resultado) => {
              if (resultado.value) {
                window.location.href = "index.php";
              }
            });
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
