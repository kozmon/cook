module.exports = function(app, db, upload, easyimage) {

    /**
     * list processes
     */
    app.get('/recipes', function(req, res) {
        console.log('iss', req.query.qi);
        
        var kitchenCollection = db.get('kitchen');
        var processCollection = db.get('process');
        var query = {};
    
        processCollection.find(query, {}, function(e, processList) {
            res.render('process/process_list', {
                "processList" : processList
            });
        });
            
    });

    /**
     * view process
     */
    app.get('/recipe/:slug', function(req, res) {
        var processCollection = db.get('process');
        
        processCollection.findOne({'title': req.params.slug}, {}, function(e, process){
            res.render('process/view_process', {
                "paramProcess" : process,
            });
        });
    });

    /**
     * new process
     */
    app.get('/newrecipe', function(req, res) {
        collectProcessData(function(data) {
            res.render('process/edit_process', data);
        });
    });

    /**
     * -> new process
     */
    app.get('/editrecipe', function(req, res) {
        res.redirect("newrecipe");
    });
    
    /**
     * edit process
     */
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

    /**
     * collects data for process view/edit
     */
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
     * insert process
     */
    app.post('/addprocess', function(req, res) {
        var formData;
        var dbData = {};
        
        if (req.body !== undefined) {
            formData = req.body;
            // todo: collect fields correctly
            dbData = formData;
            dbData.slug = formData.title;

            // saving a variable with the sum amount of all ingredients (collected from instruction steps)
            dbData.ingredientAmounts = {};
            for (var i=0;i<formData.step.length;i++) {
                for (var j=0;j<formData.step[i].ingredient.length;j++) {
                    if (dbData.ingredientAmounts[formData.step[i].ingredient[j].title]) {
                        dbData.ingredientAmounts[formData.step[i].ingredient[j].title] += parseInt(formData.step[i].ingredient[j].amount);
                    } else {
                        dbData.ingredientAmounts[formData.step[i].ingredient[j].title] = parseInt(formData.step[i].ingredient[j].amount);
                    }
                }
            }

            // saving a variable with the sum amount of all resources (collected from instruction steps)
            dbData.resourceAmounts = {};
            for (var i=0;i<formData.step.length;i++) {
                for (var j=0;j<formData.step[i].resource.length;j++) {
                    if (dbData.resourceAmounts[formData.step[i].resource[j].title]) {
                        dbData.resourceAmounts[formData.step[i].resource[j].title] += parseInt(formData.step[i].resource[j].amount);
                    } else {
                        dbData.resourceAmounts[formData.step[i].resource[j].title] = parseInt(formData.step[i].resource[j].amount);
                    }
                }
            }

        } else {
            // todo: some error
        }
        
        // todo: validation, formatting

        var processCollection = db.get('process');

        processCollection.update({ title: dbData.title }, dbData, {upsert: true}, function (err, doc) {
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


};
