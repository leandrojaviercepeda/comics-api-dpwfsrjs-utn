const mysql = require('mysql');
const util = require('util');
const characters = require('../db/characters');
const movies = require('../db/movies');

const config = {
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
};

const pool = mysql.createPool(config);
pool.query = util.promisify(pool.query);

function getCols(objArray) {
    const cols = [];
    if (Array.isArray(objArray) && objArray.every(obj => typeof obj == 'object')) {
        for (const obj of objArray) {
            for (const key of Object.keys(obj)) {
                if (cols.map(col => col.name).indexOf(key) < 0) {
                    cols.push({name: key, type: getType(obj[key])});
                }
            }
        }
    }
    return cols;
}

function getRows(objArray) {
    const rows = [];
    if (Array.isArray(objArray) && objArray.every(obj => typeof obj == 'object')) {
        for (const obj of objArray) {
            const row = [];
            for (const key of Object.keys(obj)) {
                row.push(obj[key])
            }
            rows.push(row);
        }
    }
    return rows;
}

function getType(col) {
    const type = typeof col;
    if (type == 'object' && Array.isArray(col)) return 'JSON';
    if (type == 'string' && col.length > 50) return 'TEXT';
    if (type == 'string' && col.length <= 50) return 'VARCHAR (250)';
    if (type == 'boolean') return 'BOOLEAN';
    if (type == 'number') return Number.isInteger(col) ? 'INTEGER' : 'FLOAT';
    return 'TEXT';
}

async function init() {
    try {
        const tables = [
            {tablename: 'charact', cols: getCols(characters), rows: getRows(characters), rowslength: getRows(characters).length},
            {tablename: 'movie', cols: getCols(movies), rows: getRows(movies), rowslength: getRows(movies).length}, 
        ];

        const promises = [];
        let query = '';

        // DROP TABLES
        for (const table of tables) {
            query = `DROP TABLE IF EXISTS ${table.tablename};`;
            await pool.query(query);
        }

        // CREATE TABLES
        for (const table of tables) {
            query = `CREATE TABLE IF NOT EXISTS ${table.tablename} (id_${table.tablename} INT AUTO_INCREMENT PRIMARY KEY,${table.cols.map(col => `${col.name} ${col.type}`).join(',')});`;
            promises.push(pool.query(query));
        }

        // INSERT DATA
        for (const table of tables) {
            for (const row of table.rows) {
                query = `INSERT INTO ${table.tablename} (${table.cols.map(col => col.name).join(',')}) VALUE (${row.map(item => !Array.isArray(item) ? JSON.stringify(item) : `'${JSON.stringify(item)}'`).join(',')});`;
                promises.push(pool.query(query));
            }
        }

        Promise.all(promises)
        .then(response => console.warn("DB initialized"))
        .catch(error => console.error("Error at initializing db", error))
    } catch (error) {
        console.error(error);
    }

}

function getSqlFilter (queryreq) {
    if (!queryreq || queryreq == '' || typeof queryreq != 'object') return;
    return Object.keys(queryreq).map(key => `${key}="${queryreq[key]}"`).join(' AND ');
};

function parseJson(value) {
    try {
        return JSON.parse(value);
    } catch(_) { 
        return value;
    }
}

function parseArrayJson(items) {
    if (!Array.isArray(items)) return items;
    const newItems = [...items];
    newItems.map(item => {
        if (typeof item == 'object') {
            Object.keys(item).map(key => { item[key] = parseJson(item[key])})
        }
    });
    return newItems;
}

module.exports = {
    pool,
    init,
    parseArrayJson,
    getSqlFilter,
};
