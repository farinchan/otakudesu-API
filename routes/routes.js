const apikeyRoutes = require("../Helpers/apikey")
const home = require("../controller/home_controller")
const completeAnime = require("../controller/complete_anime_controller")
const ongoingAnime = require("../controller/ongoing_anime_controller")
const genre = require("../controller/genre_controller")
const animeByGenre = require("../controller/animeByGenre_controller")
const jadwal = require("../controller/jadwal_controller")
const search = require("../controller/search_controller")
const fanpage = require("../controller/fanpage_controller")



module.exports = (app) => {

    app.route('/complete-anime/page/:page').get((req, res) => {
        apikeyRoutes(req, res, completeAnime)
    })
    app.route('/ongoing-anime/page/:page').get((req, res) => {
        apikeyRoutes(req, res, ongoingAnime)
    })
    app.route('/jadwal').get((req, res) => {
        apikeyRoutes(req, res, jadwal)
    })
    app.route('/genre-list').get((req, res) => {
        apikeyRoutes(req, res, genre)
    })
    app.route('/genres/:genreId/page/:pageNumber').get((req, res) => {
        apikeyRoutes(req, res, animeByGenre)
    })
    app.route('/search/:query').get((req, res) => {
        apikeyRoutes(req, res, search)
    })
    app.route('/fanpage').get((req, res) => {
        apikeyRoutes(req, res, fanpage)
    })

}