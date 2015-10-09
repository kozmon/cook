var IngredientContainer = function() {
    
};

IngredientContainer.availableIngredientList = [];

/**
 * saves and ingredient (ajax)
 */
IngredientContainer.save = function(form) {

    var data = {
        title : $(form).find('input[name="title"]').val(),
        description : $(form).find('input[name="description"]').val()
    };

    $.ajax({
        url: $(form).attr('action'),
        type : "POST",
        dataType: "json",
        data: data,
        success: function(res) {
            $(form).find('input.title').val('');
            $(form).find('input.description').val('');

            IngredientContainer.availableIngredientList.push({
                value: res.entity.title,
                title: res.entity.title,
                id: res.entity.id
            });

            $('.ingredient-list input.add-ingredient').autocomplete({
                source: IngredientContainer.availableIngredientList
            });
            
            $('ul.available-ingredient-list').append($('<li></li>').append($(res.html).draggable({
                appendTo: "body",
                helper: "clone"
            })));
        }
    });
};

/**
 * creates and fills a row in ingredientlist
 */
IngredientContainer.addRowToList = function(templateId, list, data) {
    $(list).find('li').addClass('border-bottom');
    var li = $( "<li></li>" ).appendTo($(list));
    $(params.templates[templateId].html).appendTo(li);
    $(li).find('span.title').html(data.title);
    $(li).find('input.id').val(data.id);
    $(li).find('input.amount').val(data.amount);
    $(li).find('input.unit').val(data.unit);
    $(li).find('input.comment').val(data.comment);
    
    $(li).find('label.optional').attr('for', 'selected-ingredient-' + $(li).index() + '-' + data.id);
    $(li).find('input.optional').attr('id', 'selected-ingredient-' + $(li).index() + '-' + data.id);

    if (data.optional === 'true') {
        $(li).find('input.optional').prop('checked', 'checked');
    }
    
    return li;
};

IngredientContainer.initAvailableIngredientAutocompleteSource = function(source) {

    for (var i=0;i<source.length;i++) {
        IngredientContainer.availableIngredientList.push({
            value: source[i].title,
            label: source[i].title,
            id: source[i].id
        });
    }

};

IngredientContainer.setAutocompleteField = function(field) {
        
    $(field).autocomplete({
        source: IngredientContainer.availableIngredientList,
        minLength: 1,
        select: function(event, ui) {
            event.preventDefault();
        
            var data = {
                id : ui.item.id,
                title : ui.item.label,
                amount: '',
                unit: '',
                comment: '',
                optional: false
            };
            
            IngredientContainer.addRowToList('add_instruction_step_ingredient_row', $('div.add-instruction-step div.ingredient-list ul'), data).find('input.amount').focus();
            
            $(this).val('');
        }
    });

};

