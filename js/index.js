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

function getInfoUsuario() {
    let request = new XMLHttpRequest();

    var values = document.querySelectorAll("#iniciarSesion form input:not([type='radio'])");

    let datos = {};
    values.forEach(function(e){
        datos[e.name] = e.value;
    });
    
    request.open("post", "php/getDatosUsuario.php");
    request.send(JSON.stringify(datos));

    request.onload = function () {
        $("#iniciarSesion").modal("hide");
        if (request.status != 200) {
            alert(`Error ${request.status}: ${request.statusText}`);
        } else {
            console.log(JSON.parse(request.response));
        }
    };
    
    request.onerror = function () {
        alert("error inesperado al obtener la informacion del usuario :v sorry bro :,v");
    };
}

function addInfoUsuario() {
    let values = document.querySelectorAll("#Registro form input:not([type='radio'])");
    let datos = {};

    values.forEach(function(e){
        datos[e.name] = e.value;
    });

    let request = new XMLHttpRequest();

    request.open("post", "php/addInfoUsuario.php");
    request.send(JSON.stringify(datos));

    request.onload = function(){
        $("#Registro").modal("hide");
        if(request.status != 200) {
            alert(`Error ${request.status}: ${request.statusText}`);
        } else {
            console.log(JSON.parse(request.response));
        }
    };

    request.onerror = function(){
        alert("error inesperado al guardar la informacion del usuario :v sorry bro :,v");
    };
}