$(document).ready(function() {
});

function addIngredient() {
    var data = {
        title : $('form.new-ingredient input[name="title"]').val(),
        description : $('form.new-ingredient input[name="description"]').val()
    };

    $.ajax({
        url: "/addingredient",
        type : "POST",
        dataType: "json",
        data: data,
        success: function(res) {
            $('form.new-ingredient input.title').val('');
            $('form.new-ingredient input.description').val('');

            availableIngredientList.push({
                value: res.entity.title,
                title: res.entity.title,
                id: res.entity.id
            });

            $('.ingredient-list input.add-ingredient').autocomplete({
                source: availableIngredientList
            });
            
            $('ul.available-ingredient-list').append($('<li></li>').append($(res.html).draggable({
                appendTo: "body",
                helper: "clone"
            })));
        }
    });
}

