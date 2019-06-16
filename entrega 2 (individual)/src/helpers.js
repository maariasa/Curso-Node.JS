/*Archivo donde se guardan los Helpers y las funciones adicionales*/

const hbs = require('hbs');
const fs = require('fs');

/*Arreglos donde se almacenan los datos de los cursos y de los usuarios*/
listaUsuarios =require('../datos_inscritos.json');
listaCursos = require('../datos_cursos.json');;

/*************************************************************
HELPERS
**************************************************************/

/*Helper que muestra los inscritos*/
hbs.registerHelper('mostrarUsuarios', () => {
  listaUsuarios = require('../datos_inscritos.json');
  let texto = "<table class='table'> \
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


/*Helper que crea la lista de cursos para realizar inscripcion*/
hbs.registerHelper('mostrarCursosInscribir', () => {
  let texto ="";
  dispo = listaCursos.filter(busco => busco.estado == 'disponible');
    if (dispo.length == listaCursos.length){
      texto = 'No hay cursos disponibles.';
    }
    else {
    dispo.forEach(curso=>{
      texto=texto+"<option>"+curso.nombre_curso+"</option>"
    })
    }

    return texto;
  });


  /*Helper que crea la lista de cursos para realizar cancelacion*/
  hbs.registerHelper('mostrarCursosCancelar', (id) => {
    let texto ="";
    dispo = listaUsuarios.find(busco => busco.id == id);
    if(dispo.cursos.length){
      texto=`<h3>Bienvenido</h3>

      <form action="/cancelado-a" method="post">

          <label for="opcion">Elija el curso que desea cancelar</label>
          <select multiple class="form-control" name="opcion">  `
    dispo.cursos.forEach(curso=>{
      texto=texto+"<option>"+listaCursos.find(busco =>busco.id_curso==curso).nombre_curso+"</option>"
    })
  texto=texto+`</select> <input input type="hidden" name="id" value=${id} >
  <button>Aceptar</button>
  </form>`}
    else{
      texto="<h2>Usted no tiene cursos inscritos</h2>"
    }
      return texto;
    });


/*Helper que muestra los cursos disponibles*/
hbs.registerHelper('mostrarCursos', () => {
  let i = 0
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
  <th> Inscritos (Por ID) </th>\
  </thead>\
  <tbody>";
  dispo = listaCursos.filter(busco => busco.estado == 'disponible');
  dispo.forEach(curso => {
      texto = texto +
             "<tr>" +
             "<td>" + curso.id_curso + '</td>' +
             "<td>" + curso.nombre_curso + '</td>' +
             "<td>" + curso.descripcion + '</td>' +
             "<td>" + curso.valor + "</td>" +
             "<td>" + curso.modalidad + "</td>" +
             "<td>" + curso.intensidad + "</td>" +
             "<td>" + curso.estado + '</td>';
             for (i=0; i < curso.inscritos.length; i++){
               texto = texto +
               "<td>" + curso.inscritos[i] + "</td>";
             }
             texto = texto +
             "</tr>"
    });
    texto = texto + "</tbody></table>"
  return texto;
});

/*Helper que muestra solamente los cursos disponibles*/
hbs.registerHelper('mostrarCursosDisp', () => {
  listaCursos = require('../datos_cursos.json');
  let texto = "<div class='accordion' id='accordionExample'>";
  dispo = listaCursos.filter(busco => busco.estado == 'disponible');
  if (dispo.length == listaCursos.length){
    texto = 'No hay cursos disponibles.';
  }
  else {
    i = 1;
    dispo.forEach(curso => {
      texto = texto +
                `<div class="card">
                <div class="card-header" id="heading${i}">
                  <h2 class="mb-0">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                      ${curso.nombre_curso}<br>
                      Valor: ${curso.valor} <br>
                    </button>
                  </h2>
                </div>

                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                  <div class="card-body">
                   Descripcion: ${curso.descripcion} <br>
                   Modalidad: ${curso.modalidad} <br>
                   Intensidad horaria: ${curso.intensidad} <br>
                  </div>
                </div>`
             i=i+1;
    })
    texto = texto + '</div>';
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
    tipo: 'aspirante',
    cursos: []
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
    mensaje = "El usuario se ha creado exitosamente.";
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
    estado: 'disponible',
    inscritos: []
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
hbs.registerHelper('inscribirCurso', (id_a,nombre_c)=>{
  listarU();
  listarC();
  listarI();
  let curso = listaCursos.find(busco => busco.nombre_curso == nombre_c);
  let usuario = listaUsuarios.find(busco => busco.id == id_a);
  let esta=curso.inscritos.find(busco=>busco==id_a);
  if(esta) return  "<h2>el usuario ya esta inscrito en ese curso</h2>"
  curso.inscritos.push(parseInt(id_a));
  usuario.cursos.push(curso.id_curso);
  guardarCurso();
  guardarUsuario();

 return  "<h2>usuario inscrito</h2>";
  });

  /*Helper que cancela la inscripcion de aspirante a un curso*/
hbs.registerHelper('cancelarInscripcion', (id_a,nombre_c)=>{
  listarU();
  listarC();
  listarI();
  let curso = listaCursos.find(busco => busco.nombre_curso == nombre_c);
  let usuario = listaUsuarios.find(busco => busco.id == id_a);
  console.log(id_a);
  console.log(nombre_c);
  curso.inscritos.splice(curso.inscritos.indexOf(id_a));
  usuario.cursos.splice(usuario.cursos.indexOf(curso.id_curso));
  texto="<h2>Curso cancelado</h2>";
  guardarCurso();
  guardarUsuario();
  if(usuario.cursos.length>0){
  texto=texto+`<form>

  <label for="op">Estos son los cursos en los que aun esta inscrito</label>
  <select multiple class="form-control" name="op" >  `
usuario.cursos.forEach(curso=>{
texto=texto+"<option>"+listaCursos.find(busco =>busco.id_curso==curso).nombre_curso+"</option>"
})
texto=texto+"</select> </form>";
  }else{texto= texto+"<h2>No esta inscrito en mas cursos</h2>"}

 return  texto;
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

/*Helper que permite eliminar la inscripcion de un aspirante (ver. coordinador)*/
hbs.registerHelper('cancelarInscripcion2', (id_u, id_c)=>{
  listarU();
  listarC();
  listarI();
  let curso = listaCursos.find(busco => busco.id_curso == id_c);
  let usuario = listaUsuarios.find(busco => busco.id == id_u);
  if (curso && usuario){
    curso.inscritos.splice(curso.inscritos.indexOf(id_u));
    usuario.cursos.splice(usuario.cursos.indexOf(curso.id_curso));
    texto = "<h3><b>Curso cancelado exitosamente. Aquí se muestran los datos de los que aún están inscritos.</b></h3>"
    guardarCurso();
    guardarUsuario();
    texto = texto + mostrarAspirantes(id_c);
  }
  else{
    texto = 'El curso y/o usuario no existe. Por favor intentelo de nuevo.'
  }
  return texto;
});

/*
hbs.registerHelper('eliminarInscripcion', (id_u, nombre_c)=>{
  listarU();
  listarC();
  let curso = listaCursos.find(busco => busco.nombre_curso == nombre_c);
  let usuario = listaUsuarios.find(busco => busco.id == id_u);
  if (curso && usuario){
    let encontre = listaCursos.filter(busco => busco.inscritos != id_u);
    let encontre2 = listaUsuarios.filter(busco => busco.cursos != id_u);
    listaUsuarios = encontre;
    guardarCurso();
    mensaje = "Inscripcion cancelada exitosamente."
  }
  else{
    mensaje = "No existe el curso y/o el usuario. Intentelo de nuevo."
  }
  return mensaje;
});
*/

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

/*Helper que permite editar el estado de un curso*/
hbs.registerHelper('cambiarEstadoCurso', (id_c, estado) => {
  listarC();
  let encontre = listaCursos.find(busco => busco.id_curso == id_c);
  if (encontre){
    encontre.estado = estado;
    guardarCurso();
    texto = "El estado del curso ha sido cambiado exitosamente";
  }
  else {
    texto = "Este curso no existe. Por favor intentelo de nuevo.";
  }
  return texto;
});





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
    listaCursos.inscritos = require('../cursos_inscritos.json');
  }catch(error){
    listaCursos.inscritos = [];
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
  let datos = JSON.stringify(listaCursos.inscritos);
  fs.writeFile('cursos_inscritos.json', datos, (err)=>{
    if (err) throw (err);
    console.log("Archivo de inscritos en cursos creado con exito");
  });
};

/*Muestra los aspirantes después de borrar un curso*/
let mostrarAspirantes = (id_c)=>{
  listarC();
  listarU();
  i = 0;
  let texto = "<table class='table'> \
  <thead> \
  <th> ID </th> \
  <th> Nombre </th>\
  <th> Correo </th>\
  <th> Telefono </th>\
  </thead>\
  <tbody>";
  let curso_especifico = listaCursos.find(busco => busco.id_curso == id_c);
  for (i=0; i<curso_especifico.inscritos.length; i++){
    let id_a_buscar = curso_especifico.inscritos[i];
    let encontre = listaUsuarios.find(busco => busco.id == id_a_buscar);
    texto = texto +
           "<tr>" +
           "<td>" + encontre.id + '</td>' +
           "<td>" + encontre.nombre + '</td>' +
           "<td>" + encontre.correo + '</td>' +
           "<td>" + encontre.telefono + "</td></tr>";
  }
  texto = texto + "</tbody></table>"
  return texto;

}


module.exports = {
  listarU
}
