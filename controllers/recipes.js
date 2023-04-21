const Recipe = require('../models/recipe');
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const recipes = await Recipe.find({}).populate();
    res.send({recipes});
}

module.exports.createRecipe= async (req, res, next) => {

    console.log('am intrat aici', req.body);
    const recipe = new Recipe(req.body.recipe);
    // recipe.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    recipe.author = req.user._id;
    await recipe.save();
    res.send({recipe});
    console.log(recipe);
}

module.exports.showRecipe = async (req, res,) => {
    const recipe = await Recipe.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!recipe) {
        return res.redirect('/recipes');
    }
    res.send({ recipe });
}

module.exports.updateRecipe = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const recipe = await Recipe.findByIdAndUpdate(id, { ...req.body.recipe });
    // const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // recipe.images.push(...imgs);
    await recipe.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await recipe.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    res.send({ recipe });
}

module.exports.deleteRecipe = async (req, res) => {
    const { id } = req.params;
    await Recipe.findByIdAndDelete(id);
    res.send({ id })
}