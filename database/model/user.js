const Sequelize = require('sequelize');

const user = {
    user_id:{
        type: Sequelize.STRING,
        allowNull: false
    },
    user_pw:{
        type: Sequelize.STRING,
        allowNull: false
    }
}
module.exports = user;