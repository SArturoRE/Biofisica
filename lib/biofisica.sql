drop table if exists alumno_seccion;
drop table if exists examen_seccion;
drop table if exists seccion;
drop table if exists alumno;
drop table if exists profesor;
drop table if exists usuario;
drop table if exists materialDidactico;
drop table if exists examen_pregunta;
drop table if exists examen;
drop table if exists pregunta;

drop function if exists agregaAlumno;
drop function if exists agregaProfesor;
drop function if exists alumnoRegistrado;
drop function if exists profesorRegistrado;
drop function if exists getInfousuario;
drop function if exists agrega_materialDidactico;
drop function if exists removeMaterialDidactico;
drop function if exists addSeccion;
drop function if exists addAlumnoSeccion;
drop function if exists addPregunta;
drop function if exists addExamen;
drop function if exists addExamenPregunta;
drop function if exists getInfoSeccion;
drop function if exists addExamenSeccion;

-- 
-- tablas
-- 

create table usuario(
    idUsuario int not null auto_increment primary key,
    nombre varchar(20) not null,
    apellidoP varchar(20) not null,
    apellidoM varchar(20) not null, 
    password varchar(20) not null,
    grupo varchar(30) not null
);

create table profesor(
    numTrabajador int not null primary key,
    idUsuario int not null,
    foreign key(idUsuario) references usuario(idUsuario)
);

create table alumno(
    matricula int not null primary key,
    idUsuario int not null,
    foreign key(idUsuario) references usuario(idUsuario)
);

create table materialDidactico(
    idMaterialDidactico int auto_increment primary key,
    nombre varchar(50) not null,
    tipo varchar(20) not null,
    rutaServidor varchar(20) not null,
    estadoVisibilidad varchar(20) not null
);

create table seccion(
    idSeccion int primary key auto_increment,
    numTrabajador int not null,
    nomSeccion varchar(30) not null,
    foreign key(numTrabajador) references profesor(numTrabajador)
);

create table alumno_seccion(
    id int primary key auto_increment,
    matricula int not null,
    idSeccion int not null,
    foreign key(matricula) references alumno(matricula),
    foreign key(idSeccion) references seccion(idSeccion)
);

create table examen(
    idExamen int primary key auto_increment,
    duracion time not null,
    fechaAplicacion datetime not null,
    fechaLimiteAplicacion datetime not null
);

create table examen_seccion(
    id int auto_increment primary key not null,
    idExamen int not null,
    idSeccion int not null,
    foreign key(idExamen) references examen(idExamen),
    foreign key(idSeccion) references seccion(idSeccion)
);

create table pregunta(
    idPregunta int auto_increment primary key,
    descripcion varchar(200) not null,
    r1 varchar(50) not null,
    r2 varchar(50) not null,
    r3 varchar(50) not null,
    respuestaCorrecta varchar(50) not null,
    unidad int not null
);

create table examen_pregunta(
    id int auto_increment primary key,
    idExamen int not null,
    idPregunta int not null,
    foreign key(idExamen) references examen(idExamen),
    foreign key(idPregunta) references pregunta(idPregunta)
);

-- 
-- funciones
-- 

create function agregaAlumno(nombre varchar(20), apellidoP varchar(20), apellidoM varchar(20), password varchar(20), grupo varchar(30), matricula int)
returns json
begin
    declare idUsuario_temp int;
    declare estado json;
    declare existeAlumno int;
    select matricula into existeAlumno from alumno where alumno.matricula=matricula; 

    if existeAlumno is null then
        insert into usuario(nombre, apellidoP, apellidoM, password, grupo) values(nombre, apellidoP, apellidoM, password, grupo);
        select idUsuario into idUsuario_temp from usuario order by idUsuario desc limit 1;
        insert into alumno(matricula, idUsuario) values(matricula, idUsuario_temp);
        set estado = json_object("success", "informacion guardada exitosamente");
    else
        set estado = json_object("error", concat("usuario con la matricula: ",matricula,", ya se encuentra registrado"));
    end if;
    return estado;
end;

create function agregaProfesor(nombre varchar(20), apellidoP varchar(20), apellidoM varchar(20), password varchar(20), grupo varchar(30), numTrabajador int)
returns json
begin
    declare idUsuario_temp int;
    declare estado json;
    declare existeProfesor int;
    select numTrabajador into existeProfesor from profesor where profesor.numTrabajador=numTrabajador; 
    
    if existeProfesor is null then
        insert into usuario(nombre, apellidoP, apellidoM, password, grupo) values(nombre, apellidoP, apellidoM, password, grupo);
        select idUsuario into idUsuario_temp from usuario order by idUsuario desc limit 1;
        insert into profesor(numTrabajador, idUsuario) values(numTrabajador, idUsuario_temp);
        set estado = json_object("success", "informacion guardada exitosamente");
    else
        set estado = json_object("error", concat("usuario con el numero de trabajador: ",numTrabajador,", ya se encuentra registrado"));
    end if;
    return estado;
end;

create function alumnoRegistrado(matricula int)
returns json
begin
    declare idUsuario_temp int;
    declare datos json;

    select idUsuario into idUsuario_temp from alumno where alumno.matricula=matricula;  

    if idUsuario_temp is null then
        set datos = json_object("error",concat("alumno con la matricula: ",matricula,", no registrado"));
    else
        set datos = getInfousuario(idUsuario_temp);
    end if;

    return datos;
end;

create function profesorRegistrado(numTrabajador int)
returns json
begin
    declare idUsuario_temp int;
    declare datos json;

    select idUsuario into idUsuario_temp from profesor where profesor.numTrabajador=numTrabajador;  

    if idUsuario_temp is null then
        set datos = json_object("error",concat("profesor con el numero de trabajador: ",numTrabajador,", no registrado"));
    else
        set datos = getInfousuario(idUsuario_temp);
    end if;

    return datos;
end;

create function getInfousuario(idUsuario int)
returns json
begin
    declare datos json;
    select json_object(
        'nombre', nombre,
        'apellidoP', apellidoP,
        'apellidoM', apellidoM,
        'password', password,
        'grupo', grupo
        ) into datos
    from usuario where usuario.idUsuario=idUsuario;
    return datos;
end;

create function agrega_materialDidactico(nombreTemp varchar(50), tipoTemp varchar(20), rutaServidorTemp varchar(20), estadoVisibilidadTemp varchar(20))
returns int
begin
    declare idMaterialApoyo_Temp int;
    insert into materialDidactico(nombre, tipo, rutaServidor, estadoVisibilidad) values(nombreTemp, tipoTemp, rutaServidorTemp, estadoVisibilidadTemp);
    select idMaterialDidactico into idMaterialApoyo_Temp from materialDidactico order by idMaterialDidactico desc limit 1;
    return idMaterialApoyo_Temp;
end;

create function removeMaterialDidactico(materialDidactico_Temp int )
returns int
begin
    delete from materialDidactico where idMaterialDidactico=materialDidactico_Temp;
    return 1;
end;

create function addSeccion(numTrabajadorTemp int, nomSeccionTemp varchar(30))
returns json
begin
    declare response json;
    declare idSeccionTemp int;

    select idSeccion into idSeccionTemp
    from seccion
    where nomSeccion=nomSeccionTemp;

    if idSeccionTemp is null then
        insert into seccion(numTrabajador ,nomSeccion) values(numTrabajadorTemp, nomSeccionTemp);
    else
        set response = json_object("error", concat("la seccion con el nombre: ", nomSeccionTemp, ", ya se encuentra registrada"));
    end if;
    return response;
end;

create function addAlumnoSeccion(matriculaTemp int, nomSeccionTemp varchar(30))
returns json
begin
    declare response json;
    declare idSeccionTemp int;
    declare idUsuarioTemp int;

    select idSeccion into idSeccionTemp
    from seccion
    where nomSeccion=nomSeccionTemp;

    if idSeccionTemp is null then
        set response = json_object("error", concat("la seccion con el nombre: ", nomSeccionTemp, ", no esta registrada"));
        select idUsuario into idUsuarioTemp from alumno where matricula=matriculaTemp; 
        delete from alumno where matricula=matriculaTemp;
        delete from usuario where idUsuario=idUsuarioTemp;
        delete from alumno_seccion where matricula=matriculaTemp;
    else
        insert into alumno_seccion(matricula ,idSeccion) values(matriculaTemp, idSeccionTemp);
    end if;
    return response;
end;

create function addPregunta(descripcionTemp varchar(200), r1Temp varchar(50), r2Temp varchar(50), r3Temp varchar(50), respuestaCorrectaTemp varchar(50), unidadTemp int)
returns int
begin
    declare idPreguntaTemp int;

    insert into pregunta(descripcion, r1, r2, r3, respuestaCorrecta, unidad)
    values(descripcionTemp, r1Temp, r2Temp, r3Temp, respuestaCorrectaTemp, unidadTemp);
    select idPregunta into idPreguntaTemp from pregunta order by idPregunta desc limit 1;

    return idPreguntaTemp;
end;

create function addExamen(duracionTemp time, fechaAplicacionTemp datetime, fechaLimiteAplicacionTemp datetime)
returns int
begin
    declare idExamenTemp int;

    insert into examen(duracion, fechaAplicacion, fechaLimiteAplicacion)
    values(duracionTemp, fechaAplicacionTemp, fechaLimiteAplicacionTemp);
    select idExamen into idExamenTemp from examen order by idExamen desc limit 1;

    return idExamenTemp;
end;

create function addExamenPregunta(idExamenTemp int, descripcionTemp varchar(200), r1Temp varchar(50), r2Temp varchar(50), r3Temp varchar(50), respuestaCorrectaTemp varchar(50), unidadTemp int)
returns int
begin
    declare idPreguntaTemp int;

    set idPreguntaTemp = addPregunta(descripcionTemp, r1Temp, r2Temp, r3Temp, respuestaCorrectaTemp, unidadTemp);
    
    insert into examen_pregunta(idExamen, idPregunta)
    values(idExamenTemp, idPreguntaTemp);
    
    return 1;
end;

create function addExamenSeccion(idExamenTemp int, nomSeccionTemp varchar(50), idProfesor int)
returns json
begin
    declare response json;
    declare idSeccionTemp int;
    
    select idSeccion into idSeccionTemp from seccion where nomSeccion=nomSeccionTemp and numTrabajador=idProfesor;

    if idSeccionTemp is null then
        set response = json_object("error", concat("la seccion con el nombre: ",nomSeccionTemp,", no esta registrada para el profesor con la sesion actual"));
        delete from examen where idExamen=idExamenTemp;
    else
        insert into examen_seccion(idExamen, idSeccion) values(idExamenTemp, idSeccionTemp);
    end if;

    return response;
end;