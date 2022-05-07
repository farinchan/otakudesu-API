const cheerio = require("cheerio");
const { default: Axios } = require("axios");
const helpers = require("../Helpers/url");


//TODO : Fanpage Page
module.exports = (req, res, dbResult) => {
    const logPush = require("../Helpers/log_push")
    logPush(dbResult)
    Axios.get(helpers.url).then((response) => {
        const $ = cheerio.load(response.data);
        const facebook = $("#menu-home").find("#menu-item-31106").find("a").attr("href")
        res.json({
            facebook
        })
    })
}