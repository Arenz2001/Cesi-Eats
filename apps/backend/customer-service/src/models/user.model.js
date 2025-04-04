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
  Address: {
    type: Object,
    required: false,
    street: {
      type: String,
      required: function() { return this.Address != null; }
    },
    city: {
      type: String,
      required: function() { return this.Address != null; }
    },
    zipCode: {
      type: String,
      required: function() { return this.Address != null; }
    }
  },
  BirthDay: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema); 