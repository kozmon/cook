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
        collectProcessData(function(data) {
            res.render('process/edit_process', data);
        });
    });

    app.get('/editrecipe/:slug', function(req, res) {
        var processCollection = db.get('process');
        
        processCollection.findOne({'title': req.params.slug}, {}, function(e, process) {
            collectProcessData(function(data) {
                data.paramProcess = process;
                data.jsParams.process = process;
                res.render('process/edit_process', data);
            });
        });
    });

    app.get('/newkitchen', function(req, res) {
        collectKitchenData(function(data) {
            res.render('kitchen/edit_kitchen', data);
        });
    });

    app.get('/editkitchen/:slug', function(req, res) {
        var kitchenCollection = db.get('kitchen');
        
        kitchenCollection.findOne({'title': req.params.slug}, {}, function(e, kitchen) {
            collectKitchenData(function(data) {
                data.paramKitchen = kitchen;
                data.jsParams.kitchen = kitchen;
                res.render('kitchen/edit_kitchen', data);
            });
        });
    });

    function collectKitchenData(callback) {
        var ingredientCollection = db.get('ingredient');
        var resourceCollection = db.get('resource');
        var processCollection = db.get('process');
        
        // var templates = loadTemplates([
            // { file: 'process/instruction_step_row.jade', key: 'instruction_step_row' },
            // { file: 'process/add_instruction_step_ingredient_row.jade', key: 'add_instruction_step_ingredient_row' },
            // { file: 'process/add_instruction_step_resource_row.jade', key: 'add_instruction_step_resource_row' },
            // { file: 'process/add_instruction_step_prerequisite_row.jade', key: 'add_instruction_step_prerequisite_row' },
            // { file: 'process/instruction_step_ingredient_row.jade', key: 'instruction_step_ingredient_row' },
            // { file: 'process/instruction_step_resource_row.jade', key: 'instruction_step_resource_row' },
            // { file: 'process/instruction_step_prerequisite_row.jade', key: 'instruction_step_prerequisite_row' },
        // ]);

        processCollection.find({}, {}, function(e, processList) {
            ingredientCollection.find({}, {}, function(e, ingredientList) {
                resourceCollection.find({}, {}, function(e, resourceList) {
                    app.render('ingredient/add_ingredient_row.jade', {layout: false}, function(err, add_ingredient_row) {
                        app.render('resource/add_resource_row.jade', {layout: false}, function(err, add_resource_row) {
                            app.render('ingredient/ingredient_row.jade', {layout: false}, function(err, ingredient_row) {
                                app.render('resource/resource_row.jade', {layout: false}, function(err, resource_row) {
                                    var templates = {
                                        add_ingredient_row : {
                                            html: add_ingredient_row
                                        },
                                        add_resource_row : {
                                            html: add_resource_row
                                        },
                                        ingredient_row : {
                                            html: ingredient_row
                                        },
                                        resource_row : {
                                            html: resource_row
                                        }
                                    };
                                    
                                    var ret = {
                                        jsParams : {
                                            templates : templates,
                                            availableProcessList : processList,
                                            availableIngredientList : ingredientList,
                                            availableResourceList : resourceList
                                        },
                                        availableProcessList : processList,
                                        availableIngredientList : ingredientList,
                                        availableResourceList : resourceList
                                    };
                                    
                                    callback(ret);
                                });
                            });
                        });
                    });
                });
            });
        });
    };
    
    function collectProcessData(callback) {
        var ingredientCollection = db.get('ingredient');
        var resourceCollection = db.get('resource');
        var processCollection = db.get('process');
        
        // var templates = loadTemplates([
            // { file: 'process/instruction_step_row.jade', key: 'instruction_step_row' },
            // { file: 'process/add_instruction_step_ingredient_row.jade', key: 'add_instruction_step_ingredient_row' },
            // { file: 'process/add_instruction_step_resource_row.jade', key: 'add_instruction_step_resource_row' },
            // { file: 'process/add_instruction_step_prerequisite_row.jade', key: 'add_instruction_step_prerequisite_row' },
            // { file: 'process/instruction_step_ingredient_row.jade', key: 'instruction_step_ingredient_row' },
            // { file: 'process/instruction_step_resource_row.jade', key: 'instruction_step_resource_row' },
            // { file: 'process/instruction_step_prerequisite_row.jade', key: 'instruction_step_prerequisite_row' },
        // ]);

        processCollection.find({}, {}, function(e, processList) {
            ingredientCollection.find({}, {}, function(e, ingredientList) {
                resourceCollection.find({}, {}, function(e, resourceList) {
                    app.render('process/instruction_step_row.jade', {layout: false}, function(err, instruction_step_row) {
                        app.render('ingredient/add_ingredient_row.jade', {layout: false}, function(err, add_ingredient_row) {
                            app.render('resource/add_resource_row.jade', {layout: false}, function(err, add_resource_row) {
                                app.render('process/add_instruction_step_prerequisite_row.jade', {layout: false}, function(err, add_instruction_step_prerequisite_row) {
                                    app.render('ingredient/ingredient_row.jade', {layout: false}, function(err, ingredient_row) {
                                        app.render('resource/resource_row.jade', {layout: false}, function(err, resource_row) {
                                            app.render('process/instruction_step_prerequisite_row.jade', {layout: false}, function(err, instruction_step_prerequisite_row) {

                                                var templates = {
                                                    instruction_step_row: {
                                                        html: instruction_step_row
                                                    },
                                                    add_ingredient_row : {
                                                        html: add_ingredient_row
                                                    },
                                                    add_resource_row : {
                                                        html: add_resource_row
                                                    },
                                                    add_instruction_step_prerequisite_row : {
                                                        html: add_instruction_step_prerequisite_row
                                                    },
                                                    ingredient_row : {
                                                        html: ingredient_row
                                                    },
                                                    resource_row : {
                                                        html: resource_row
                                                    },
                                                    instruction_step_prerequisite_row : {
                                                        html: instruction_step_prerequisite_row
                                                    },
                                                };
                                                
                                                var ret = {
                                                    jsParams : {
                                                        templates : templates,
                                                        availableProcessList : processList,
                                                        availableIngredientList : ingredientList,
                                                        availableResourceList : resourceList
                                                    },
                                                    availableProcessList : processList,
                                                    availableIngredientList : ingredientList,
                                                    availableResourceList : resourceList
                                                };
                                                
                                                callback(ret);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    };
    
    /**
     * loads all the needed templates // todo: find better solution for async loading
     */
    function loadTemplates(templates) {
        var ret = {};
        var loadedCount = 0;
        for (var i=0; i<templates.length; i++) {
            // app.render('process/instruction_step_prerequisite_row.jade', {layout: false}, function(err, instruction_step_prerequisite_row) {
            app.render(templates[i].file, {layout: false}, function(err, data) {
                ret[templates[i].key] = {
                    html : data
                };
                loadedCount++;
                if (loadedCount == templates.length) {
                    return ret;
                }
            });
        }
    }
    
    app.get('/recipes', function(req, res) {
        var q = req.query.q;
        
        var processCollection = db.get('process');
        
        if (q == 'ownkitchen') {
        }
        
        processCollection.find({}, {}, function(e, processList){
            res.render('process/process_list', {
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
            res.render('process/view_process', {
                "paramProcess" : process,
            });
        });
    });

    app.get('/kitchen/:slug', function(req, res) {
        var kitchenCollection = db.get('kitchen');
        
        kitchenCollection.findOne({'title': req.params.slug}, {}, function(e, kitchen){
            res.render('kitchen/view_kitchen', {
                "paramKitchen" : kitchen,
            });
        });
    });

    app.post('/addprocess', function(req, res) {
        var formData;
        var dbData = {};
        
        if (req.body !== undefined) {
            formData = req.body;
            
            dbData.slug = formData.title;
            dbData.title = formData.title;
            dbData.description = formData.description;
        } else {
            // todo: some error
        }
        
        // todo: validation, formatting

        var processCollection = db.get('process');

        processCollection.update({ title: dbData.title }, formData, {upsert: true}, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // And forward to success page
                res.redirect("recipe/" + dbData.title);
            }
        });

    });

    app.post('/addkitchen', function(req, res) {
        var formData;
        var dbData = {};
        
        if (req.body !== undefined) {
            formData = req.body;
            
            dbData.slug = formData.title;
            dbData.title = formData.title;
            dbData.description = formData.description;
        } else {
            // todo: some error
        }
        
        // todo: validation, formatting

        var processCollection = db.get('kitchen');

        processCollection.update({ title: dbData.title }, formData, {upsert: true}, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // And forward to success page
                res.redirect("kitchen/" + dbData.title);
            }
        });

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

        var entity = {
            id : title,
            title : title,
            description : description
        };
        
        collection.insert(entity, function (err, doc) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // http://stackoverflow.com/questions/18065812/render-view-into-a-variable-in-expressjs-for-ajax-response
                app.render('process/ingredient_box', {object: doc, layout: false}, function(err, html){
                    var response = {
                        result: 1,
                        entity: entity,
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
                app.render('process/resource_box', {object: doc, layout: false}, function(err, html){
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
