window.onload = function(){
    agregaPregunta();
    let tipoSesion = sessionStorage.getItem("tipoSesion");
    if (tipoSesion != "Profesor") {
        location.href = "/";
    }
}

function agregaPregunta() {
    let body_formulario_preguntas = document.querySelector(".body_formulario_preguntas");
    let plantilla_pregunta = document.querySelector(".plantilla_pregunta");
    let div_plantilla_pregunta = document.createElement("div");
    div_plantilla_pregunta.innerHTML = plantilla_pregunta.innerHTML;
    div_plantilla_pregunta.classList.add("new_preunta");
    body_formulario_preguntas.insertAdjacentElement("afterbegin", div_plantilla_pregunta)
}

function eliminarPregunta(span) {
    let body_formulario_preguntas = document.querySelector(".body_formulario_preguntas");
    let body_formulario_preguntas_array = body_formulario_preguntas.querySelectorAll(".new_preunta");
    let numPreguntas = body_formulario_preguntas_array.length;
    if (numPreguntas > 1) {
        let plantilla_pregunta = span.parentElement.parentElement.parentElement;
        body_formulario_preguntas.removeChild(plantilla_pregunta);
    }
}


function submit(){
}