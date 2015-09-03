module.exports = function(app, db, upload, easyimage) {

    /* GET home page. */
    app.get('/', function(req, res, next) {
      res.render('index', { title: 'PaloFcooK' });
    });

    app.get('/resourcelist', function(req, res) {
        //var db = req.db;
        var text = req.query.q;
        var resourceCollection = db.get('resource');
        
        resourceCollection.find({ 'name': {$regex : ".*" + text + ".*"} },{},function(e,docs){
            res.json(docs);
        });
    });

    app.get('/newrecipe', function(req, res) {
        var ingredientCollection = db.get('ingredient');
        var resourceCollection = db.get('resource');
        console.log('hejj');
        console.log('ingredientCollection', ingredientCollection);
        console.log('ingredientCollectionFind', ingredientCollection.find({}, {}));
        ingredientCollection.find({}, {}, function(e, ingredientList){
            resourceCollection.find({}, {}, function(e, resourceList){
                console.log('resourceList', resourceList);
                res.render('newrecipe', {
                    "ingredientList" : ingredientList,
                    "resourceList" : resourceList
                });
            });
        });
    });

    app.post('/newrecipe', function(req, res) {
        var data;
        if (req.body !== undefined) {
            console.log('req.body', req.body);
            data = req.body;
            data.slug = data.text;
            console.log('data', data);
        }
        
        var processCollection = db.get('process');

        // Submit to the DB
        processCollection.insert(data, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // And forward to success page
                res.redirect("newrecipe");
            }
        });
    });

    /* POST to Add Ingredient Service */
    app.post('/newingredient', upload.single('image'), function(req, res, next) {

        // Get our form values. These rely on the "name" attributes
        var name = req.body.name;
        var description = req.body.description;

        // Set our collection
        var collection = db.get('ingredient');

        // Submit to the DB
        collection.insert({
            "id" : name,
            "name" : name,
            "description" : description,
            "image" : req.file
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // And forward to success page
                res.redirect("newrecipe");
            }
        });
    });

    /* POST to Add Resource Service */
    app.post('/newresource', upload.single('image'), function(req, res, next) {

        // Get our form values. These rely on the "name" attributes
        var name = req.body.name;
        var description = req.body.description;

        // Set our collection
        var collection = db.get('resource');

        if (req.file !== undefined) {
            var imgInfo = easyimage.info(req.file.path);
            easyimage.rescrop({
                 src: req.file.path, 
                 dst: req.file.destination + 'small/' + req.file.filename,
                 width: 100,
                 height: 100,
                 cropwidth: 64,
                 cropheight: 64,
                 x: imgInfo.width / 2 - 32,
                 y: imgInfo.height / 2 - 32
            }).then(
                function(image) {
                    console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
                    req.file.destination = req.file.destination + 'small/' + req.file.filename;
                    req.file.filename = req.file.destination + 'small/' + req.file.filename;
                },
                function (err) {
                    console.log(err);
                }
            )
        }
console.log(collection);
        // Submit to the DB
        collection.insert({
            "id" : name,
            "name" : name,
            "description" : description,
            "image" : req.file
        }, function (err, doc) {
            if (err) {
                console.log('err', err);
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // And forward to success page
                res.redirect("newrecipe");
            }
        });
    });

};
