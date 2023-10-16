const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicantSchema = new Schema({
    
  //   Add  applicant
  applicant_id:{type: String},
  applicant_firstName: { type: String },
  applicant_lastName: { type: String },
  applicant_email: { type: String },
  applicant_phoneNumber: { type: Number },
  applicant_homeNumber: { type: Number },
  applicant_businessNumber: { type: Number },
  applicant_telephoneNumber: { type: Number },
  applicant_property: { type: String },

});

module.exports = mongoose.model("applicant", applicantSchema);
