window.addEventListener("load", function () {
    let tipoSesion = sessionStorage.getItem("tipoSesion");
    if (tipoSesion != "Profesor") {
        location.href = "/";
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