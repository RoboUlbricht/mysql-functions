const mysql = require('mysql');

module.exports = class TDatabase {

    constructor(config) {
        this.config = config;
        this.connection = undefined;
        this.last_identity = 0;
    }

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

    disconnect() {
        if(this.connection) {
            this.connection.end(function(err) {

            });
        }
        this.connection = undefined;
    }

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

    get identity() {
        return this.last_identity;
    }
}