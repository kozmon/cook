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
        ingredientCollection.find({}, {}, function(e, ingredientList){
            resourceCollection.find({}, {}, function(e, resourceList){
                res.render('edit_process', {
                    "paramProcess" : '',
                    "ingredientList" : ingredientList,
                    "resourceList" : resourceList
                });
            });
        });
    });

    app.get('/recipes', function(req, res) {
        var processCollection = db.get('process');
        processCollection.find({}, {}, function(e, processList){
            res.render('process_list', {
                "processList" : processList
            });
        });
    });

    app.get('/editrecipe', function(req, res) {
        res.redirect("newrecipe");
    });
    
    app.get('/recipe/:slug', function(req, res) {
        var processCollection = db.get('process');
        
        processCollection.findOne({'title': req.params.slug}, {}, function(e, process){
            res.render('view_process', {
                "paramProcess" : process,
            });
        });
    });

    app.get('/editrecipe/:slug', function(req, res) {
        var ingredientCollection = db.get('ingredient');
        var resourceCollection = db.get('resource');
        var processCollection = db.get('process');
        
        processCollection.findOne({'title': req.params.slug}, {}, function(e, process){
            ingredientCollection.find({}, {}, function(e, ingredientList){
                resourceCollection.find({}, {}, function(e, resourceList){
                    res.render('edit_process', {
                        "paramProcess" : process,
                        "ingredientList" : ingredientList,
                        "resourceList" : resourceList
                    });
                });
            });
        });
    });

    app.post('/addprocess', function(req, res) {
        var formData;
        var data = {};
        if (req.body !== undefined) {
            formData = req.body;
            data.slug = data.title;
            data.title = formData.title;
            data.description = formData.description;
        } else {
            // todo: some error
        }
        
        console.log(formData);
        
        // todo: validation, formatting
/*        
        console.log('**********************');
        console.log(formData.instruction_step_text[1]);
        console.log('**********************');
        for (var i=0;i<formData['instruction_step_text'].length;i++) {
            console.log(i, formData['instruction-step-text'][i]);
        }
        console.log('**********************');
*/
        var processCollection = db.get('process');

        processCollection.update({ title: formData.title }, formData, {upsert: true}, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // And forward to success page
                res.redirect("recipe/" + formData.title);
            }
        });

        // processCollection.insert(formData, function (err, doc) {
            // if (err) {
                // // If it failed, return error
                // res.send("There was a problem adding the information to the database.");
            // }
            // else {
                // // And forward to success page
                // res.redirect("newrecipe");
            // }
        // });
    });

    app.post('/uploadtemporaryimage', upload.single('image'), function(req, res, next) {
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
    });
    
    app.post('/addingredient', function(req, res, next) {
        var title = req.body.title;
        var description = req.body.description;

        var collection = db.get('ingredient');

        collection.insert({
            "id" : title,
            "title" : title,
            "description" : description
        }, function (err, doc) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // http://stackoverflow.com/questions/18065812/render-view-into-a-variable-in-expressjs-for-ajax-response
                app.render('ingredient_box', {object: doc, layout: false}, function(err, html){
                    var response = {
                        result: 1,
                        html: html
                    };
                    res.send(response);
                });
            }
        });
    });

    app.post('/addresource', function(req, res, next) {
        var title = req.body.title;
        var description = req.body.description;

        var collection = db.get('resource');

        collection.insert({
            "id" : title,
            "title" : title,
            "description" : description
        }, function (err, doc) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            }
            else {
                app.render('resource_box', {object: doc, layout: false}, function(err, html){
                    var response = {
                        result: 1,
                        html: html
                    };
                    res.send(response);
                });
            }
        });
    });

    /* POST to Add Resource Service */
    app.post('/addresource2', upload.single('image'), function(req, res, next) {

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
