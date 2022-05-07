const cheerio = require("cheerio");
const { default: Axios } = require("axios");
const helpers = require("../Helpers/url");


//TODO: ANIME BY GENRE
module.exports = (req, res, dbResult) => {
    const logPush = require("../Helpers/log_push")
    logPush(dbResult)
    const pageNumber = req.params.pageNumber;
    const genreId = req.params.genreId;
    const fullUrl = helpers.url + `/genres/${genreId}/page/${pageNumber}`;
    // console.log(fullUrl);
    Axios.get(fullUrl)
        .then((response) => {
            const $ = cheerio.load(response.data);
            const element = $(".page");
            let animeList = [];
            let genreList = [];
            let object = {};
            let genre_name, genre_link, genre_id;
            let note = element.find(".rvad").find("h1").text()
            element.find(".col-md-4").each(function () {
                object = {};
                object.anime_name = $(this).find(".col-anime-title").text();
                object.thumb = $(this).find('div.col-anime-cover > img').attr('src')
                object.link = $(this).find(".col-anime-title > a").attr("href");
                object.id = $(this)
                    .find(".col-anime-title > a")
                    .attr("href").substring(`${helpers.url}/anime/`.length);
                object.studio = $(this).find(".col-anime-studio").text();
                object.episode = $(this).find(".col-anime-eps").text();
                object.score = parseFloat($(this).find(".col-anime-rating").text());
                object.release_date = $(this).find(".col-anime-date").text();
                genreList = [];
                $(this)
                    .find(".col-anime-genre > a")
                    .each(function () {
                        genre_name = $(this).text();
                        genre_link = $(this).attr("href");
                        genre_id = $(this).attr("href").substring(`${helpers.url}/genres/`.length);
                        genreList.push({ genre_name, genre_link, genre_id });
                        object.genre_list = genreList;
                    });
                animeList.push(object);
            });
            res.send({
                apikey_info: {
                    apikey: dbResult.apikey,
                    name: dbResult.nama,
                    email: dbResult.email,
                    msg_from_admin : dbResult.msg_admin
                },
                status: "success",
                baseUrl: fullUrl,
                note,
                animeList,
            });
        })
        .catch((err) => {
            console.log(err.message);
        });
};