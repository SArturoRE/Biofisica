window.onload = function () {
    agregaPregunta();
    let tipoSesion = sessionStorage.getItem("tipoSesion");
    if (tipoSesion != "Profesor") {
        location.href = ".";
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

function cambiaInputSeccionExamen(checkbox) {
    let input_seccion_examen = document.querySelector(".input-seccion-examen");
    let input_duracion_examen = document.querySelector(".input-duracion-examen");
    let input_fechaAplicacion_examen = document.querySelector(".input-fechaAplicacion-examen");
    let input_fechaLimiteAplicacion_examen = document.querySelector(".input-fechaLimiteAplicacion-examen");
    if (checkbox.checked) {
        input_seccion_examen.disabled = false;
        input_seccion_examen.required = true;

        input_duracion_examen.disabled = false;
        input_duracion_examen.required = true;
        
        input_fechaAplicacion_examen.disabled = false;
        input_fechaAplicacion_examen.required = true;

        input_fechaLimiteAplicacion_examen.disabled = false;
        input_fechaLimiteAplicacion_examen.required = true;
    } else {
        input_seccion_examen.disabled = true;
        input_seccion_examen.required = false;

        input_duracion_examen.disabled = true;
        input_duracion_examen.required = false;

        input_fechaAplicacion_examen.disabled = true;
        input_fechaAplicacion_examen.required = false;

        input_fechaLimiteAplicacion_examen.disabled = true;
        input_fechaLimiteAplicacion_examen.required = false;
    }
}

function getData(form) {
    let preguntas_div = form.querySelectorAll(".body_formulario_preguntas .container");
    let preguntasParaExamen_input = form.querySelector(".footer input[name='PreguntasParaExamen']");
    let seccionExamen_input = form.querySelector(".footer input[name='SeccionExamen']");
    let DuracionExamen_input = form.querySelector(".footer input[name='DuracionExamen']");
    let FechaAplicacionExamen_input = form.querySelector(".footer input[name='FechaAplicacionExamen']");
    let FechaLimiteAplicacionExamen_input = form.querySelector(".footer input[name='FechaLimiteAplicacionExamen']");
    let data=[];
    let idProfesor = sessionStorage.getItem("idSesion");

    data.push({
        idProfesor: idProfesor,
        PreguntasParaExamen: preguntasParaExamen_input.checked,
        SeccionExamen: seccionExamen_input.value,
        DuracionExamen: DuracionExamen_input.value,
        FechaAplicacionExamen: FechaAplicacionExamen_input.value,
        FechaLimiteAplicacionExamen: FechaLimiteAplicacionExamen_input.value
    });
    preguntas_div.forEach(pregunta_div => {
        let data_elements = pregunta_div.querySelectorAll("input, select, textarea");
        let data_temp = {};
        data_elements.forEach(data_element => {
            data_temp[data_element.name] = data_element.value;
        });
        data.push(data_temp);
    });

    let request = new XMLHttpRequest();
    request.open("POST", "php/addInfoPreguntas.php");
    request.send(JSON.stringify(data));
    request.onload = function () {
        if(request.status != 200){
            console.log(`error:${request.status} :: ${request.statusText}`);
        } else{
            console.log(request.responseText);
            let data = JSON.parse(request.responseText);
            console.log(data);

            if(data["error"] != undefined){
                toastr.error(data["error"], 'Error!');
            } else{
                location.href = "/materialApoyo_preguntas.html";
            }
        }
    };
}