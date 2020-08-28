module.exports = {
     TOKEN_SECRET: process.env.TOKEN_SECRET || "tokenultrasecreto",
     FILMS_PATH: "https://api.themoviedb.org/3/movie/top_rated?api_key=31fef7a5470494392cac550da2d8cbda&language=en-US&page=1",
     FILMS_PATH_KEYWORD:"https://api.themoviedb.org/3/search/movie?api_key=31fef7a5470494392cac550da2d8cbda&language=en-US&page=1&include_adult=false&query=",
     TOKEN_TIME:5
};