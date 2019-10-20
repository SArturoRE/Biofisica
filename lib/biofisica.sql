drop table if exists alumno;
drop table if exists profesor;
drop table if exists usuario;
drop function if exists agregaAlumno;
drop function if exists agregaProfesor;
drop function if exists alumnoRegistrado;
drop function if exists profesorRegistrado;
drop function if exists getInfousuario;

create table usuario(
    idUsuario int not null auto_increment primary key,
    nombre varchar(20) not null,
    apellidoP varchar(20) not null,
    apellidoM varchar(20) not null, 
    password varchar(20) not null,
    correo varchar(30) not null
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

create function agregaAlumno(nombre varchar(20), apellidoP varchar(20), apellidoM varchar(20), password varchar(20), correo varchar(30), matricula int)
returns int
begin
    declare idUsuario_temp int;
    insert into usuario(nombre, apellidoP, apellidoM, password, correo) values(nombre, apellidoP, apellidoM, password, correo);
    select idUsuario into idUsuario_temp from usuario order by idUsuario desc limit 1;
    insert into alumno(matricula, idUsuario) values(matricula, idUsuario_temp);
    return 0;
end;

create function agregaProfesor(nombre varchar(20), apellidoP varchar(20), apellidoM varchar(20), password varchar(20), correo varchar(30), numTrabajador int)
returns int
begin
    declare idUsuario_temp int;
    insert into usuario(nombre, apellidoP, apellidoM, password, correo) values(nombre, apellidoP, apellidoM, password, correo);
    select idUsuario into idUsuario_temp from usuario order by idUsuario desc limit 1;
    insert into profesor(numTrabajador, idUsuario) values(numTrabajador, idUsuario_temp);
    return 0;
end;

create function alumnoRegistrado(matricula int)
returns json
begin
    declare idUsuario_temp int;
    declare datos json;

    select idUsuario into idUsuario_temp from alumno where alumno.matricula=matricula;  

    if idUsuario_temp != null then
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

    if idUsuario_temp != null then
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
        'numTrabajador', numTrabajador,
        'nombre', nombre,
        'apellidoP', apellidoP,
        'apellidoM', apellidoM,
        'password', password,
        'correo', correo
        ) into datos
    from usuario, profesor where usuario.idUsuario=idUsuario and usuario.idUsuario=profesor.idUsuario;
    return datos;
end;