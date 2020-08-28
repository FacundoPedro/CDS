// load up our shiny new route for users
const userRoutes = require("./users");
const filmRoutes = require("./films");
const favoriteRoutes = require("./favorites");

const service = require('./services');



const appRouter = (app, fs) => {
    // we've added in a default route here that handles empty routes
    // at the base API url
    app.get("/", (req, res) => {
        res.send("welcome to the development api-server");
    });

    // run our user route module here to complete the wire up
    userRoutes(app, fs, service);
    favoriteRoutes(app, fs);
    filmRoutes(app);
};

// this line is unchanged
module.exports = appRouter;