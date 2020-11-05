const mysql = require('mysql');

class TConnection {

    constructor(database, connection) {
        this.database = database;
        this.connection = connection;
        this.last_identity = 0;
        this.last_fields = {}
    }

    release() {
        this.connection.release();
    }

    ///
    /// Execute query
    ///
    execute(sql, params) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, params, (err, results, fields) => {
                if(err)
                    reject(err);
                else {
                    this.last_identity = results.insertId;
                    resolve(results);
                }
            });
        });
    }

    ///
    /// Query
    ///
    query(sql, params) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, params, (err, results, fields) => {
                if(err)
                    reject(err);
                else {
                    this.last_fields = fields;
                    resolve(results);
                }
            });
        });
    }

    ///
    /// Get last identity
    ///
    get identity() {
        return this.last_identity;
    }

    ///
    /// Get last fields
    ///
    get fields() {
        return this.last_fields;
    }

    ///
    /// Begin the transaction
    ///
    beginTransaction() {
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction((err) => {
                if(err)
                    reject(err);
                else {
                    resolve();
                }
            });
        });
    }

    ///
    /// Commit the transaction
    ///
    commitTransaction() {
        return new Promise((resolve, reject) => {
            this.connection.commit((err) => {
                if(err)
                    reject(err);
                else {
                    resolve();
                }
            });
        });
    }

    ///
    /// Rollback the transaction
    ///
    rollbackTransaction() {
        return new Promise((resolve, reject) => {
            this.connection.rollback((err) => {
                if(err)
                    reject(err);
                else {
                    resolve();
                }
            });
        });
    }

};

module.exports = class TDatabase {

    ///
    /// Constructor
    ///
    constructor(config, params) {
        this.config = config;
        this.params = params;
        this.connection = undefined;
        this.last_identity = 0;
        this.last_fields = {}
        if(this.config.hasOwnProperty('connectionLimit'))
            this.pool = mysql.createPool(this.config);
    }

    ///
    /// Log Error
    ///
    logError(message) {
        if(this.params && this.params.logger)
            this.params.logger.error(message);
    }

    ///
    /// Log Info
    ///
    logInfo(message) {
        if(this.params && this.params.logger)
            this.params.logger.info(message);
    }

    ///
    /// Log Debug
    ///
    logDebug(message) {
        if(this.params && this.params.logger)
            this.params.logger.debug(message);
    }

    ///
    /// Connect to the database
    ///
    connect() {
        return new Promise((resolve, reject) => {
            this.connection = mysql.createConnection(this.config);
            this.connection.connect((err) => {
                if (err) {
                    this.logError(err.message);
                    reject(err);
                }
                else {
                    this.logInfo('TDatabase.Connected');
                    resolve();
                }
            });
        });
    }

    ///
    /// Connect to the database
    ///
    connectPool() {
        return new Promise((resolve, reject) => {
            if (this.pool) {
                this.pool.getConnection((err, connection) => {
                    if (err)
                        reject(err);
                    else {
                        resolve(new TConnection(this, connection));
                    }
                });
            }
            else {
                reject(new Error('No connection pool.'));
            }
        });
    }

    ///
    /// Disconnect from the database
    ///
    disconnect(con) {
        if (con instanceof TConnection)
            con.release();
        else if (this.pool && con && con._pool) {
            con.release();
        }
        else if (con) {
            con.end((err) => {
            });
        }
        else {
            if (this.connection) {
                this.connection.end((err) => {
                    if(err)
                        this.logError(err.message);
                    else
                        this.logDebug('TDatabase.Disconnected')
                });
            }
            this.connection = undefined;
        }
    }

    ///
    /// Execute query
    ///
    execute(sql, params) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.connection.query(sql, params, function(err, results, fields) {
                if(err)
                    reject(err);
                else {
                    self.last_identity = results.insertId;
                    resolve(results);
                }
            });
        });
    }

    ///
    /// Query
    ///
    query(sql, params) {
        this.logDebug('TDatabase.query: ' + sql);
        if(params)
            params.forEach((param) => this.logDebug(` - ${param}`));
        let hrstart = process.hrtime();
        return new Promise((resolve, reject) => {
            this.connection.query(sql, params, (err, results, fields) => {
                if(err) {
                    this.logError(err.message);
                    reject(err);
                }
                else {
                    let hrend = process.hrtime(hrstart);
                    this.logDebug(`Count: ${results.length}, (${hrend[0]}s ${hrend[1] / 1000000 | 0}ms)`);
                    this.last_fields = fields;
                    resolve(results);
                }
            });
        });
    }

    ///
    /// Get last identity
    ///
    get identity() {
        return this.last_identity;
    }

    ///
    /// Get last fields
    ///
    get fields() {
        return this.last_fields;
    }

    ///
    /// Begin the transaction
    ///
    beginTransaction() {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.connection.beginTransaction(function(err) {
                if(err)
                    reject(err);
                else {
                    resolve();
                }
            });
        });
    }

    ///
    /// Commit the transaction
    ///
    commitTransaction() {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.connection.commit(function(err) {
                if(err)
                    reject(err);
                else {
                    resolve();
                }
            });
        });
    }

    ///
    /// Rollback the transaction
    ///
    rollbackTransaction() {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.connection.rollback(function(err) {
                if(err)
                    reject(err);
                else {
                    resolve();
                }
            });
        });
    }

}