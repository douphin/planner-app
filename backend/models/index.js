const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user')(sequelize, Sequelize);
const Event = require('./event')(sequelize, Sequelize);

User.hasMany(Event, { foreignKey: 'user_id' });
Event.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    sequelize,
    User,
    Event
};
