const { Customer, validateCustomer} = require('../models/customer');
const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
    Customer.find(function (err, customers) {
        if (err) {
            return res.status(404).send(err.message);
        }
        res.send(customers);
    })
});

router.get("/:id", async (req, res) => {
    // const customer = await Customer.findById(req.params.id);
    await Customer.findById(req.params.id, function (err, customer) {
        if (err) {
            return res.status(404).send(`The customer with the id ${req.params.id} was not found`);
        }
        res.send(customer);
    });
});


router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body); // ES6 object distructuring feature
    if (error) return res.status(400).send(error.details[0].message); // 400 - bad request

    let customer = new Customer({ 
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
     });
    customer = await customer.save();
    res.send(customer);
});


router.put('/:id', async (req, res) => {
    // validate 
    // if invalid, return 400 - bad request
    const { error } = validateCustomer(req.body); // ES6 object distructuring feature
    if (error) return res.status(400).send(error.details[0].message);

    // look up the customer
    // if not existing, return 404 - not found
    // Update customer
    await Customer.findByIdAndUpdate(req.params.id,
        { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold }, 
        { new: true }, function (err, customer) {
            if (err) {
                if (!customer) res.status(404).send(`The customer with the id ${req.params.id} was not found`);
            }
            // Return the updated customer
            res.send(customer);
    });
});


router.delete('/:id', async (req, res) => {
    // look up the customer
    // if not existing, return 404 - not found
    await Customer.findByIdAndDelete(req.params.id, function (err, customer) {
        if (err) {
            if (!customer) return res.status(404).send(`The customer with the id ${req.params.id} was not found`);
        }
        // return the same customer
        res.send(customer);
    });

});

module.exports = router;