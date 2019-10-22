drop table if exists alumno;
drop table if exists profesor;
drop table if exists usuario;
drop table if exists materialDidactico;

drop function if exists agregaAlumno;
drop function if exists agregaProfesor;
drop function if exists alumnoRegistrado;
drop function if exists profesorRegistrado;
drop function if exists getInfousuario;
drop function if exists agrega_materialDidactico;
drop function if exists removeMaterialDidactico;
-- drop function if exists getInfoMaterialDidactico;
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
        set estado = json_object("error", "usuario con la matricula ingresada ya se encuentra registrado");
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
        set estado = json_object("error", "usuario con el numero de trabajdor ingresado ya se encuentra registrado");
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
        set datos = json_object("error","alumno con la matricula proporcionada no encontrado");
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
        set datos = json_object("error","profesor con la matricula proporcionada no encontrado");
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

-- create function getInfoMaterialDidactico()
-- returns json
-- begin
--     declare datos json;

--     select json_object(
--         'idMaterialDidactico', idMaterialDidactico,
--         'nombre', nombre,
--         'tipo', tipo,
--         'rutaServidor', rutaServidor,
--         'estadoVisibilidad', estadoVisibilidad
--     ) into datos
--     from materialDidactico;

--     if datos is null then
--         set datos = json_object();
--     end if;
    
--     return datos;
-- end;