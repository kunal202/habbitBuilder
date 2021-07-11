const Sequelize = require('sequelize')

const db = new Sequelize({
    dialect: 'postgresql',
    storage: __dirname + '/habbit.db',
    database: 'habbit',
    username: '',
    password: ''
})

const Users = db.define('user', {
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

const Habbits = db.define('habbit', {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.INTEGER,
    },
    timing: {
        type: Sequelize.DATE,
    },
    frequency: {
        type: Sequelize.INTEGER
    }
})

module.exports = {
    db,
    Users,
    Habbits
}