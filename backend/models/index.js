const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user')(sequelize, Sequelize);
const Event = require('./event')(sequelize, Sequelize);

//User.hasMany(Event);
//Event.belongsTo(User);

module.exports = {
    sequelize,
    User,
    Event
};
