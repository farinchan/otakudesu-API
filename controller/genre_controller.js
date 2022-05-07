const cheerio = require("cheerio");
const { default: Axios } = require("axios");
const helpers = require("../Helpers/url");

//TODO: Halaman Genre
module.exports = (req, res, dbResult) => {
    const logPush = require("../Helpers/log_push")
    logPush(dbResult)
    const fullUrl = helpers.url + "/genre-list/";
    Axios.get(fullUrl)
        .then((response) => {
            const $ = cheerio.load(response.data);
            const element = $(".genres");
            let genreList = [];
            element.find("li > a").each(function (i, el) {
                let object = {
                    genre_name: $(el).text(),
                    id: $(el).attr("href").replace("/genres/", ""),
                    link: helpers.url + $(el).attr("href")
                };
                genreList.push(object);
            });
            res.json({
                title: "Genre List",
                genreList
            });
        })
        .catch((err) => {
            console.log(err.message);
        });
};
