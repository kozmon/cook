module.exports = function(app, db, upload, easyimage) {

    /* GET home page. */
    app.get('/', function(req, res, next) {
      res.render('index', { title: 'PaloFcooK' });
    });

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
    
};
