# mysql-functions
A simple wrapper for [mysql](https://github.com/mysqljs/mysql) (A pure node.js JavaScript Client implementing the MySql protocol).
All functions are Promises.

## Installation
From npm.
```
npm install mysql-functions
```
Or from git.
```
npm install roboulbricht/mysql-functions
```

## class TDatabase

### Function: connect()
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
### Function: execute(sql, params)
Execute the query without returning the result table. Good for insert queries.
 * `sql` {String} The SQL statement to be executed.
 * `params` {Array[]} An array of arrays containing the [parameter definitions](https://github.com/mysqljs/mysql#performing-queries).

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
        await db.execute('create temporary table kiosk(id int not null auto_increment, nazov varchar(255), typ int, primary key(id))');
        var result1 = await db.execute('insert into kiosk(nazov, typ) values(?, ?)', ['a3', 1]);
        console.log('identity1', db.identity);
        var result2 = await db.execute('insert into kiosk(nazov, typ) values(?, ?)', ['a4', 1]);
        console.log('identity2', db.identity);
        var result3 = await db.execute('insert into kiosk(nazov, typ) values(?, ?)', ['a5', 1]);
        console.log('identity3', db.identity);
        var q = await db.query('select * from kiosk where id>? order by id', [1]);
        console.log(q);
        db.disconnect();
    })
    .catch(function(error) {
        console.log(error.message);
    });
```
### Property: identity
Return the last identity fro previous execute.

### Function: query(sql, params)
Execute the query which returns the result table.
 * `sql` {String} The SQL statement to be executed.
 * `params` {Array[]} An array of arrays containing the [parameter definitions](https://github.com/mysqljs/mysql#performing-queries).

### Property: fields
Return the fields from last query.

### Function: beginTransaction()
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
### Function: commitTransaction()
Commit the transaction.

### Function: rollbackTransaction()
Rollback the transaction.
