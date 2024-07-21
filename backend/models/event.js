module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            //allowNull: false
        },
        start_time: {
            type: DataTypes.STRING,     // change to time and date
        },
        end_time: {
            type: DataTypes.STRING,     // change to time and date
        },
        status: {
            type: DataTypes.STRING,
            //allowNull: false
        },
    }, 
    { 
        timestamp: false 
    });

    return Event;
};
