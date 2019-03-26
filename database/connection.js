const Sequelize = require('sequelize');
const model = require('./model');

const sequelize = new Sequelize('Board','root','1234',{
    host:'127.0.0.1',
    port: '3306',
    dialect:'mysql'
});
sequelize.authenticate()

    .then(()=>{
        console.log("DB is Connected");
    }).catch((err)=>{
        if(err){
            console.log(err);
            console.log("DB 연결 안됨");
        }
    });
sequelize.define('user',model.user);
sequelize.define('video',model.video);
sequelize.sync({force:false});

module.exports = sequelize;