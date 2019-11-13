window.addEventListener("load", function () {
    let tipoSesion = sessionStorage.getItem("tipoSesion");
    if (tipoSesion != "Profesor") {
        location.href = ".";
    }
    getInfoExamenes();
});

function getInfoExamenes(){
    let idProfesor = sessionStorage.getItem("idSesion");
    // let data = new FormData();
    // data.append("idProfesor", idProfesor);

    let data = {idProfesor: idProfesor};

    let request = new XMLHttpRequest();
    request.open("get", "php/getInfoExamenes_by_idProfesor.php?data=" + JSON.stringify(data));
    request.send(JSON.stringify(data));
    request.onload=function () {
        if(request.status != 200){
            console.log(`error: ${request.status} :: ${request.statusText}`);
        } else{
            // console.log(request.responseText);
            let responseData = JSON.parse(request.responseText);
            // console.log(responseData);

            let porAplicar = responseData["porAplicar"]; 
            let enAplicacion = responseData["enAplicacion"]; 
            let aplicados = responseData["aplicados"]; 

            let examenes_por_aplicar_table_tbody = document.querySelector(".examenes-por-aplicar table tbody");
            let examenes_en_aplicacion_table_tbody = document.querySelector(".examenes-en-aplicacion table tbody");
            let examenes_aplicados_table_tbody = document.querySelector(".examenes-aplicados table tbody");
            
            porAplicar.forEach(e=>{
                let tr = document.createElement("tr");
                Object.values(e).forEach(ele=>{
                    let td = document.createElement("td");
                    td.innerText = ele;
                    tr.appendChild(td);
                });
                examenes_por_aplicar_table_tbody.appendChild(tr);
            });
            enAplicacion.forEach(e => {
                let tr = document.createElement("tr");
                Object.values(e).forEach(ele => {
                    let td = document.createElement("td");
                    td.innerText = ele;
                    tr.appendChild(td);
                });
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

function submitData(form) {
    let inputs = form.querySelectorAll("input");
    let data = {};

    inputs.forEach(input => {
        data[input.name] = input.value;
    });
    data["idProfesor"] = sessionStorage.getItem("idSesion");

    let request = new XMLHttpRequest();
    request.open("post", "php/addNewExamen_preguntasAleatorias.php");
    request.send(JSON.stringify(data));
    request.onload = function () {
        if (request.status != 200) {
            console.log(`error:${request.status} :: ${request.statusText}`);
        } else {
            console.log(request.responseText);
            let data = JSON.parse(request.responseText);
            console.log(data);

            if (data["error"] != undefined) {
                toastr.error(data["error"], 'Error!');
            } else {
                form.reset();

                let examenes_por_aplicar_table_body = document.querySelector(".examenes-por-aplicar table tbody");
                let tr = document.createElement("tr");
                let idExamen_td = document.createElement("td");
                let nomSeccion_td = document.createElement("td");
                let duracion_td = document.createElement("td");
                let fechaAplicacion_td = document.createElement("td");
                let fechaLimiteAplicacion_td = document.createElement("td");
                
                idExamen_td.innerText = data["idExamen"];
                nomSeccion_td.innerText = data["nomSeccion"];
                duracion_td.innerText = data["duracion"];
                fechaAplicacion_td.innerText = data["fechaAplicacion"];
                fechaLimiteAplicacion_td.innerText = data["fechaLimiteAplicacion"];

                tr.appendChild(idExamen_td);
                tr.appendChild(nomSeccion_td);
                tr.appendChild(duracion_td);
                tr.appendChild(fechaAplicacion_td);
                tr.appendChild(fechaLimiteAplicacion_td);
                examenes_por_aplicar_table_body.appendChild(tr);
            }
        }
    };
}