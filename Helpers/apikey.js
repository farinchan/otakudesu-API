const db = require("../db/koneksi")

module.exports = (req, res, routeController) => {
    db.connection.query("SELECT * FROM apikey WHERE apikey =" + db.mysql.escape(req.query.apikey), (err, results) => {
        if (err) {
            console.log(err.message);
        } else if (typeof results[0] == "undefined") {
             res.json({
                 github : "https://github.com/farinchan/otakudesu-API",
                 created_by : "Farin Developer",
                 alert : "harap masukkan apikey, jika belum punya silahkan hubungi ke penyedia layanan, gratis"
             });
        } else {
            routeController(req, res, results[0])
        }

    })
}
