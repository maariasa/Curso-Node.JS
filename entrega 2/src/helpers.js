/*Archivo donde se guardan los Helpers y las funciones adicionales*/

const hbs = require('hbs');
const fs = require('fs');

/*Arreglos donde se almacenan los datos de los cursos y de los usuarios*/
listaUsuarios = [];
listaCursos = [];
inscritosCursos = [];

/*************************************************************
HELPERS
**************************************************************/

/*Helper que muestra los inscritos*/
hbs.registerHelper('mostrarUsuarios', () => {
  listaUsuarios = require('../datos_inscritos.json');
  let texto = "<table> \
  <thead> \
  <th> ID </th> \
  <th> Nombre </th>\
  <th> Correo </th>\
  <th> Telefono </th>\
  <th> Tipo </th>\
  </thead>\
  <tbody>";
  listaUsuarios.forEach(usuario => {
    texto = texto +
           "<tr>" +
           "<td>" + usuario.id + '</td>' +
           "<td>" + usuario.nombre + '</td>' +
           "<td>" + usuario.correo + '</td>' +
           "<td>" + usuario.telefono + "</td>" +
           "<td>" + usuario.tipo + '</td></tr>';
  });
  texto = texto + "</tbody></table>"
  return texto;
});



/*Helper que muestra los cursos disponibles*/
hbs.registerHelper('mostrarCursos', () => {
  listaCursos = require('../datos_cursos.json');
  let texto = "<table> \
  <thead> \
  <th> ID </th> \
  <th> Curso </th>\
  <th> Descripción </th>\
  <th> Costo </th>\
  <th> Modalidad </th>\
  <th> Intensidad Horaria </th>\
  <th> Estado </th>\
  </thead>\
  <tbody>";
  listaCursos.forEach(curso => {
      texto = texto +
             "<tr>" +
             "<td>" + curso.id_curso + '</td>' +
             "<td>" + curso.nombre_curso + '</td>' +
             "<td>" + curso.descripcion + '</td>' +
             "<td>" + curso.valor + "</td>" +
             "<td>" + curso.modalidad + "</td>" +
             "<td>" + curso.intensidad + "</td>" +
             "<td>" + curso.estado + "</td>" +
             "<td>" + "<button onclick='{{borrarCurso curso.nombre_curso}}'>Eliminar</button>" + '</td></tr>';
    });
    texto = texto + "</tbody></table>"
  return texto;
});

/*Helper que muestra solamente los cursos disponibles*/
hbs.registerHelper('mostrarCursosDisp', () => {
  listaCursos = require('../datos_cursos.json');
  let texto = "<table> \
  <thead> \
  <th> Nombre </th>\
  <th> Descripción </th>\
  <th> Costo </th>\
  </thead>\
  <tbody>";
  dispo = listaCursos.filter(busco => busco.estado == 'disponible');
  if (dispo.length == listaCursos.length){
    texto = 'No hay cursos disponibles.';
  }
  else {
    dispo.forEach(curso => {
      texto = texto +
             "<tr>" +
             "<td>" + curso.nombre_curso + '</td>' +
             "<td>" + curso.descripcion + '</td>' +
             "<td>" + curso.valor + '</td></tr>';
    });
    texto = texto + "</tbody></table>";
  }
  return texto;
});


/*Helper que permite almacenar datos de un usuario*/
hbs.registerHelper('crearUsuario', (id_u, nombre_u, correo_u, telefono_u)=>{
  listarU();
  let usuario = {
    id: id_u,
    nombre: nombre_u,
    correo: correo_u,
    telefono: telefono_u,
    tipo: 'aspirante'
  };
  let duplicado = listaUsuarios.find(busco => busco.id == id_u);
  let e_duplicado = listaUsuarios.find(busco => busco.correo == correo_u);
  if (duplicado){
    mensaje = "La ID de este usuario ya existe en la base.";
  }
  else if (e_duplicado){
    mensaje = "Este correo ya está asociado con una cuenta existente."
  }
  else{
    listaUsuarios.push(usuario);
    console.log(listaUsuarios);
    guardarUsuario();
    mensaje = "El usuario se ha creado exitosamente";
  }
  return mensaje;
});


/*Helper que permite almacenar datos de un curso*/
hbs.registerHelper('crearCurso', (id_c, nombre_c, descrip, costo, mod, inten)=>{
  listarC();
  let curso = {
    id_curso: id_c,
    nombre_curso: nombre_c,
    descripcion: descrip,
    valor: costo,
    modalidad: mod,
    intensidad: inten,
    estado: 'disponible'
  };
  let duplicado = listaCursos.find(busco => busco.id_curso == id_c);
  if (duplicado){
    console.log("La ID de este curso ya existe en la base. Intentelo de nuevo");
    texto = "La ID de este curso ya existe en la base. Intentelo de nuevo";
  }
  else{
    listaCursos.push(curso);
    console.log(listaCursos);
    guardarCurso();
    texto = "El curso se ha creado exitosamente";
  }
  return texto;
});

/*Helper que ingresa a un aspirante a un curso*/
hbs.registerHelper('ingresarAspiranteCurso', ()=>{
  listarI();
  let inscrito = {
    id_curso: id_c,
    nombre_curso: nombre_c,
    nombre_u: descrip,
    id_u: a,
    correo_u: x,
    telefono: y,
    matriculado: true
  };
  let duplicado = listaCursos.find(busco => busco.id_curso == id_c);
  if (duplicado){
    console.log("La ID de este curso ya existe en la base. Intentelo de nuevo");
    texto = "La ID de este curso ya existe en la base. Intentelo de nuevo";
  }
  else{
    listaCursos.push(curso);
    console.log(listaCursos);
    guardarInscritosCurso();
    texto = "El curso se ha creado exitosamente";
  }
  return texto;
});

/*Helper que permite eliminar un curso*/
hbs.registerHelper('borrarCurso', (nombre)=>{
  listarC();
  let encontre = listaCursos.filter(busco => busco.nombre != nombre);
  if (encontre.length == listaCursos.length){
    console.log("El curso " + nombre + " no existe");
  }
  else {
    listaCursos = encontre;
    guardarCurso();
  }
})
/*
let eliminar = (nombre) => {
  listar();
  let encontre = listaEstudiantes.filter(busco => busco.nombre != nombre); //Crea un vector sin el nombre ingresado, "eliminandolo"
  if (encontre.length == listaEstudiantes.length){
    console.log("Ese tal " + nombre + " no existe");
  }
  else {
    listaEstudiantes = encontre;
    guardar();
  }
}


*/

/*Helper que redirige usuarios segun su tipo*/
/*
hbs.registerHelper('redireccionUsuario', (id, nombre)=>{
  listarU();
  let buscar = listaUsuarios.find(busco => busco.id == id);
  if (buscar){
    if (buscar.tipo == 'coordinador'){
      mensaje = "The foe's " + nombre + "used Rage Powder!"
    }
    else{
      mensaje = "Ur a scrub m8"
    }
  }
  else {
    mensaje = "Este ID no existe. Por favor verifique que se registró correctamente"
  }
  return mensaje;

});
*/


/****************************************
FUNCIONES
****************************************/

/*Carga el archivo de usuarios*/
let listarU = ()=>{
  try{
    listaUsuarios = require('../datos_inscritos.json');
  }catch(error){
    listaUsuarios = [];
  }
}

/*Carga el archivo de cursos*/
let listarC = ()=>{
  try{
    listaCursos = require('../datos_cursos.json');
  }catch(error){
    listaCursos = [];
  }
}

/*Carga el archivo de inscritos*/
let listarI = ()=>{
  try{
    listaCursos = require('../cursos_inscritos.json');
  }catch(error){
    inscritosCursos = [];
  }
}

/*Guarda un usuario en el archivo*/
let guardarUsuario = ()=>{
  let datos = JSON.stringify(listaUsuarios);
  fs.writeFile('datos_inscritos.json', datos, (err)=>{
    if (err) throw (err);
    console.log("Archivo de inscritos creado con exito");
  });
};

/*Guarda un curso en el archivo*/
let guardarCurso = ()=>{
  let datos = JSON.stringify(listaCursos);
  fs.writeFile('datos_cursos.json', datos, (err)=>{
    if (err) throw (err);
    console.log("Archivo de cursos creado con exito");
  });
};

/*Guarda los inscritos en cursos en un archivo*/
let guardarInscritos = ()=>{
  let datos = JSON.stringify(inscritosCursos);
  fs.writeFile('cursos_inscritos.json', datos, (err)=>{
    if (err) throw (err);
    console.log("Archivo de inscritos en cursos creado con exito");
  });
};

/*





hbs.registerHelper('listar', () => {
  listaEstudiantes = require('./listado.json');
  let texto = "<table> \
  <thead> \
  <th> Nombre </th> \
  <th> Matematicas </th>\
  <th> Ingles </th>\
  <th> Programacion </th>\
  </thead>\
  <tbody>";
  listaEstudiantes.forEach(estudiante => {
    texto = texto +
           "<tr>" +
           "<td>" + estudiante.nombre + '</td>' +
           "<td>" + estudiante.matematicas + '</td>' +
           "<td>" + estudiante.ingles + '</td>' +
           "<td>" + estudiante.programacion + '</td></tr>';
  });
  texto = texto + "</tbody></table>"
  return texto;
});


*/
