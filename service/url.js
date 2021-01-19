const url = require('url');
var mysql = require('mysql');
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
    pool.connect((err, client, done) => {
        if (err) callBack(err, null);
        const query="select * from urls where usr='"+userId+"'";
        client.query(query, (err, res) => {
            done()
            if (err) callBack(err, null);
            else callBack(null, res.rows);
        })
    })
};
exports.getMyShortUrl = function (userId, callBack) {
    pool.connect((err, client, done) => {
        if (err) callBack(err, null);
        const query="select top 1  s_url from urls where usr='" + userId + "'";
        client.query(query, (err, res) => {
            done()
            if (err) callBack(err, null);
            else callBack(null, res.rows.length === 0 ? null : res.rows[0]["s_url"]);
        })
    })
};

exports.makeShortUrl = function (body, callBack) {
    if(!body.l_url) callBack({msg:'invalid l_url'}, null);
    if(!body.usr) callBack({msg:'invalid usr'}, null);
    pool.connect((err, client, done) => {
        if (err) callBack(err, null);
        let s_url = process.env.BASE_URL + "/" + makeid(7);
        const query="insert into urls(l_url,s_url,c_cnt,usr) values('"+body.l_url+"','"+ s_url +"',0,'" + body.usr+"')";
        client.query(query, (err, res) => {
            done()
            if (err) callBack(err, null);
            else callBack(null, {s_url : s_url});
        })
    })
};