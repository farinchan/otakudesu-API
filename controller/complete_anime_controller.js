const cheerio = require("cheerio");
const { default: Axios } = require("axios");
const helpers = require("../Helpers/url");

//TODO:  Complete Anime List
//FIXME: BAGIAN UNTUK PAGINATION HAL 1 DAN 43 KEATAS TIDAK BISA
module.exports = (req, res, dbResult) => {
    const params = req.params.page;
    const page =
        typeof params === "undefined" ? "" : params === "1" ? "" : `page/${params}`;
    let fullUrl = `${helpers.url}/complete-anime/${page}`;
    console.log(fullUrl);

    Axios.get(fullUrl)
        .then((response) => {
            const $ = cheerio.load(response.data);
            const element = $(".venz");
            let animeList = [];
            let scrPage = $(".pagenavix").find("a").eq(5).attr("href")
            let Pagination = scrPage.match(/(\d+)/).index - 1;
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
                            id = $(this).attr("href").substring(`${helpers.url}/anime/`.length + 1)
                        });
                    animeList.push({
                        link,
                        title,
                        id,
                        thumb,
                        uploaded_on: $(this).find(".newnime").text(),
                        episode: $(this).find(".epz").text().replace(" ", ""),
                        score: parseFloat($(this).find(".epztipe").text().replace(" ", ""))
                    });
                });
            res.status(200).json({
                status: "success",
                baseUrl: fullUrl,
                page: parseInt(page),
                Pagination,
                animeList,
            });
        })
        .catch((err) => {
            console.log(err.message);
            res.json({
                msg: err.message
            })
        });
};