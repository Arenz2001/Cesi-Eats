const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  Id_auth: {
    type: String,
    required: true
  },
  FirstName: {
    type: String,
    required: true
  },
  LastName: {
    type: String,
    required: true
  },
  PhoneNumber: {
    type: String,
    required: true
  },
  BirthDay: {
    type: String,
    required: true
  },
  RIB: {
    IBAN: {
      type: String,
      required: false
    },
    RIB_Key: {
      type: String,
      required: false
    }
  },
  SIRET:{
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema); 