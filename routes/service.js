const url = require('url');
const {
    Pool
} = require('pg');

const pool = new Pool({
    user: process.env.DB_user,
    host: process.env.DB_host,
    database: process.env.DB_database,
    password: process.env.DB_password,
    port: process.env.DB_port
})

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function isValidUuid4(input) {
    return /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(input);
}

exports.getMyShortUrls = function(userId, callBack) {
    if (!userId || !isValidUuid4(userId)) callBack(null, []);
    else {
        pool.connect((err, client, done) => {
            if (err) {
                callBack(err, null);
            } else {

                const query = "select * from urls where usr=$1";
                const values = [userId];
                client.query(query, values, (err, res) => {
                    done()
                    if (err) callBack(err, null);
                    else callBack(null, res.rows);
                })
            }

        })
    };
};
exports.getMyShortUrl = function(s_url, callBack) {
    pool.connect((err, client, done) => {
        if (err) {
            callBack(err, null);
        } else {

            const query = "select l_url from urls where s_url=$1";
            const values = [s_url];
            client.query(query, values, (err, res) => {
                if (err) {
                    callBack(err, null);
                } else {
                    callBack(null, res.rows.length === 0 ? null : res.rows[0]["l_url"]);
                    const updCntQr = "update urls set c_cnt=c_cnt+1 where s_url=$1";
                    client.query(updCntQr, values, (errI, resI) => {
                        done()
                    })
                }
            })
        }

    })
};

exports.makeShortUrl = function(baseUrl, body, callBack) {
    if (!body.l_url || !isValidUuid4(body.l_url)) callBack({
        msg: 'invalid l_url'
    }, null);
    else if (!body.usr) callBack({
        msg: 'invalid usr'
    }, null);
    else {
        pool.connect((err, client, done) => {
            if (err) callBack(err, null);
            let s_url = baseUrl + "/" + makeid(7);
            const query = "insert into urls(l_url,s_url,c_cnt,usr) values($1,$2,$3,$4)";
            const values = [body.l_url, s_url, 0, body.usr];
            client.query(query, values, (err, res) => {
                done();
                if (err) callBack(err, null);
                else callBack(null, {
                    s_url: s_url
                });
            })
        })
    }
};