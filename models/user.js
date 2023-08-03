const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const salt=10;
var mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    firstname:{
        type: String,
        required: true,
        maxlength: 100
    },
    lastname:{
        type: String,
        required: true,
        maxlength: 100
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password:{
        type:String,
        required: true,
        minlength:8
    },
    confirmpassword:{
        type:String,
        required: true,
        minlength:8

    },
    token:{
        type: String
    }
});

userSchema.methods.generateToken=(cb)=>{
    var user =this;
    var token=jwt.sign(user._id.toHexString(),confiq.SECRET);

    user.token=token;
    user.save((err,user)=>{
        if(err) return cb(err);
        cb(null,user);
    })
}
userSchema.statics.findByToken =  (token, cb)=> {
    var user = this;
  
    jwt.verify(token, process.env.SECRET, (err, decode) =>{
      if (err) return cb(err);
  
      user.findOne({ "_id": decode, "token": token },  (err, user)=> {
        if (err) return cb(err);
        cb(null, user);
      });
    });
  };
userSchema.methods.deleteToken=(token,cb)=>{
    var user=this;
    
    const logoutUser= user.findOne({ "_id": decode, "token": token });
    console.log(logoutUser);

    logoutUser.update({$unset : {token :1}},(err,user)=>{
        if(err) return cb(err);
        cb(null,user);
    })
}

userSchema.pre('save',(next)=>{
    var user=this;
    
    if(user.isModified('password')){
        bcrypt.genSalt(salt,(err,salt)=>{
            if(err)return next(err);

            bcrypt.hash(user.password,salt,(err,hash)=>{
                if(err) return next(err);
                user.password=hash;
                user.password2=hash;
                next();
            })

        })
    }
    else{
        next();
    }
});

userSchema.methods.comparepassword=(password,cb)=>{
    bcrypt.compare(password,this.password,(err,isMatch)=>{
        if(err) return cb(next);
        cb(null,isMatch);
    });
}

module.exports=mongoose.model('User',userSchema);
