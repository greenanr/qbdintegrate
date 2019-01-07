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
        queryStr = 'SELECT * FROM qbd_user where qbdusername=\'' + username + '\';';
        console.log(queryStr);
        pgclient.query(queryStr, function(err, res) {
            if (err) return callback(err);

            if (res.rows.length == 0) {
                return callback(null, null);
            } else {
                return callback(null, res.rows[0]);
            }   
        });
    },
    xmlPush:function(userid, xml, callback) {
        
        queryStr = 'INSERT INTO qbd_xmlqueue (userid, xml) VALUES (' + userid + ', $xmlqueue$' + xml + '$xmlqueue$);';
        console.log(queryStr);
        pgclient.query(queryStr, function(err, res) {
             if (err) return callback(err);

            if (res.rows.length == 0) {
                return callback(null, null);
            } else {
                return callback(null, res.rows[0]);
            }    
        });

    },
    xmlLogPush:function(userid, xml, callback) {
        
        queryStr = 'INSERT INTO qbd_xmllog (userid, xml) VALUES (' + userid + ', $xmllog$' + xml + '$xmllog$);';
        console.log(queryStr);
        pgclient.query(queryStr, function(err, res) {
             if (err) return callback(err);

            if (res.rows.length == 0) {
                return callback(null, null);
            } else {
                return callback(null, res.rows[0]);
            }    
        });

    },
    xmlPop:function(userid, callback) {

        queryStr = 'SELECT * FROM qbd_xmlqueue WHERE userid=' + userid + ';';
        console.log(queryStr);
        pgclient.query(queryStr, function(err, res) {
            if (err) return callback(err);

            if (res.rows.length == 0) {
                return callback(null, null);
            } else {
                // Return the first row only.
                return callback(null, res.rows[0]);
            }    
        });
    },
    xmlDelete:function(id, callback) {
       queryStr = 'DELETE FROM qbd_xmlqueue WHERE id=' + id + ';';
        console.log(queryStr);
        pgclient.query(queryStr, function(err, res) {
            if (err) return callback(err);

            if (res.rows.length == 0) {
                return callback(null, null);
            } else {
                return callback(null, res.rows[0]);
            }    
        }); 
    },
    xmlSwitch:function(id, callback) {

        queryStr = 'SELECT * FROM qbd_xmlqueue WHERE id=' + id + ';';
        console.log(queryStr);
        pgclient.query(queryStr, function(err, res) {
            if (err) return callback(err);

            if (res.rows.length == 0) {
                return callback(null, null);
            } else {
                // Push the request into our log
                xmlLogPush(res.rows[0].userid,res.rows[0].xml);

                //Delete from our queue
                xmlDelete(res.rows[0].id);
                return callback(null, res.rows[0]);
            }    
        });
    }



}