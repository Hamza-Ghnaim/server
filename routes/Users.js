const app = require("express");
const router = app.Router();
const {Users} = require("../models");
const bcrypt = require("bcrypt");
const {validateToken} = require("../middlewares/authMiddleware");
const { sign } = require("jsonwebtoken");

router.post("/",async (req,res)=>{
    const {username,password} = req.body;
    bcrypt.hash(password,10).then((hashed)=>{
        Users.create({
            username:username,
            password:hashed
        });
        return res.json("Success");
    });
});

router.post("/login",async (req,res)=>{

    const {username, password}=req.body;

    const user = await Users.findOne({
        where:{
            username:username
        }
    });

    if (!user) {
        return res.json({error:"user doesn't exist"});
    }

    bcrypt.compare(password, user.password).then((match)=>{
        if (!match) {
            return res.json({error:"Wrong Username and Password combination"});
        }

        const accessToken = sign({
            username:user.username,
            id:user.id
        },
            "importantsecret"
        )

    return res.json({token:accessToken,username:username,id:user.id}); 
    
    });
});

router.get('/checkToken',validateToken,(req,res)=>{
    res.json(req.user); 
});

router.get("/basicinfo/:id", async(req,res)=>{
    const id = req.params.id;
    const basicInfo = await Users.findByPk(id,{
        attributes:{
            exclude:["password"]
        }
    });
    res.json(basicInfo);
})

router.put("/passwordchange", validateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await Users.findOne({ where: { username: req.user.username } });
  
    bcrypt.compare(oldPassword, user.password).then(async (match) => {
      if (!match) res.json({ error: "Wrong Password Entered!" });
  
      bcrypt.hash(newPassword, 10).then((hash) => {
        Users.update(
          { password: hash },
          { where: { username: req.user.username } }
        );
        res.json("SUCCESS");
      });
    });
  });
module.exports = router;