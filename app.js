const express = require("express")
const bodyParser = require("body-parser")
const app = express();
const port = 3000

require("./db/koneksi")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
const routes = require("./routes/routes");
routes(app)

app.use((req, res, next) => {
    res.json({
        message : "Salam Hangat Dari Saya",
        createdBy: "Farin-Dev",
        github: "https://github.com/farinchan/otakudesu-API.git"
    })
});
app.listen(port, () => {
    console.log(`Server is running on Example http://127.0.0.1:${port}`);
});