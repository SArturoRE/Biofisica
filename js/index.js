window.addEventListener("load", function () {
    muestra_oculta_campos_formularios();
    set_Navbar_porSesion();
});

function set_Navbar_porSesion() {
    let idSesion = sessionStorage.getItem("idSesion");
    let tipoSesion = sessionStorage.getItem("tipoSesion");
    let navbar_nav = document.querySelector(".navbar-nav");

    console.log(idSesion);

    if (idSesion != null) {
        navbar_nav.innerHTML =
        `
            <li class='nav-item dropdown'>
                <a class='nav-link dropdown-toggle' href='#' role='button' data-toggle='dropdown'>Material Apoyo</a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" href="#">Visto en Clase</a>
                    <a class="dropdown-item" href="#">Material Externo</a>
                    <a class="dropdown-item" href="#">Preguntas</a>
                </div>
            </li>
        `;
        if (tipoSesion == "Alumno") {
            navbar_nav.innerHTML = navbar_nav.innerHTML + 
            `
                <li class='nav-item'>
                    <a class='nav-link' href='#'>Examenes</a>
                </li>
            `;
        }
        navbar_nav.innerHTML = navbar_nav.innerHTML + 
        `
            <li class='nav-item'>
                <!--configuracion del perfil-->
                <a class='nav-link' href='#'>Configuracion</a>
            </li>
            <li class='nav-item'>
                <!--cierra sesion usuario-->
                <a class='nav-link' onclick='cerrarSesionUsuario()'>Cerrar Sesion</a>
            </li>
        `;
    } else {
        navbar_nav.innerHTML = "<li class='nav-item active'><!--boton de Inicio Sesion--><a class='nav-link' id='btn-InicioSesion' href='#' data-toggle='modal'data-target='#iniciarSesion'>Iniciar Sesion</a></li><li class='nav-item'><!--boton de Registrarse--><a class='nav-link' id='btn-Registro' href='#' data-toggle='modal'data-target='#Registro'>Registrarse</a></li>";
    }
}

function muestra_oculta_campos_formularios() {
    let tipoUsuario_radio_iniciaSesion = document.querySelectorAll("input[name='tipoUsuario_radio_iniciaSesion']");
    let tipoUsuario_radio_Registro = document.querySelectorAll("input[name='tipoUsuario_radio_Registro']");
    tipoUsuario_radio_iniciaSesion.forEach(function (radio) {
        radio.addEventListener("change", function () {
            let div = document.querySelector("#tipoUsuario_div_iniciaSesion");
            let elementosOcultos_IniciaSesion = document.querySelectorAll(".elementoOculto_IniciaSesion");
            elementosOcultos_IniciaSesion.forEach(function (e) {
                e.style.display = "";
            });
            if (radio.value === "alumno") {
                div.innerHTML = "<div class='col-5'><label for=''>Matricula</label><br></div><div class='col-7'><input pattern='[0-9]+' name='Matricula' required><br></div>"
            } else {
                div.innerHTML = "<div class='col-5'><label for=''>Numero Trabajador</label><br></div><div class='col-7'><input pattern='[0-9]+' name='numTrabajador' required><br></div>"
            }
        });
    });
    tipoUsuario_radio_Registro.forEach(function (radio) {
        radio.addEventListener("change", function () {
            let div = document.querySelector("#tipoUsuario_div_Registro");
            let elementosOcultos_Registro = document.querySelectorAll(".elementoOculto_Registro");
            elementosOcultos_Registro.forEach(function (e) {
                e.style.display = "";
            });
            if (radio.value === "alumno") {
                div.innerHTML = "<div class='col-5'><label for=''>Matricula</label><br></div><div class='col-7'><input pattern='[0-9]+' name='Matricula' required><br></div>"
            } else {
                div.innerHTML = "<div class='col-5'><label for=''>Numero Trabajador</label><br></div><div class='col-7'><input pattern='[0-9]+' name='numTrabajador' required><br></div>"
            }
        });
    });
}

function getInfoUsuario() {
    let request = new XMLHttpRequest();

    var values = document.querySelectorAll("#iniciarSesion form input:not([type='radio'])");

    let datos = {};
    values.forEach(function (e) {
        datos[e.name] = e.value;
    });

    request.open("post", "php/getDatosUsuario.php");
    request.send(JSON.stringify(datos));

    request.onload = function () {
        if (request.status != 200) {
            alert(`Error ${request.status}: ${request.statusText}`);
        } else {
            let infoResponse = JSON.parse(request.response);

            if (infoResponse["error"] == undefined) {
                $("#iniciarSesion").modal("hide");
                agregaSesionUsuario(datos);
            }
        }
    };

    request.onerror = function () {
        alert("error inesperado al obtener la informacion del usuario :v sorry bro :,v");
    };
}

function addInfoUsuario() {
    let values = document.querySelectorAll("#Registro form input:not([type='radio'])");
    let datos = {};

    values.forEach(function (e) {
        datos[e.name] = e.value;
    });

    let request = new XMLHttpRequest();

    request.open("post", "php/addInfoUsuario.php");
    request.send(JSON.stringify(datos));

    request.onload = function () {
        if (request.status != 200) {
            alert(`Error ${request.status}: ${request.statusText}`);
        } else {
            let infoResponse = JSON.parse(request.response);

            if (infoResponse["error"] == undefined) {

                agregaSesionUsuario(datos);
                $("#Registro").modal("hide");
            }
        }
    };

    request.onerror = function () {
        alert("error inesperado al guardar la informacion del usuario :v sorry bro :,v");
    };
}

function agregaSesionUsuario(datos) {
    let idSesion = datos["Matricula"] != undefined ? datos["Matricula"] : datos["numTrabajador"];
    sessionStorage.setItem("idSesion", idSesion);
    if (datos["Matricula"] != undefined) {
        sessionStorage.setItem("tipoSesion", "Alumno");
    } else {
        sessionStorage.setItem("tipoSesion", "Profesor");
    }
    set_Navbar_porSesion();
}

function cerrarSesionUsuario() {
    sessionStorage.removeItem("idSesion");
    location.href = "/Biofisica/";
}