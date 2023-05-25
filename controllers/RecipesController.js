const express = require('express');
var router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

const { Recipe } = require('../models/recipe');

router.get('/', (req, res) => {
    Recipe.find((err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            console.log('Error in retrieving recipes : ', JSON.stringify(err, undefined, 2));
        }
    });
});

router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Recipe with this id is not exist. Id : ', req.params.id)
    }

    Recipe.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            console.log('Error in retrieving recipes : ', JSON.stringify(err, undefined, 2));
        }
    })
});

router.post('/', (req, res) => {
    var recipe = new Recipe(
        {
            categories: req.body.categories,
            image: req.body.image,
            title: req.body.title,
            ingredients: req.body.ingredients,
            approved: req.body.approved
        }
    );

    recipe.save((err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            console.log('An error occurred while creating a new recipe: ', JSON.stringify(err, undefined, 2));
        }
    });
});

router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Recipe with this id is not exist. Id : ', req.params.id)
    }

    Recipe.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            console.log('An error occurred while deleting a recipe: ', JSON.stringify(err, undefined, 2));
        }
    })
});

  router.put('/:id', async (req, res) => {
    try {
      const recipeId = req.params.id;
      const { approved } = req.body; 
  
      const recipe = await Recipe.findByIdAndUpdate(
        recipeId,
        { approved },
        { new: true }
      );
  
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
  
      res.json(recipe);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the recipe' });
    }
  });

module.exports = router;
