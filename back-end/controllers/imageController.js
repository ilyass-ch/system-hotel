const Thing = require("../models/image");

exports.createThing = (req, res, next) => {
  const body = req.body;
  const uploadedFile = req.file;

  console.log('====================================');
  console.log('uploadedFile', req.file);
  console.log('====================================');

  console.log('====================================');
  console.log('just for testing');
  console.log('====================================');
  if (!uploadedFile) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`

  const thing = new Thing({
    ...body,
    imageUrl,
  });

  thing
    .save()
    .then(() => {
      console.log('====================================');
      console.log('Response ....');
      console.log('====================================');
      res.status(200).json({ message: "Objet enregistré !", imageUrl });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getThingById = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id,
  })
    .then((thing) => {
      res.status(200).json(thing);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.updateThing = (req, res, next) => {
  const thing = new Thing({
    _id: req.params.id,
    imageUrl: req.body.imageUrl,
  });

  
  Thing.updateOne({ _id: req.params.id }, thing)
    .then(() => {
      res.status(201).json({
        message: "Thing updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.deleteThing = (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Deleted!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getAllThings = (req, res, next) => {
  Thing.find()
    .then((things) => {
      res.status(200).json(things);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
   });
};