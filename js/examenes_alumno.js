window.addEventListener("load", function () {
    let tipoSesion = sessionStorage.getItem("tipoSesion");
    if (tipoSesion != "Alumno") {
        location.href = ".";
    }
    getInfoExamenes();
});

function getInfoExamenes() {
    let idAlumno = sessionStorage.getItem("idSesion");
    // let data = new FormData();
    // data.append("idProfesor", idProfesor);

    let data = { idAlumno: idAlumno };

    let request = new XMLHttpRequest();
    request.open("get", "php/getInfoExamenes_by_idAlumno.php?data=" + JSON.stringify(data));
    request.send(JSON.stringify(data));
    request.onload = function () {
        if (request.status != 200) {
            console.log(`error: ${request.status} :: ${request.statusText}`);
        } else {
            // console.log(request.responseText);
            let responseData = JSON.parse(request.responseText);
            // console.log(responseData);

            let porAplicar = responseData["porAplicar"];
            let enAplicacion = responseData["enAplicacion"];
            let aplicados = responseData["aplicados"];

            let examenes_por_aplicar_table_tbody = document.querySelector(".examenes-por-aplicar table tbody");
            let examenes_en_aplicacion_table_tbody = document.querySelector(".examenes-en-aplicacion table tbody");
            let examenes_aplicados_table_tbody = document.querySelector(".examenes-aplicados table tbody");

            porAplicar.forEach(e => {
                let tr = document.createElement("tr");
                Object.values(e).forEach(ele => {
                    let td = document.createElement("td");
                    td.innerText = ele;
                    tr.appendChild(td);
                });
                tr.addEventListener("click", getInfoExamen.bind(null, event, e["idExamen"]));
                examenes_por_aplicar_table_tbody.appendChild(tr);
            });
            enAplicacion.forEach(e => {
                let tr = document.createElement("tr");
                Object.values(e).forEach(ele => {
                    let td = document.createElement("td");
                    td.innerText = ele;
                    tr.appendChild(td);
                });
                tr.addEventListener("click", getInfoExamen.bind(null, event, e["idExamen"]));
                examenes_en_aplicacion_table_tbody.appendChild(tr);
            });
            aplicados.forEach(e => {
                let tr = document.createElement("tr");
                Object.values(e).forEach(ele => {
                    let td = document.createElement("td");
                    td.innerText = ele;
                    tr.appendChild(td);
                });
                examenes_aplicados_table_tbody.appendChild(tr);
            });
        }
    }
}

function getInfoExamen(event, idExamen) {
    let examenes = document.querySelector(".examenes");
    let respondeExamen = document.querySelector(".respondeExamen");
    respondeExamen.id = idExamen;
    let respondeExamen_title = respondeExamen.querySelector(".title");
    let preguntas_div = respondeExamen.querySelector(".preguntas");
    
    respondeExamen_title.innerHTML = "<h1>Respondiendo Examen con ID: " + idExamen + "</h1>";
    
    examenes.hidden = true;
    respondeExamen.hidden = false;

    let plantilla_pregunta_div = document.querySelector(".plantilla_pregunta");

    let data = { idExamen: idExamen };

    let request = new XMLHttpRequest();
    request.open("post", "php/getInfoExamen_by_id.php");
    request.send(JSON.stringify(data));
    request.onload = function () {
        if (request.status != 200) {
            console.log(`error: ${request.status} :: ${request.statusText}`);
        } else {
            // console.log(request.responseText);
            let responseData = JSON.parse(request.responseText);
            // console.log(responseData);

            responseData.forEach(e =>{
                let pregunta_div = document.createElement("div");
                pregunta_div.innerHTML = plantilla_pregunta_div.innerHTML;
                pregunta_div.id = e.idPregunta;
                pregunta_div.classList.add("pregunta");

                let input_array = pregunta_div.querySelectorAll("textarea, input");
                let descripcion_input = input_array[0];
                let r1_input = input_array[1];
                let r2_input = input_array[2];
                let r3_input = input_array[3];
                let respuestaCorrecta_input = input_array[4];

                descripcion_input.value = e.descripcion;
                r1_input.value = e.r1;
                r2_input.value = e.r2;
                r3_input.value = e.r3;
                respuestaCorrecta_input.value = e.respuestaCorrecta;
                preguntas_div.appendChild(pregunta_div);
            });
        }
    };

}

function enviaRespuestas() {
    let respondeExamen = document.querySelector(".respondeExamen");
    let idExamen = respondeExamen.id;
    console.log(idExamen);
    let respondeExamen_title = respondeExamen.querySelector(".title");
    let preguntas_div = respondeExamen.querySelector(".preguntas");
    let preguntas = preguntas_div.querySelectorAll(".pregunta");

    let idAlumno = sessionStorage.getItem("idSesion");

    let data = [];
    data.push({ idExamen: idExamen,idAlumno: idAlumno});
    preguntas.forEach(pregunta =>{
        let input_array = pregunta.querySelectorAll("input, select");
        let data_temp = {};
        input_array.forEach(input =>{
            data_temp[input.name] = input.value;
        });
        let respuestaSeleccionada = data_temp[data_temp["RespuestaSeleccionada"]];
        data_temp = {
            idPregunta: pregunta.id,
            respuestaSeleccionada: respuestaSeleccionada,
        }
        data.push(data_temp);
    });

    console.log(data);

    let request = new XMLHttpRequest();
    request.open("post", "php/setHistorialRespuestas.php");
    request.send(JSON.stringify(data));
    request.onload = function () {
        if (request.status != 200) {
            console.log(`error: ${request.status} :: ${request.statusText}`);
        } else {
            console.log(request.responseText);
            let responseData = JSON.parse(request.responseText);
            console.log(responseData);
            let numPreguntas = responseData["numPreguntas"];
            let numRespuestasCorrectas = responseData["numRespuestasCorrectas"];
            respondeExamen_title.innerHTML = "<h1>" + numRespuestasCorrectas + "." + numPreguntas + " Aciertos</h1>"
            preguntas_div.innerHTML = "";
        }
    }
}