# mysql-functions

## Installation

```
npm install roboulbricht/mysql-functions
```

## class TDatabase

### Function: connect
Establishing the connection to the database.

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
### Function: execute
Execute the query without returning the result table. Good for insert queries.

### Property: identity
Return the last identity fro previous execute.

### Function: query
Execute the query which returns the result table.

### Property: fields
Return the fields from last query.