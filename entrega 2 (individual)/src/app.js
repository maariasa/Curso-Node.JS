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
  res.render('cursosDisp',{
    id: parseInt(req.query.id)
  });
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


app.post('/inscripcion', (req, res)=>{
  res.render('inscripcion',
  {
    id: (req.body.id)
  });
});
app.post('/cancelacion', (req, res)=>{
  res.render('cancelacion',{
    id: (req.body.id)
  });
});
/*muestra la pagina de usuario inscrito*/
app.post('/inscrito-a', (req, res)=>{
  res.render('inscrito-a',{
    id: (req.body.id),
    opcion: (req.body.opcion)
  });
});
app.post('/cancelado-a', (req, res)=>{
  res.render('cancelado-a',{
    id: (req.body.id),
    opcion: (req.body.opcion)
  });
});

/*Se encarga de redirigir o mostrar una página, dependiendo de la ID ingresada*/
app.post('/redirige', (req,res)=>{
  funciones.listarU();
  let id = parseInt(req.body.id);
  let encontre = listaUsuarios.find(busco => busco.id == id);
  if (encontre){
    if (encontre.tipo == 'coordinador'){
      console.log("El tipo es: " + encontre.tipo)
      console.log("Es coordinador")
      res.redirect('/hub_coordinador');
    }
    else{
      console.log("Es " + encontre.tipo)
      res.render('redirige',{id});
    }
  }
  else{
    console.log("Esta ID no existe.")
    res.redirect('/');
  }
});

app.post('/eliminado', (req, res)=>{
  res.render('eliminado',{
    id_u: parseInt(req.body.id_u),
    id_c: parseInt(req.body.id_c)
  });
})

app.get('/editado', (req, res)=>{
  res.render('editado',{
    id_c: req.query.id_c,
    estado: req.query.estado
  })
})

/*Muestra la página de error por default*/
app.get('*', (req, res)=>{
  res.render('error',{
    estudiante: 'Error'
  })
});

app.listen(3000, ()=> {
  console.log("Escuchando en el Port 3000")
});
