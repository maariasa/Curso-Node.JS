const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const funciones = require('./helpers');
require('./helpers');

const directoriopublico = path.join(__dirname,'../public');
const directoriopartials = path.join(__dirname,'../partials');
app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'hbs');

/*Muestra la página principal*/
app.get('/', (req, res)=>{
  res.render('index');
});

/*Muestra la página de creacion de usuarios*/
app.get('/crear-u', (req, res)=>{
  res.render('crear-u');
});

/*Muestra la página de creacion de cursos*/
app.get('/crear-c', (req, res)=>{
  res.render('crear-c');
});

/*Muestra la página de los datos de los inscritos*/
app.get('/inscritos', (req, res)=>{
  res.render('inscritos');
});

/*Muestra la página de los datos de cursos*/
app.get('/cursos/', (req, res)=>{
  res.render('cursos');
});
app.get('/cursosDisp', (req, res)=>{
  res.render('cursosDisp');
});
app.get('/inscripcion', (req, res)=>{
  res.render('inscripcion');
});
app.get('/cancelacion', (req, res)=>{
  res.render('cancelacion');
});

app.get('/hub_coordinador', (req, res)=>{
  res.render('hub_coordinador');
});

app.get('/cursos_cord', (req, res)=>{
  res.render('cursos_cord');
});

/*Muestra la página de usuario creado*/
app.post('/creado-u', (req, res) => {
   res.render('creado-u', {
     id: parseInt(req.body.id),
     nombre: req.body.nombre,
     correo: req.body.correo,
     telefono: req.body.telefono
   });
});


/*Muestra la página de curso creado*/
app.post('/creado-c', (req, res) => {
   res.render('creado-c', {
     id_curso: parseInt(req.body.id_curso),
     nombre_curso: req.body.nombre_curso,
     descripcion: req.body.descripcion,
     valor: parseInt(req.body.valor),
     modalidad: req.body.modalidad,
     intensidad: parseInt(req.body.intensidad)
   });
});

app.post('/inscrito_c', (req, res)=>{
  res.render('inscrito_c', {
    id_u: parseInt(req.body.id_u),
    nombre_c: req.body.nombre_c
  })
});

/*
app.post('/redirige', (req,res)=>{
  funciones.listarU();
  let ide = parseInt(req.body.id);
  let existe_id = listaUsuarios.find(busco => busco.id == ide);

  res.render('redirige');
  if (existe_id){
    if (existe_id.tipo == 'coordinador'){
      console.log("El coordinador será redirigido a los cursos completos");
      res.redirect('/cursos');
    }
  }
  else{
    console.log("Esta ID no existe");
    res.redirect('/');
  }
});
*/

app.get('/manejo_inscritos', (req, res)=>{
  res.render('manejo_inscritos');
});


app.get('/editar_usuario', (req, res)=>{
  res.render('editar_usuario');
});


app.post('/redirige', (req,res)=>{
  funciones.listarU();
  let ide = parseInt(req.body.id);
  let encontre = listaUsuarios.find(busco => busco.id == ide);
  if (encontre){
    if (encontre.tipo == 'coordinador'){
      console.log("El tipo es: " + encontre.tipo)
      console.log("Es coordinador")
      res.redirect('/hub_coordinador');
    }
    else{
      console.log("Es " + encontre.tipo + " sera redirigido a")
      res.render('redirige');
    }
  }
  else{
    console.log("Esta ID no exitste!!!")
    res.redirect('/');
  }
});



/*Muestra la página de error por default*/
app.get('*', (req, res)=>{
  res.render('error',{
    estudiante: 'Error'
  })
});

app.listen(3000, ()=> {
  console.log("Escuchando en el Port 3000")
});




/*
HISTORIA DE USUARIO #1
como coordinador necesito crear cursos de educación continua para ser divulgados entre posibles interesados.
Criterios de aceptación
Se deben ingresar los siguientes datos requeridos por cada curso: Nombre completo, un id del curso, descripción y valor.
Debe permitir el ingreso de los siguientes datos opcionales:  modalidad (virtual o presencial) e intensidad horaria
No permite que existan dos cursos con el mismo id
Los cursos deben tener una variable estado, por defecto al crearse van a estar en disponibles
*/

/*
HISTORIA DE USUARIO #2
Yo como interesado necesito ver una lista de cursos disponibles para identificar cual es el de mi interés
Criterios de aceptación
Se lista la información básica del curso en un formato que sea amigable con el interesado (nombre, descripción y valor)
Permite al interesado seleccionar un curso y ver la información más detallada (descripción, modalidad e intensidad horaria)
Solamente muestra los cursos que estén en estado disponible
*/

/*
HISTORIA DE USUARIO #3
Yo como aspirante necesito realizar mi proceso de inscripción para reservar mi cupo en el curso  de mi interés
Criterios de aceptación
El aspirante debe ingresar la siguiente información obligatoria: documento de identidad, nombre, correo y teléfono
Un aspirante no se puede matricular dos veces en el mismo curso
Debe generar un mensaje de registro exitoso al usuario o uno de error en caso contrario.
*/

/*
HISTORIA DE USUARIO #4
Yo como coordinador de educación continua necesito ver los inscritos por cada uno de los cursos para poder tomar la decisión
Criterios de aceptación
Debe mostrar el listado de cursos disponibles
Por cada uno de los cursos muestralas personas inscritas
Puede cambiar el estado de un curso de disponible a cerrado
*/

/*
HISTORIA DE USUARIO #5
Yo como coordinador necesito poder eliminar a las personas que ya no están interesadas
 en el curso para poder liberar los cupos del curso facilitando la inscripción a nuevas personas.
 Criterios de aceptación
 Se debe eliminar el usuario de la lista a partir del ingreso por parte del coordinador de los datos
 del usuario y del curso.
Me debe imprimir el listado de aspirantes del curso después de eliminar al especificado.
*/

/*
RECOMENDACIONES
Utilizar dos archivos, uno para la lista de usuarios y otra para los cursos.
Puede usar un tercero para relacionar usuarios con cursos.
Al momento de utilizar el FileSystem para crear un archivo .Json,
 lo creará en la carpeta raízdel proyecto (en donde se encuentra el Package.Json)
  para guardarlo en otra carpeta se debe indicar la ruta de la carpeta.
Al momento de listar los cursos, la carpeta raízes la de la función que se está invocando.
 Pero debe tener en cuenta cuales carpetas están apuntando a la raíz al haber hecho uso de
  __dirname con un path o con un static. Puede utilizar las funciones creadas en la explicación de archivos,
   e invocarlas con un helper o con un archivo de funciones, para ser llamadas directamente desde app.js
    y según sus resultados se invocan en el (res).
*/
