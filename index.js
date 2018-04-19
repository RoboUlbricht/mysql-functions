const mysql = require('mysql');

module.exports = class TDatabase {

    constructor(config) {
        this.config = config;
        this.connection = undefined;
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
}