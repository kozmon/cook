module.exports = function(app, db, upload, easyimage) {

    /**
     * saving a resource to the db
     */
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
                app.render('resource/resource_box', {object: doc, layout: false}, function(err, html){
                    var response = {
                        result: 1,
                        html: html
                    };
                    res.send(response);
                });
            }
        });
    });

    /**
     * wtf...?
     */
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

    /**
     * wtf...?
     */
    app.get('/resourcelist', function(req, res) {
        //var db = req.db;
        var text = req.query.q;
        var resourceCollection = db.get('resource');
        
        resourceCollection.find({ 'name': {$regex : ".*" + text + ".*"} },{},function(e,docs){
            res.json(docs);
        });
    });

};
