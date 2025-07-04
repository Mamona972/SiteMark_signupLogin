
const mongoose =require("mongoose");
const bcrypt= require("bcryptjs")

const userSchema= new mongoose.Schema({
    username: {type:String },
    email: {type:String  , unique:true , sparse: true},
    password: {type:String, },
    googleId: { type: String, unique: true, sparse: true },
    resetToken:String,
    resetTokenExpiry:Date,
    avatar: String
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  try {
    if (this.password && this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

//userSchema.method.comparePassword = async function(pass){
 //   return await bcrypt.compare(pass, this.password);
//}




module.exports=mongoose.model('User',userSchema);