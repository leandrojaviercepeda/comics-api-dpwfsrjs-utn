const { pool, getSqlFilter, parseArrayJson } = require('./DB');
const tableName = 'movie';

function get(filter=undefined) {
    try {
        return new Promise(async (resolve, reject) => {
            filter = getSqlFilter(filter);
            let query;
            if (!filter) query = `select * from ${tableName}`;
            else query = `select * from ${tableName} where ${filter};`;
            const response = await pool.query(query);
            return resolve(parseArrayJson(response));
        });
    } catch (error) {
        console.error(error);
        reject({message: `Error al obtener ${tableName}.`})
    }
}

function getById(id=undefined) {
    try {
        return new Promise(async (resolve, reject) => {
            if (!id || id == '') return reject({message: 'Invalid request'})
            let query;
            if (id) query = `select * from ${tableName} where id_movie="${id}" limit 1;`;
            const response = await pool.query(query);
            if (Array.isArray(response) && response.length == 0) return reject({message: `Error al obtener ${tableName}.`})
            return resolve(parseArrayJson(response)[0]);
        });
    } catch (error) {
        console.error(error);
        reject({message: `Error al obtener ${tableName}.`})
    }
}

function del(id) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || id == '') return reject({message: "Invalid request."});
            const query = `delete from ${tableName} where id_movie=?`;
            resolve(pool.query(query, [id]));
        } catch (error) {
            console.error(error);
            return reject({message: `Error al borrar ${tableName}.`})
        }
    });
}

function insert(obj) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!obj) return reject({message: "Error, revise los campos requeridos."});
            const query = `INSERT INTO ${tableName} (${Object.keys(obj).map(key => key).join(',')}) VALUE (${Object.keys(obj).map(key => !Array.isArray(obj[key]) ? JSON.stringify(obj[key]) : `'${JSON.stringify(obj[key])}'`).join(',')});`;
            resolve(pool.query(query));
        } catch (error) {
            console.error(error);
            return reject({message: `Error al crear ${tableName}.`})
        }
    });
}

function update(id, obj) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || id == '') return reject({message: "Invalid request."});
            let query = `select * from ${tableName} where id_movie=? limit 1`;
            const oldObj = await get(id);
            if (!oldObj) return reject({message: `Error al obtener ${tableName}.`});
            let newObj = {
                ...oldObj
            };
            for (const key of Object.keys(obj)) {
                newObj[key] = obj[key];
            }
            query = `update ${tableName} set ? where id_movie=?`;
            resolve(pool.query(query, [newObj, id]));
        } catch (error) {
            console.error(error);
            return reject({message: `Error al actualizar ${tableName}.`})
        }
    });
}

module.exports = {
    get,
    getById,
    del,
    insert,
    update,
}