const cheerio = require("cheerio");
const { default: Axios } = require("axios");
const helpers = require("../Helpers/url");

// TODO: Halaman Jadwal Rilis
module.exports = (req, res, dbResult) => {
    Axios.get(helpers.url + "/jadwal-rilis").then((response) => {
        const $ = cheerio.load(response.data);
        const element = $(".kgjdwl321");
        const note = element.find("center").text()
        console.log(note);
        let animeList = [];
        let scheduleList = [];
        let day;
        let anime_name, link, id;
        element.find(".kglist321").each(function () {
            day = $(this).find("h2").text();
            animeList = [];
            $(this)
                .find("ul > li")
                .each(function () {
                    anime_name = $(this).find("a").text();
                    link = $(this).find("a").attr("href");
                    id = $(this).find("a").attr("href").substring(`${helpers.url}/anime/`.length + 1);
                    animeList.push({ anime_name, id, link });
                });
            scheduleList.push({ day, animeList });
        });
        res.json({
            title: "Jadwal-Rilis",
            note,
            scheduleList
        });
    });
};
