
const userRoutes = (app, fs, service) => {
  // variables
  const dataPath = "./data/users.json";
  const Joi = require('joi');
  const userSchema = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
  });

  // refactored helper methods
  const readFile = (
      callback,
      returnJson = false,
      filePath = dataPath,
      encoding = "utf8"
  ) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }

      callback(returnJson ? JSON.parse(data) : data);
    });
  };

  const writeFile = (
      fileData,
      callback,
      filePath = dataPath,
      encoding = "utf8"
  ) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }

      callback();
    });
  };

  // CREATE
  app.post("/users", (req, res) => {
    try
    {
      readFile((data) => {

          let valid = userSchema.validate( req.body );
          if (valid.error)
          {
            res.status(422).json({
              status: 'error',
              message: valid.error.details[0].message,
              data: req.body
            });
          }
          else
          {
            let key = 0;
            let t = 0;
            for(key in data){
              if (data[key].email === req.body.email)
              {
                t = Boolean("true");
              }
            }
            if (!t)
            {
              const newUserId = Object.keys(data).length + 1;
              // add the new user
              data[newUserId] = req.body;

              writeFile(JSON.stringify(data, null, 2), () => {
                res.status(201).send("New user added");
              });
            }
            else{
              res.status(409).send("Email already exists");
            }
          }

      }, true);
    }catch (e){
      res.status(500).send("internal server error");
      console.log("Error: " + e);
    }
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });

  // LOGIN
  app.post("/login", (req, res) => {
    try{
      readFile((data) => {
        let key = 0;
        let exist = 0;
        let correctPass = 0;
        let userid = -1;
        for(key in data){
          if (data[key].email === req.body.email)
          {
            //usuario existe
            exist = Boolean("true");
            correctPass = (data[key].password === req.body.password);
            userid = key;
          }
        }
        // Comprobar si hay errores
        // Si el usuario existe o no
        // Y si la contraseña es correcta
        console.log(userid);

        if (correctPass)
        {
          return res
              .status(200)
              .send({token: service.createToken(userid)});
        }
        else{
          res.status(401).send("Incorrect user or password");
        }
      }, true);
    }catch (e){
      res.status(500).send("Internal server error");
      console.log(e);
    }
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });;

  // READ
  app.get("/users", (req, res) => {
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      res.send(JSON.parse(data));
    });
  });
};




module.exports = userRoutes;