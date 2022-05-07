const db = require("../db/koneksi")

module.exports = (dbResult) => {
    db.connection.query("SELECT * FROM log_push WHERE apikey =" + db.mysql.escape(dbResult.apikey), (err, results) => {
        if (err) {
            console.log(err.message);
        } else if (typeof results[0] == "undefined") {
            db.connection.query(`INSERT INTO log_push(apikey,total_push) VALUES ("${dbResult.apikey}",1)`)
        } else {
            db.connection.query(`UPDATE log_push SET total_push = ${results[0].total_push + 1} WHERE total_push = ${results[0].total_push}`)
        }
    })
}

