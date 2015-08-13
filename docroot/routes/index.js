var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

/* GET New User page. */
router.get('/newprocess', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    var processCollection = db.get('process');
    var resourceCollection = db.get('resource');
    
    processCollection.find({},{},function(e,processlist){
        resourceCollection.find({},{},function(e,resourcelist){
            res.render('newprocess', {
                "processlist" : processlist,
                "resourcelist" : resourcelist
            });
        });
    });
});

/* POST to Add Process Service */
router.post('/addprocess', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.name;
    var parameters = req.body.parameters;
    var resources = req.body.resources;
    var duration = req.body.duration;
    var result = req.body.result;

    // Set our collection
    var collection = db.get('process');

    // Submit to the DB
    collection.insert({
        "name" : name,
        "parameters" : parameters,
        "resources" : resources,
        "duration" : duration,
        "result" : result
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("newprocess");
        }
    });
});

/* POST to Add Resource Service */
router.post('/addresource', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.name;
    var parameters = req.body.parameters;

    // Set our collection
    var collection = db.get('resource');

    // Submit to the DB
    collection.insert({
        "name" : name,
        "parameters" : parameters
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("newprocess");
        }
    });
});

