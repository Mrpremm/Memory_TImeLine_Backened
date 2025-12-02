const mongoose=require('mongoose');

module.exports= function dbconnect(){
  const uri=process.env.MONGO_URI;
  if(!uri){
    console.errpr('MONGO_URI not set in .en');
    process.exit(1);

  }

  mongoose.connect(uri).then(()=>console.log('MongoDb Connected'))
  .catch((err)=>{
    console.error('mongoDb connectio error',err.message || err);
    process.exit(1);
  })
  
};