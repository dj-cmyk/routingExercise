const express = require('express');
const ExpressError = require("./expressError");
const router = new express.Router();
const items = require('./fakeDB');


router.get("/", function (req, res) {
    return res.json({ items })
})
  
router.post("/", function (req, res, next) {
    try {
      if (!req.body.name) throw new ExpressError("Name is required", 400);
      if (!req.body.price) throw new ExpressError("Price is Required", 400);
      const newItem = { name: req.body.name, price: req.body.price }
      items.push(newItem)
      return res.status(201).json({ added: {newItem} })
    } catch (e) {
      return next(e)
    }
})
  

router.get('/:name', function (req, res, next) {
    const foundItem = items.find(item => item.name === req.params.name)
    try {
        if (foundItem === undefined) throw new ExpressError("Item not found", 404)
        return res.json({foundItem})
    } catch(e) {
        return next(e)
    }
})


router.patch('/:name', function (req, res, next) {
    const foundItem = items.find(item => item.name === req.params.name)
    try {
        if (foundItem === undefined) throw new ExpressError("Item not found", 404)
        foundItem.name = req.body.name
        foundItem.price = req.body.price
        return res.json({ updated: foundItem })
    } catch(e) {
        return next(e)
    }
})


router.delete('/:name', function (req, res, next) {
    const foundItem = items.find(item => item.name === req.params.name)
    if (foundItem === undefined) {
        throw new ExpressError("Cat not found", 404)
    }
    items.splice(foundItem, 1)
    return res.json({ message: 'Deleted' })

})

module.exports = router