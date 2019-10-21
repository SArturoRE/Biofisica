function agregaPregunta(){
    let body_formulario_preguntas = document.querySelector(".body_formulario_preguntas");
    let plantilla_pregunta = document.querySelector(".plantilla_pregunta");
    let div_plantilla_pregunta = document.createElement("div");
    div_plantilla_pregunta.innerHTML = plantilla_pregunta.innerHTML;

    body_formulario_preguntas.insertAdjacentElement("afterbegin", div_plantilla_pregunta)
}

function eliminarPregunta(span){
    let plantilla_pregunta = span.parentElement.parentElement;
    let body_formulario_preguntas = document.querySelector(".body_formulario_preguntas");
    body_formulario_preguntas.removeChild(plantilla_pregunta);
}