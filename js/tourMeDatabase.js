const {
    createPool
} = require('mysql2');

const db = createPool({
    host: '35.209.194.163',
    user: 'myuser',
    password: 'mypass',
    database: 'connectingToJava',
});

db.query('select * from testingTable', (err, result, field)=>{
    if(err){
        return console.log(err);
    }
    return console.log(result);
})

module.exports = db;