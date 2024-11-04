const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Joi = require('joi');

// Schéma de validation
const productSchema = Joi.object({
    name: Joi.string().required().trim().max(32),
    description: Joi.string().required().max(2000),
    price: Joi.number().required().positive(),
    category: Joi.string().required(),
    quantity: Joi.number().required().integer(),
    shipping: Joi.boolean()
});

exports.createProduct = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        // Validate fields using Joi
        const { error } = productSchema.validate(fields);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            });
        }

        let product = new Product(fields);

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1MB in size'
                });
            }
            // Convert photo data to a buffer and store it in the database
            fs.readFile(files.photo.path, (err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Failed to read photo data'
                    });
                }
                product.photo = {
                    data: data,
                    contentType: files.photo.type
                };
                
                product.save((err, result) => {
                    if (err) {
                        return next(err);
                    }
                    res.json(result);
                });
            });
        } else {
            // If no photo is uploaded, save the product without the photo
            product.save((err, result) => {
                if (err) {
                    return next(err);
                }
                res.json(result);
            });
        }
    });
};

exports.showProduct = (req, res) => {
    // req.product.photo = undefined; // Pour ne pas envoyer les données de la photo
    return res.json(req.product);
};

exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: 'Product not found'
            });
        }
        req.product = product;
        next();
    });
};


exports.removeProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: 'Failed to delete product'
            });
        }
        res.status(204).json({});
    });
};

exports.updateProduct = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        // Valider les champs avec Joi
        const { error } = productSchema.validate(fields);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            });
        }

        let product = req.product

        product = _.extend(product, fields); // Copier les valeurs de fields dans product

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1MB in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return next(err); // Utilisation correcte de next pour gérer les erreurs
            }
            res.json(result);
        });
    });
};

exports.allProducts = (req, res) => {

    let sortBy = req.query.sortBy?req.query.sortBy : '_id';
    let order = req.query.order?req.query.order : 'asc';
    let limit = req.query.limit?parseInt(req.query.limit) : 100;

    Product.find()
        .select("-photo")
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(404).json({
                    error: "Could not retrieve products"
                });
            }
            res.json({products});
        });
};



exports.relatedProduct = (req, res) => {
    const productId = req.params.productId;
    const limit = req.query.limit ? parseInt(req.query.limit) : 3; // Using req.query.limit instead of req.params.limit

    // Find the current product
    Product.findById(productId)
        .populate('category', '_id name')
        .exec((err, product) => {
            if (err || !product) {
                return res.status(404).json({
                    error: 'Product not found'
                });
            }

            // Find related products based on the same category
            Product.find({ category: product.category._id, _id: { $ne: product._id } })
                .limit(limit) // Limit the number of related products to be shown
                .select('-photo')
                .populate('category', '_id name')
                .exec((err, products) => {
                    if (err) {
                        return res.status(404).json({
                            error: 'Error retrieving related products'
                        });
                    }
                    res.json({ products });
                });
        });
};

exports.searchProduct = (req, res) => {

    let sortBy = req.query.sortBy?req.query.sortBy : '_id';
    let order = req.query.order?req.query.order : 'asc';
    let limit = req.query.limit?parseInt(req.query.limit) : 100;
    let skip = req.query.skip?parseInt(req.query.skip) : 0;
    let findArgs = {}

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .skip(skip)
        .exec((err, products) => {
            if (err) {
                return res.status(404).json({
                    error: "Could not retrieve products"
                });
            }
            res.json({products});
        });

}

exports.photoProduct = (req, res) => {
    const { data, contentType } = req.product.photo
    if (data) {
        res.set("Content-Type", contentType);
        return res.send(data);
    }
    res.status(404).json({
        error: 'Image not found'
    });
}