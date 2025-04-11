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
  SIRET: {
    type: String,
    required: false
  },
  VehicleType: {
    type: String,
    required: true,
    enum: ['car', 'motorcycle', 'bicycle', 'scooter']
  },
  VehicleLicense: {
    type: String,
    required: true
  },
  DeliveryZones: {
    type: String,
    required: false
  },
  Status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available'
  },
  Rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  CreatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema); 