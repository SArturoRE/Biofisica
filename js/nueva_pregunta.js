function agregaPregunta(){
    let formulario_preguntas = document.querySelector(".formulario_preguntas");
    let plantilla_pregunta = document.querySelector(".plantilla_pregunta");
    let div_plantilla_pregunta = document.createElement("div");
    div_plantilla_pregunta.innerHTML = plantilla_pregunta.innerHTML;

    formulario_preguntas.insertAdjacentElement("afterbegin", div_plantilla_pregunta)
}

function eliminarPregunta(span){
    let plantilla_pregunta = span.parentElement.parentElement;
    let formulario_preguntas = document.querySelector(".formulario_preguntas");
    formulario_preguntas.removeChild(plantilla_pregunta);
}