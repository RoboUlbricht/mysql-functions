const mysql = require('mysql');

module.exports = class TDatabase {

    ///
    /// Constructor
    ///
    constructor(config) {
        this.config = config;
        this.connection = undefined;
        this.last_identity = 0;
        this.last_fields = {}
        if(this.config.hasOwnProperty('connectionLimit'))
            this.pool = mysql.createPool(this.config);
    }

    ///
    /// Connect to the database
    ///
    connect() {
        return new Promise((resolve, reject) => {
            this.connection = mysql.createConnection(this.config);
            this.connection.connect((err) => {
                if (err)
                    reject(err);
                else
                    resolve();
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
                        resolve(connection);
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
        if(this.pool && con && con._pool) {
            con.release();
        }
        else if(con) {
            con.end((err)=> {
            });
        }
        else {
            if(this.connection) {
                this.connection.end((err)=> {
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
        var self = this;
        return new Promise(function(resolve, reject) {
            self.connection.query(sql, params, function(err, results, fields) {
                if(err)
                    reject(err);
                else {
                    self.last_fields = fields;
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