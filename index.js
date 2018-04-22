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
    }

    ///
    /// Connect to the database
    ///
    connect() {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.connection = mysql.createConnection(self.config);
            self.connection.connect(function(err) {
                if(err)
                    reject(err);
                else
                    resolve();
            });
          });
    }

    ///
    /// Disconnect from the database
    ///
    disconnect() {
        if(this.connection) {
            this.connection.end(function(err) {

            });
        }
        this.connection = undefined;
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