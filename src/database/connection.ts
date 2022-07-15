import knex from 'knex';
const knexconfig = require('../knexfile')
const connection = knex({
    client: "sqlite3",
    connection: {
        filename: "src/database/dev.sqlite3",
    },
    migrations: {
        directory: './migrations',
        database:'dev'
    },
    useNullAsDefault: true
});
export default connection;