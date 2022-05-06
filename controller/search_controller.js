const cheerio = require("cheerio");
const { default: Axios } = require("axios");
const helpers = require("../Helpers/url");

//TODO: ANIME SEARCH
module.exports = (req, res, dbResult) => {
    const query = req.params.query;
    const fullUrl = `${helpers.url}?s=${query}&post_type=anime`;
    Axios.get(fullUrl).then((response) => {
        const $ = cheerio.load(response.data);
        const element = $(".page");
        let obj = {};
        let anime_list = [];
        (obj.status = "success"), (obj.baseUrl = fullUrl);
        let note = element.find(".rvad").find("h1").text()
        if (element.find("ul > li").length === 0) {
            obj.search_results = [];
        } else {
            element.find("ul > li").each(function () {
                const genre_list = [];
                $(this).find(".set").find("a").each(function () {
                    const genre_result = {
                        genre_title: $(this).text(),
                        genre_link: $(this).attr("href"),
                        genre_id: $(this).attr("href").substring(`${helpers.url}/genres/`.length),
                    };
                    genre_list.push(genre_result);
                });
                const results = {
                    thumb: $(this).find("img").attr("src"),
                    title: $(this).find("h2").text(),
                    link: $(this).find("h2 > a").attr("href"),
                    id: $(this).find("h2 > a").attr("href").substring(`${helpers.url}/anime/`.length),
                    status: $(this).find(".set").eq(1).text().replace("Status : ", ""),
                    score: parseFloat(
                        $(this).find(".set").eq(2).text().replace("Rating : ", "")
                    ),
                    genre_list,
                };
                anime_list.push(results);
                obj.note = note
                obj.search_results = anime_list;
            });
        }
        res.send(obj);
    });
};