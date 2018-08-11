var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JogoSchema = new Schema({
  titulo: String,
  us: String,
  br: {
      type: String, 
      required : ()=>{
        return ((parseInt(this.grupo)>1)&&(parseInt(this.grupo<5)));
      }
  },
  mx: {
    type: String, 
    required : ()=>{
      return ((parseInt(this.grupo)==4));
    }
  },
  img: String,
  grupo: Number,
  plataforma: Number
},{versionKey : false});

module.exports = mongoose.model('titulo', JogoSchema);