$(document).ready(function() {
});

function addResource() {
    var data = {
        title : $('form.new-resource input[name="title"]').val(),
        description : $('form.new-resource input[name="description"]').val()
    };

    $.ajax({
        url: "/addresource",
        type : "POST",
        dataType: "json",
        data: data,
        success: function(res) {
            $('form.new-resource input.title').val('');
            $('form.new-resource input.description').val('');
            
            $('ul.available-resource-list').append($('<li></li>').append($(res.html).draggable({
                appendTo: "body",
                helper: "clone"
            })));
        }
    });
}

