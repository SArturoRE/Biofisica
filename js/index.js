window.addEventListener("load", function () {
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
});

function getInfoUsuario(e) {
    e.preventDefault();
    let request = new XMLHttpRequest();

    request.open("post", "php/getDatosUsuario.php");
    request.send(JSON.stringify());

    request.onload = function () {
        if (xhr.status != 200) {
            alert(`Error ${xhr.status}: ${xhr.statusText}`);
        } else {
            console.log(xhr.response);
        }
    };

    request.onerror = function () {
        alert("error inesperado :v sorry bro :,v");
    };
}