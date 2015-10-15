module.exports = function(app, db, upload, easyimage) {

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
                app.render('ingredient/ingredient_box', {object: doc, layout: false}, function(err, html){
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

};
