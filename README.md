# mysql-functions
A simple wrapper for [tedious](http://github.com/tediousjs/tedious) (TDS driver).

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

### Function: beginTransaction
Begin the transaction.

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
    .then(async function() {
        console.log('connected');
        try {
        await db.beginTransaction();
        console.log('in transaction');
        //throw Error('This is error');
        await db.commitTransaction();
        console.log('commit');

        } catch(error) {
            await db.rollbackTransaction();
            console.log('error in transaction', error.message);
        };
        await db.disconnect();
        console.log('disconnected');
    })
    .catch(function(error) {
        console.log(error.message);
    });
```
### Function: commitTransaction
Commit the transaction.

### Function: rollbackTransaction
Rollback the transaction.
