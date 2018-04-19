# mysql-functions

## Installation

```javascript
npm install roboulbricht/mysql-functions
```

## class TDatabase

### Function: connect

```javascript
var Database = require('mysql-functions');

var connection_string = {
    host: "localhost",
    user: "root",
    password: "password",
    database: "mydb"
}

var db = new Database(connection_string);
db.connect()
    .then(function() {
        console.log('connected');
        db.disconnect();
    })
    .catch(function(error) {
        console.log(error.message);
    });
```