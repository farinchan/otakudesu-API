const cheerio = require("cheerio");
const { default: Axios } = require("axios");
const helpers = require("../Helpers/url");

//TODO: HOME PAGE
module.exports = (req, res, dbResult) => {
    const logPush = require("../Helpers/log_push")
    logPush(dbResult)
    console.log(req.query.apikey);
    let home = {};
    let on_going_anime = [];
    let complete_anime = [];
    Axios.get(helpers.url)
        .then((response) => {
            const $ = cheerio.load(response.data);
            const BaseElement = $(".venz");
            let thumb, title, link, id;
            let logo = $(".logo").find("a").find("img").attr("src")
            let about = $(".textwidget").find("p").text()
            BaseElement
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
                        })
                    on_going_anime.push({
                        link,
                        id,
                        title,
                        thumb,
                        uploaded_on: $(this).find(".newnime").text(),
                        episode: $(this).find(".epz").text().replace(" ", ""),
                        day_updated: $(this).find(".epztipe").text().replace(" ", ""),
                    })


                });
            BaseElement
                .children()
                .eq(1)
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
                    complete_anime.push({
                        link,
                        title,
                        id,
                        thumb,
                        uploaded_on: $(this).find(".newnime").text(),
                        episode: $(this).find(".epz").text().replace(" ", ""),
                        score: parseFloat($(this).find(".epztipe").text().replace(" ", ""))
                    });
                });
            home.on_going_anime = on_going_anime;
            home.complete_anime = complete_anime;
            res.status(200).json({
                apikey_info: {
                    apikey: dbResult.apikey,
                    name: dbResult.nama,
                    email: dbResult.email,
                    msg_from_admin : dbResult.msg_admin
                },
                status: "success",
                baseUrl: helpers.url,
                logo,
                about,
                home,
            });
            return response;
        })
        .catch((e) => {
            console.log(e.message);
        });
};