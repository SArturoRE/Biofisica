
// archivo a subir
var newFile_to_Upload = null;

window.onload = function () {
    verificaSesion_itemsSesion();
    obtenArchivos_MaterialDidactico_Servidor();
}

function verificaSesion_itemsSesion() {

    if (sessionStorage.getItem("tipoSesion") == undefined) {
        window.location.href = "/";
    }

    let tipoSesion = sessionStorage.getItem("tipoSesion");
    let materialApoyo_div = document.querySelector(".materialApoyo");
    let agregaNuevoArchivo_html = `
                    <div class="header_materialApoyo_archivos  shadow p-3 mb-5 bg-white rounded"
        style="margin: 10vh 0; margin: 5vw;">
        <div>
            <p style="text-align: center; font-size: 3em;">Agregar Nuevo Archivo</p>
        </div>
        <div style="display: flex; justify-content: center;">
            <input type="file" name="" id="addNewFile">
                <button class="btn btn-success" onclick="subirArchivo();">agregar archivo</button>
                        </div>
            <div class="div_tipoArchivo" style="display: flex; justify-content: center;margin: 3vh 0;">
                <input type="radio" name="tipoArchivo" value="vistoClase" style="height: 30px; width: 20px;">
                    <label for="">Visto en Clase</label>

                    <input type="radio" name="tipoArchivo" value="materialExterno" style="height: 30px; width: 20px;">
                        <label for="">Material Externo</label>
                        </div>
                    </div>
                `;
    let agregaNuevoArchivo_div = document.createElement("div");
    agregaNuevoArchivo_div.innerHTML = agregaNuevoArchivo_html;
    if (tipoSesion == "Profesor") {
        materialApoyo_div.insertAdjacentElement("afterbegin", agregaNuevoArchivo_div);
        document.querySelector("#addNewFile").addEventListener("change", function () {
            if (this.files.length == 0) return;
            newFile_to_Upload = this.files[0];
        });
    } else {
        setInterval(verificaCambiosVisibilidad, 5000);
    }
}

function verificaCambiosVisibilidad() {
    let materialApoyo = document.querySelector(".materialApoyo");
    let plantilla_MaterialApoyo_array = materialApoyo.querySelectorAll(".plantilla_MaterialApoyo");

    let request = new XMLHttpRequest();
    request.open("get", "php/getVisibilidadArchivos.php");
    request.send();
    request.onload = function () {
        if (request.status != 200) {
            alert(`Error: ${request.status}:: ${request.statusText}`);
        } else {
            let data = JSON.parse(request.response);
            plantilla_MaterialApoyo_array.forEach(e => {
                let idMaterialDidactico_input = e.querySelector("input");
                let idMaterialDidactico = idMaterialDidactico_input.value;

                estadoVisibilidad = data[idMaterialDidactico];
                if (estadoVisibilidad == "oculto") {
                    let plantilla_MaterialApoyo = materialApoyo.querySelector("._" + idMaterialDidactico);
                    plantilla_MaterialApoyo.outerHTML = "";
                    console.log(plantilla_MaterialApoyo);
                    // materialApoyo.removeChild(plantilla_MaterialApoyo);
                }
            });
        }
    }
}

function toggleVisibilidadArchivo(materiaApoyo_div) {
    var idMaterialDidactico_input = materiaApoyo_div.querySelector("input");
    var idMaterialDidactico = idMaterialDidactico_input.value;

    let toggleVisivilidad_input = materiaApoyo_div.querySelector("button");
    let toggleVisivilidad_label = toggleVisivilidad_input.innerText;

    let data = new FormData();
    data.append("idMaterialDidactico", idMaterialDidactico);

    if (toggleVisivilidad_label.indexOf("ocultar") != -1) {
        data.append("visibilidad", "oculto");
        toggleVisivilidad_input.innerText = "mostrar al alumno";
    } else {
        data.append("visibilidad", "visible");
        toggleVisivilidad_input.innerText = "ocultar al alumno";
    }

    let request = new XMLHttpRequest();
    request.open("post", "php/cambiaVisibilidadArchivo.php");
    request.send(data);

    request.onload = function () {
        if (request.status != 200) {
            alert(`Error: ${request.status}:: ${request.statusText}`);
        } else {
            console.log(request.responseText);
        }
    }
}

function elimina_MateriaApoyo(materiaApoyo_div) {
    var tipo = materiaApoyo_div.parentElement;
    tipo.removeChild(materiaApoyo_div);
    var idMaterialDidactico_input = materiaApoyo_div.querySelector("input");
    var idMaterialDidactico = idMaterialDidactico_input.value;
    var request = new XMLHttpRequest();
    request.open("post", "php/removeMaterialDidactico.php");
    var formData = new FormData();
    formData.append("idMaterialDidactico", idMaterialDidactico);
    request.send(formData);
    request.onload = function () {
        if (request.status != 200) {
            // error
        } else {
            console.log(request.responseText);
        }
    };
}

function obtenArchivos_MaterialDidactico_Servidor() {
    let plantilla_MaterialApoyo = document.querySelector(".plantilla_MaterialApoyo");

    var request = new XMLHttpRequest();
    request.open("get", "php/getInfoMaterialDidactico.php");
    let data = new FormData();
    let tipoSesion = sessionStorage.getItem("tipoSesion");
    data.append("tipoSesion", tipoSesion);
    request.send(data);
    request.onload = function () {
        if (request.status != 200) {
            alert(`Error: ${request.status}:: ${request.statusText}`);
        } else {
            if (request.responseText != "null") {
                // console.log(request.responseText);
                let responseText = JSON.parse(request.responseText);
                if (responseText["error"] != undefined) {
                    console.log(responseText);
                } else {
                    responseText.forEach(function (e) {
                        let idMaterialDidactico = e["idMaterialDidactico"];
                        let nombre = e["nombre"];
                        let tipo = e["tipo"];
                        let rutaServidor = e["rutaServidor"];
                        let estadoVisibilidad = e["estadoVisibilidad"];

                        if (tipoSesion == "Alumno" && estadoVisibilidad == "oculto") {
                            return;
                        }

                        let div_plantilla_MaterialApoyo = document.createElement("div");
                        div_plantilla_MaterialApoyo.innerHTML = plantilla_MaterialApoyo.innerHTML;
                        let iframe = div_plantilla_MaterialApoyo.querySelector("iframe");
                        let input_idMaterialDidactico = div_plantilla_MaterialApoyo.querySelector("input");

                        iframe.src = "./ViewerJS/#../materialApoyo/" + nombre;
                        input_idMaterialDidactico.value = idMaterialDidactico;
                        input_idMaterialDidactico.name = idMaterialDidactico;

                        if (tipo == "vistoClase") {
                            var material = document.querySelector(".vistos_en_clase");
                        } else {
                            var material = document.querySelector(".materialApoyo_archivos").querySelector(".externo");
                        }

                        div_plantilla_MaterialApoyo.classList = "plantilla_MaterialApoyo shadow p-3 mb-5 bg-white rounded _" + idMaterialDidactico;

                        if (tipoSesion == "Alumno") {
                            let footer_plantilla_MaterialApoyo_div = div_plantilla_MaterialApoyo.querySelector(".footer_plantilla_MaterialApoyo");
                            div_plantilla_MaterialApoyo.removeChild(footer_plantilla_MaterialApoyo_div);
                        }

                        if (estadoVisibilidad == "oculto") {
                            let toggleVisivilidad_input = div_plantilla_MaterialApoyo.querySelector("button");
                            toggleVisivilidad_input.innerText = "mostrar al alumno";
                            console.log(toggleVisivilidad_input.innerText);
                        }

                        material.insertAdjacentElement("beforeend", div_plantilla_MaterialApoyo);
                    });
                }
            } else {
                console.log("sin archivos de material didactico");
            }
        }
    }

    request.onerror = function () {
        alert("error inesperado a intentar obtener loas archivos del material didactico sorry bro :,v");
    }
}

function subirArchivo() {
    var tipoArchivo = document.querySelector("input[name='tipoArchivo']:checked");

    if (tipoArchivo == null || newFile_to_Upload == null || newFile_to_Upload.type != "application/pdf") {
        if (newFile_to_Upload == null) {
            // mensaje de error
            alert("elige un archivo");
        }

        if (newFile_to_Upload.type != "application/pdf") {
            // mensaje de error
            alert("seleciona un archivo pdf valido");
        }

        if (tipoArchivo == null) {
            // mensaje de error
            alert("elige una opcion");
        }
        return;
    }

    console.log("enviando");

    let formData = new FormData();
    formData.append("filePDF", newFile_to_Upload);
    formData.append("tipo", tipoArchivo.value);
    let request = new XMLHttpRequest();
    request.open("post", "php/subirMaterialApoyo.php");

    request.send(formData);
    request.onload = function () {
        if (request.status != 200) {
            alert(`Error ${request.status}: ${request.statusText}`);
        } else {

            // console.log(request.responseText);
            let responseText = JSON.parse(request.responseText);
            if (responseText["error"] != undefined) {
                alert("mensaje de error");
            } else {
                let name = responseText["name"];
                let tipo = responseText["tipo"];
                let idMaterialDidactico = responseText["idMaterialDidactico"];
                agrega_MaterialApoyo(name, tipo, idMaterialDidactico);
            }
        }
    }

    request.onerror = function () {
        alert("error inesperado al subir el archivo pdf al servidor sorry :,v");
    }
    request.onprogress = function (event) { // triggers periodically
        // event.loaded - how many bytes downloaded
        // event.lengthComputable = true if the server sent Content-Length header
        // event.total - total number of bytes (if lengthComputable)
        console.log(`Received ${event.loaded} of ${event.total}`);
    };
}

function agrega_MaterialApoyo(name, tipo, idMaterialDidactico) {
    let plantilla_MaterialApoyo = document.querySelector(".plantilla_MaterialApoyo");
    let iframe = plantilla_MaterialApoyo.querySelector("iframe");
    let input_idMaterialDidactico = plantilla_MaterialApoyo.querySelector("input");

    input_idMaterialDidactico.value = idMaterialDidactico;
    iframe.src = "./ViewerJS/#../materialApoyo/" + name;
    let div_plantilla_MaterialApoyo = document.createElement("div");
    div_plantilla_MaterialApoyo.innerHTML = plantilla_MaterialApoyo.innerHTML;

    if (tipo == "vistoClase") {
        var material = document.querySelector(".vistos_en_clase");
    } else {
        var material = document.querySelector(".materialApoyo_archivos").querySelector(".externo");
    }

    material.insertAdjacentElement("beforeend", div_plantilla_MaterialApoyo);
}