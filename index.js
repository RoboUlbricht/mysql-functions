const mysql = require('mysql');

module.exports = class TDatabase {

    ///
    /// Constructor
    ///
    constructor(config) {
        this.config = config;
        this.connection = undefined;
        this.last_identity = 0;
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
    execute(sql) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.connection.query(sql, function(err, results, fields) {
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
    /// Get last identity
    ///
    get identity() {
        return this.last_identity;
    }
}