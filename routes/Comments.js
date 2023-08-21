const express = require("express");
const router = express.Router();
const {Comments} = require("../models");
const {validateToken} = require("../middlewares/authMiddleware");

router.get("/:postID",async(req,res)=>{
    const postId = req.params.postID;
    const comments = await Comments.findAll({where :{
        PostId:postId,
    }});
    res.json(comments)
})

router.post("/",validateToken,async(req,res)=>{
    const comment = req.body;
    const username = req.user.username;
    comment.username = username;
    await Comments.create(comment);
    res.json(comment);    
})

router.delete('/:commentId',validateToken,async (req,res)=>{
    const comentId = req.params.commentId;
    await Comments.destroy({where:{
        id:comentId
    }});
    res.json("COMMENT DELETED SUCCESSFULLY!");
});
module.exports= router;