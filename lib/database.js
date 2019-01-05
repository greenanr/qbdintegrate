const {Client}=require('pg');

const pgclient=new Client({
    connectionString:process.env.DATABASE_URL,
    ssl:true
});

pgclient.connect();

module.exports={

    getUsers:function(callback){
        queryStr = 'SELECT * FROM qbd_user;';
        console.log(queryStr);
        pgclient.query(queryStr, function(err, res) {
            console.log("rows length "+res.rows.length);
            if (err) return callback(err);

            if (res.rows.length == 0){
                return callback(null, null);
            } else {
                return callback(null, res.rows);
            }           
        });
    },
    getUser:function(username, callback) {
        queryStr = 'SELECT * FROM qbd_user where qbdusername =' + username + ';';
        console.log(queryStr);
        pgclient.query(queryStr, function(err, res) {
            if (err) return callback(err);

            if (res.rows.length == 0) {
                return callback(null, null);
            } else {
                return callback(null, res.rows[0]);
            }   
        });
    }
}