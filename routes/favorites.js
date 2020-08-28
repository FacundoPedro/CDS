let middleware = require('./middleware');
const favoriteRoutes = (app, fs) => {
    // variables
    //hay que agregar el id del usuario al path
    let favoritesPath = "./data/";
    const Joi = require('joi');
    const userSchema = Joi.object({
        film: Joi.string().required()
    });

    const writeFile = (
        fileData,
        filePath = favoritesPath,
        callback,
        encoding = "utf8"
    ) => {
        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // ADD
    app.post("/favorites",middleware.ensureAuthenticated, (req, res) => {
        try {
            fs.readFile(favoritesPath.concat(req.user, ".json"), "utf8", (err, data) => {
                if (err && err.code === 'ENOENT') {
                    data = '{"Favorites":[]}';
                    let json = JSON.parse(data)
                    writeFile(JSON.stringify(data, null, 2), favoritesPath.concat(req.user, ".json"), () => {

                    });
                }
                let valid = userSchema.validate(req.body);
                if (valid.error) {
                    res.status(422).json({
                        status: 'error',
                        message: valid.error.details[0].message,
                        data: req.body
                    });
                } else {
                    let t = 0;
                    console.log(data);
                    let json = JSON.parse(data);
                    let key = 'Favorites';
                    for (let film in json.Favorites) {
                        console.log(json.Favorites[film].Name)
                        if (json.Favorites[film].Name === req.body.film) {
                            t = Boolean("true");
                        }
                    }
                    if (!t) {
                        json.Favorites.push({'Name': req.body.film})

                        writeFile(JSON.stringify(json, null, 2), favoritesPath.concat(req.user, ".json"), () => {
                            res.status(201).send("Added to favorites");
                        });
                    } else {
                        res.status(409).send("Already in favorites");
                    }
                }
            }, true);
        }catch(e){
            res.status(500).send("Internal server error");
            console.log(e);
        }
    });

    // READ
    app.get("/favorites",middleware.ensureAuthenticated, (req, res) => {
        try {
            fs.readFile(favoritesPath.concat(req.user, ".json"), "utf8", (err, data) => {
                if (err && err.code === 'ENOENT') {
                    data = '{"Favorites":[]}';
                    let json = JSON.parse(data)
                    writeFile(JSON.stringify(json, null, 2), favoritesPath.concat(req.user, ".json"), () => {

                    });
                }

                let json = JSON.parse(data);
                let result = {};
                let key = 'Favorites';
                result[key] = [];
                for (let film in json.Favorites) {
                    result[key].push({
                        'film': json.Favorites[film].Name,
                        'suggestionForTodayScore': Math.floor(Math.random() * 100)
                    });

                }
                result[key].sort(function (a, b) {
                        return a.suggestionForTodayScore - b.suggestionForTodayScore;
                    }
                );
                res.send(result);
            });
        }catch(e){
            res.status(500).send("Internal server error");
            console.log(e);
        }
    });
};

module.exports = favoriteRoutes;