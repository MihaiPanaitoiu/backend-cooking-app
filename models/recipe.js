const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const IngredientSchema = new Schema({
    name: String,
    amount: String,
    unit: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h200');
});

const opts = { toJSON: { virtuals: true } };

const RecipeSchema = new Schema({
    title: String,
    images: [ImageSchema],
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ingredients: [IngredientSchema],
    cookingSteps: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);


// RecipeSchema.virtual('properties.popUpMarkup').get(function () {
//     return `
//     <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
//     <p>${this.description.substring(0, 20)}...</p>`
// });



RecipeSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Recipe', RecipeSchema);