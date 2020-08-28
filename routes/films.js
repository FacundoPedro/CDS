let middleware = require('./middleware');
const config = require('../config');
const filmRoutes = (app) => {
    // variables
    let filmsPath = config.FILMS_PATH;
    const Joi = require('joi');
    const filmSchema = Joi.object({
        keyword: Joi.string()
    });

    // READ
    app.get("/films", middleware.ensureAuthenticated, (req, res) => {
        try{
            let valid = filmSchema.validate( req.body );
            filmsPath = config.FILMS_PATH;
            if (req.body.keyword)
            {
                filmsPath = config.FILMS_PATH_KEYWORD;
                filmsPath = filmsPath.concat(req.body.keyword);
                console.log(filmsPath);
            }
            const https = require('https');
            https.get(filmsPath, (resp) => {
                let data = '';

                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    let film;
                    let films = JSON.parse(data).results;
                    let result= {};
                    let key = 'films';
                    result[key] = [];
                    for(film in films) {
                        result[key].push({'film': films[film].original_title, 'suggestionScore':Math.floor(Math.random() * 100)});
                    }
                    result[key].sort(function(a,b){
                            return a.suggestionScore - b.suggestionScore;
                        }
                    );
                    res.status(200).send(result);
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
                throw err;
            });
        }catch (e){
            res.status(500).send("Internal server error");
            console.log(e);
        }
    });
};



module.exports = filmRoutes;