const mongoose=require('mongoose');
const OtpScehma=new mongoose.Schema({
  email:{type:String,required:true,lowercase:true,trim:true},
  otp:{type:String,required:true},
  purpose:{type:String,enum:['register','forget'],required:true},
  expireAt:{type:Date,required:true,index:{expires:0}}


},{timestamps:true});
module.exports=mongoose.model('Otp',OtpScehma);