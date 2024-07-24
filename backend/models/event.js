module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        start_time: {
            type: DataTypes.STRING,     // change to time and date
        },
        end_time: {
            type: DataTypes.STRING,     // change to time and date
        },
        status: {
            type: DataTypes.STRING,
        },
    });

    return Event;
};
