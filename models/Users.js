module.exports = ((sequelize,DataTypes)=>{
    const Users = sequelize.define("Users",{
        username:{
            type:DataTypes.STRING,
            alloWNull:false,
        },
        password:{
            type:DataTypes.STRING,
            alloWNull:false,
        }
    });
    Users.associate = (models)=>{
        Users.hasMany(models.Likes,{
            onDelete:"cascade"
        });
        Users.hasMany(models.Posts,{
            onDelete:"cascade"
        });
    };
    return Users;
});