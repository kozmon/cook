var IngredientContainer = function() {
    
};

IngredientContainer.availableIngredientList = [];

IngredientContainer.initFields = function() {
    $( "div.available-ingredient" ).draggable({
        appendTo: "body",
        helper: "clone"
    });
 
    $('form.new-ingredient input.submit').on('click', function() {
        IngredientContainer.save($('form.new-ingredient'));
    });
            
    /* adds an ingredient from the ingredient list to the selected ingredients */
    $( "div.add-instruction-step div.ingredient-list" ).droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ".available-ingredient",
        drop: function( event, ui ) {
            var data = {
                id : ui.draggable.attr('data-id'),
                title : ui.draggable.attr('data-title'),
                amount: '',
                unit: '',
                comment: '',
                optional: false
            };
            
            IngredientContainer.addRowToList('add_ingredient_row', $(this).find('ul'), data).find('input.amount').focus();
        }
    });
    
    $( "div.add-instruction-step div.ingredient-list ul" ).sortable({
        items: "li:not(.placeholder)",
        sort: function() {
            $( this ).removeClass( "ui-state-default" );
        }
    });

    // $( "div.selected-ingredients ul, div.instruction-step-ingredients ul" ).sortable({
        // items: "li:not(.placeholder)",
        // sort: function() {
            // $( this ).removeClass( "ui-state-default" );
        // }
    // });
    
    IngredientContainer.setAutocompleteField($('.ingredient-list input.add-ingredient'));

}

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
 * creates and fills an editable row to an ingredientlist
 */
IngredientContainer.addEditableRowToList = function(list, data) {
    // adds border to all elements except the newly inserted one
    $(list).find('li').addClass('border-bottom');
    var li = $( "<li></li>" ).appendTo($(list));
    $(params.templates['add_ingredient_row'].html).appendTo(li);
    
    // if data is set => fill the fields
    if (data) {
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
    }

    $(li).find('.delete').on('click', function() {
        $(li).remove();
    });
    
    return li;
};

/**
 * creates and fills a static (display only) row to an ingredientlist
 */
IngredientContainer.addStaticRowToList = function(list, data, stepId) {
    console.log('data', data);
    console.log('step', stepId);

    var lastId = parseInt($(list).attr('data-last-id'));

    $(list).find('li').addClass('border-bottom');
    var li = $('<li></li>').appendTo($(list)).append($(params.templates['ingredient_row'].html));
    // $(params.templates['ingredient_row'].html).appendTo(li);

    $(li).find('span.title').html(data.title);
    $(li).find('span.amount').html(data.amount);
    $(li).find('span.unit').html(data.unit);
    $(li).find('span.comment').html(data.comment);
    
    // sets data for form posts
    if (stepId !== undefined) {
        $(li).find('input.id').attr('name', 'step[' + stepId + '][ingredient][' + lastId + '][id]').val(data.id);
        $(li).find('input.title').attr('name', 'step[' + stepId + '][ingredient][' + lastId + '][title]').val(data.title);
        $(li).find('input.amount').attr('name', 'step[' + stepId + '][ingredient][' + lastId + '][amount]').val(data.amount);
        $(li).find('input.unit').attr('name', 'step[' + stepId + '][ingredient][' + lastId + '][unit]').val(data.unit);
        $(li).find('input.comment').attr('name', 'step[' + stepId + '][ingredient][' + lastId + '][comment]').val(data.comment);
        $(li).find('input.optional').attr('name', 'step[' + stepId + '][ingredient][' + lastId + '][optional]').val(data.optional);
    }
    
    $(list).attr('data-last-id', lastId + 1);

    return li;
};

/**
 * inits autocomplete source
 */
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

            IngredientContainer.addEditableRowToList($('div.ingredient-list ul'), data).find('input.amount').focus();
            
            $(this).val('');
        }
    });

};

