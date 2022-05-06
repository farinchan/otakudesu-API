const db = require("../db/koneksi")

module.exports = (req, res, routeController) => {
    db.connection.query("SELECT * FROM apikey WHERE apikey =" + db.mysql.escape(req.query.apikey), (err, results) => {
        if (err) {
            console.log(err.message);
        } else if (typeof results[0] == "undefined") {
             res.json({
                 nama : "inan"
             });
        } else {
            routeController(req, res, dbResult)
        }

    })
}
