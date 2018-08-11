const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Jogo = require('./jogo');

const port = 8080;
const db = 'mongodb://localhost/jogos';

// Use native ES6 promises
mongoose.Promise = global.Promise;
mongoose.connect(db);

/*
 connect to mongo function
 const open = () => {
   let connection = mongoose.connection;
   mongoose.Promise = global.Promise;
   mongoose.connect(db);
   mongoose.connection.on('open', () => {
             console.log('We have connected to mongodb');
         });
   return connection;
  };

// open();*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) =>
  res.send('Olá, amigo!'));

/*
app.get('/jogos', (req, res) => {
  console.log('Enviando todos os jogos');
  Jogo.find({})
    .exec((err, jogos) => {
      if(err) {
        res.send('error occured');
      } else {
        console.log('Enviado');
        res.json(jogos);
    }
 })
});
*/

// Promise Example
app.get('/jogos', (req, res) => {
  Jogo.find({},null,{sort:{titulo:1}})
    .exec()
    .then((jogos) => {
      console.clear();
      console.log('Enviado');
      res.json(jogos);
    })
    .catch((err) => {
      res.send('error occured');
    });
 });

app.get('/jogo/:id', (req, res) =>
 // console.log('getting all jogos');
  Jogo.findOne({
    _id: req.params.id
    })
    .exec((err, jogos) => {
      if(err) {
        res.send('error occured')
      } else {
        console.log(jogos);
        res.json(jogos);
    }
}));

app.post('/jogo',(req, res) => {
  let novoJogo = new Jogo();
  
  
  if(req.body.br=='')
    delete(novoJogo['br']);
  if(req.body.mx=='')
    delete(novoJogo['mx']);
  
  novoJogo.titulo = req.body.titulo;
  novoJogo.us = req.body.us;
  novoJogo.img = req.body.img;
  novoJogo.grupo = req.body.grupo;
  novoJogo.plataforma = req.body.plataforma;
  
  if(novoJogo.grupo==1){
    novoJogo.save().then((jogo) => {
        console.log(jogo);
        res.send(jogo);
    }).catch((err) => {res.json(err)});
  }
  if(req.body.mx=='')
    delete(novoJogo['mx']);
  else
    novoJogo.mx = req.body.mx;
  if(req.body.br=='')
    delete(novoJogo['br']);
  else
    novoJogo.br = req.body.br;
  novoJogo.save()
  .then((jogo) => {
    res.send(jogo);
  })
  .catch((err) => {
    res.json(err)
  });
});
/*
app.post('/jogo2', (req, res) =>
  Jogo.create(req.body, (err, jogo) => {
    if(err) {
      res.send('Erro ao cadastrar jogo');
    } else {
      console.log(jogo);
      res.send(jogo);
  }
}));
*/
app.put('/jogo/:id',(req,res) => {
  if(req.params.id==''||req.params.id==null)
    res.send({msg:'falta o ID de inserção'})
  let atual = new Jogo();
  atual.updateOne(
    {_id: req.params.id},
    { $set: { 
      title: req.body.title,
      img: req.body.img,
      us: req.body.us,
      plataforma: req.body.plataforma,
      grupo: req.body.grupo
  }})
  .exec()
  .then((dados)=>{
    res.send({msg:'Campo Atualizado'});
  }).catch((err) => {
    console.log('Apresenta Erro\n');
    res.json(err);
  });
});
//pedir ajuda, deve existir solução mais eficiente
app.put('/jogo/:id/mx',(req,res) => {
  let atual = new Jogo();
  if(req.body.grupo!=4)
    res.send({msg:'Operação Inválida, grupo indisponível para essa atualização'});
  atual.updateOne(
    {_id: req.params.id},
    { $set: { 
      mx: req.body.mx
  }})
  .exec()
  .then((dados)=>{
    res.send({msg:'Campo Atualizado'});
  }).catch((err) => {
    console.log('Apresenta Erro\n');
    res.json(err);
  });
});
//pedir ajuda, deve existir solução mais eficiente
app.put('/jogo/:id/br',(req,res) => {
  let atual = new Jogo();
  if(req.body.grupo==1||req.body.grupo==5)
    res.send({msg:'Operação Inválida, grupo indisponível para essa atualização'});
  atual.updateOne(
    {_id: req.params.id},
    { $set: { 
      br: req.body.br
  }})
  .exec()
  .then((dados) =>{
    res.send({msg:'Campo Atualizado'});
  }).catch((err) => {
    console.log('Apresenta Erro\n');
    res.json(err);
  });
});
/*app.put('/jogo/:id', (req, res) =>
  Jogo.findOneAndUpdate({
    _id: req.params.id
    },
    { $set: { title: req.body.title }
  }, {upsert: true}, (err, Jogo) => {
    if (err) {
      res.send('Erro ao atualizar');
    } else {
      console.log(Jogo);
      res.send(Jogo);
  }
}));*/

app.delete('/jogo/:id', (req, res) =>
  Jogo.findOneAndRemove({
    _id: req.params.id
  })
  .exec()
  .then((dados)=>
    {res.send({msg:'campo removido'})
  })
  .catch((err)=>{
    res.send({msg:'Erro ao remover'});
  }) /*(err, jogo) => {
    if(err) {
      res.send('error removing')
    } else {
      console.log(jogo);
      res.status(204);
  }
})*/
);

app.listen(port, () =>
  console.log('app listening on port ' + port));