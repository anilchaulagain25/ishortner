const url = require('url');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'jwioguwt',
    host: 'satao.db.elephantsql.com',
    database: 'jwioguwt',
    password: 'UHmcpdRlwshyAFmm_t1xjJEW9JSp0cJe',
    port: 5432
})

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

exports.getMyShortUrls = function (userId, callBack) {
    console.log(userId)
    pool.connect((err, client, done) => {
        if (err) {callBack(err, null);}
        else{

        const query="select * from urls where usr='"+userId+"'";
        client.query(query, (err, res) => {
            done()
            console.log(res)
            if (err) callBack(err, null);
            else callBack(null, res.rows);
        })
    }

    })
};
exports.getMyShortUrl = function (s_url, callBack) {
    pool.connect((err, client, done) => {
        if (err) {callBack(err, null);}
        else{

        const query="select l_url from urls where s_url='" + s_url + "'";
        client.query(query, (err, res) => {
            done()
            console.log(res)
            if (err) callBack(err, null);
            else callBack(null, res.rows.length === 0 ? null : res.rows[0]["l_url"]);
        })
    }

    })
};

exports.makeShortUrl = function (baseUrl, body, callBack) {
    if(!body.l_url) callBack({msg:'invalid l_url'}, null);
    if(!body.usr) callBack({msg:'invalid usr'}, null);
    pool.connect((err, client, done) => {
        if (err) callBack(err, null);
        let s_url = baseUrl + "/" + makeid(7);
        const query="insert into urls(l_url,s_url,c_cnt,usr) values('"+body.l_url+"','"+ s_url +"',0,'" + body.usr+"')";
        console.log(query);
        client.query(query, (err, res) => {
            done()
            console.log(res)
            if (err) callBack(err, null);
            else callBack(null, {s_url : s_url});
        })
    })
};