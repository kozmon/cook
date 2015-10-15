module.exports = function(app, db, upload, easyimage) {

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
    
    app.get('/kitchen/:slug', function(req, res) {
        var kitchenCollection = db.get('kitchen');
        
        kitchenCollection.findOne({'title': req.params.slug}, {}, function(e, kitchen){
            res.render('kitchen/view_kitchen', {
                "paramKitchen" : kitchen
            });
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

};
