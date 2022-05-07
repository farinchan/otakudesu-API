const cheerio = require("cheerio");
const { default: Axios } = require("axios");
const helpers = require("../Helpers/url");

//TODO: On Going Anime List
module.exports = (req, res, dbResult) => {
    const logPush = require("../Helpers/log_push")
    logPush(dbResult)
    const params = req.params.page
    const page = typeof params === "undefined" ? "" : params === "1" ? "" : `page/${params}`;
    const fullUrl = `${helpers.url}/ongoing-anime/${page}`;
    Axios.get(fullUrl)
        .then((response) => {
            const $ = cheerio.load(response.data);
            const element = $(".venz");
            let animeList = [];
            // let scrPage = $(".pagenavix").find("a").eq(0).attr("href")
            // let Pagination = scrPage.match(/(\d+)/).index;
            let thumb, title, link, id;
            element
                .children()
                .eq(0)
                .find("ul > li")
                .each(function () {
                    $(this)
                        .find(".thumb > a")
                        .filter(function () {
                            title = $(this).find(".thumbz > h2").text();
                            thumb = $(this).find(".thumbz > img").attr("src");
                            link = $(this).attr("href");
                            id = $(this).attr("href").substring(`${helpers.url}/anime/`.length);
                        });

                    animeList.push({
                        link,
                        title,
                        id,
                        thumb,
                        uploaded_on: $(this).find(".newnime").text(),
                        episode: $(this).find(".epz").text().replace(" ", ""),
                        day_updated: $(this).find(".epztipe").text().replace(" ", "")
                    });
                });
            res.status(200).json({
                status: "success",
                baseUrl: helpers.url,
                page: parseInt(params),
                animeList,
            });
        })
        .catch((err) => {
            console.log(err.message);
        });
};