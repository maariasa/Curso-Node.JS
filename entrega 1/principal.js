/*********Software de la primera entrega del curso de Node.js*********/

/*Require necesario para la creación del archivo*/

const fs = require('fs');

/******************DATOS DE LOS CURSOS Y LAS OPCIONES PARA LOS COMANDOS DE YARGS******************/

/*Opciones para la inscripción*/
const opciones = {
  id_curso:{
    demand: true,
    alias: 'i'
  },
  nombre_interesado:{
    demand: true,
    alias: 'n'
  },
  cedula_interesado:{
    demand: true,
    alias: 'c'
  }
}


/*Lista de cursos disponibles*/
let cursos = [
{
  nombre: 'Curso Node.JS',
  id: 1,
  duracion: 36,
  valor: 80000
},
{
  nombre: 'Curso Angular',
  id: 2,
  duracion: 48,
  valor: 120000
},
{
  nombre: 'Curso Laravel',
  id: 3,
  duracion: 40,
  valor: 60000
},
{
  nombre: 'Curso C++',
  id: 4,
  duracion: 48,
  valor: 120000
},
{
  nombre: 'Curso Innovacion',
  id: 5,
  duracion: 36,
  valor: 80000
}

];

/************************************** METODOS *****************************************/

/*Método que muestra los cursos disponibles*/
let mostrarCursos = (cursos)=>{
  if (cursos.length<3){
    console.log('Hay menos de 3 cursos!');
  }
  else{
    for (i=0; i<cursos.length; i++){
      let info_curso = 'Nombre del curso: ' + cursos[i].nombre +
      ' | ID: ' + cursos[i].id +
      ' | Duracion: ' + cursos[i].duracion +
      ' | Costo: ' + cursos[i].valor;
      setTimeout(()=>{
          console.log(info_curso);
      },i*2000);
    }
  }
}

/*Genera un archivo con la información del curso y del interesado*/
let crearArchivo = (cursos, argv, x) =>{
  texto = '--DATOS DE LA PERSONA INSCRITA--' + '\n' +
          'Nombre: ' + argv.n + '\n' +
        'Cédula: ' + argv.c + '\n' +
        '--CURSO INSCRITO--' + '\n' +
          'ID: ' + argv.i + '\n' +
          'Nombre del curso: ' + cursos[x].nombre + '\n' +
          'Duracion: ' + cursos[x].duracion + '\n' +
          'Valor: ' +  cursos[x].valor;
  fs.writeFile('inscrito.txt', texto, (err) => {
    if (err) throw (err);
    console.log('Archivo creado.');
  });
}


/*************************************COMANDOS CON YARGS************************************************/

const argv = require('yargs')
.command('inscribir','Inscribirme en algun curso', opciones, (argv) => {
  let cursoId = cursos.find(idCurso => idCurso.id == argv.i); /*Función que busca si la ID ingresada por el usuario existe*/
  if (cursoId){ /*Se toma y muestra la información del curso a inscribir a partir del índice del arreglo donde se encuentra la ID del curso*/
    var x = cursos.indexOf(cursoId);
    console.log('La información del curso ' + argv.i + ' es la siguiente (será agregada al archivo de inscripción): \n')
    let info_curso = 'Nombre del curso: ' + cursos[x].nombre +
    ' | ID: ' + cursos[x].id +
    ' | Duracion: ' + cursos[x].duracion +
    ' | Costo: ' + cursos[x].valor + '\n';
    console.log(info_curso);
    /*Crea el archivo con toda la información requerida*/
    crearArchivo(cursos,argv,x);
    console.log('Felicidades, se ha inscrito existosamente.');
  }
  else{
    console.log('La ID del curso no existe! Por favor ingrese un ID que coincida con los cursos existentes mostrados a continuación.');
    mostrarCursos(cursos);
  }
})
.command('$0', 'Comando por defecto', () => {}, (argv) => {
    console.log('Cursos disponibles: ');
    mostrarCursos(cursos);
  })
.argv;
