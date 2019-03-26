const Sequelize = require('sequelize');

const video = {
    video_user:{
        type: Sequelize.STRING,
        allowNull: false
    },
    video_title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    video_url:{
        type: Sequelize.STRING,
        allowNull: false
    }
}
module.exports = video;