var ResourceContainer = function() {
    
};

ResourceContainer.availableResourceList = [];

ResourceContainer.initFields = function() {
    $( "div.available-resource" ).draggable({
        appendTo: "body",
        helper: "clone"
    });
 
    $('form.new-resource input.submit').on('click', function() {
        ResourceContainer.save($('form.new-resource'));
    });
    
    /* adds a resource from the resource list to the selected resources */
    $( "div.add-instruction-step div.resource-list" ).droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ".available-resource",
        drop: function( event, ui ) {
            var data = {
                id : ui.draggable.attr('data-id'),
                title : ui.draggable.attr('data-title'),
                amount: '',
                unit: '',
                comment: '',
                optional: false
            };
            
            ResourceContainer.addRowToList('add_resource_row', $(this).find('ul'), data).find('input.amount').focus();
        }
    });
    
    $( "div.add-instruction-step div.resource-list ul" ).sortable({
        items: "li:not(.placeholder)",
        sort: function() {
            $( this ).removeClass( "ui-state-default" );
        }
    });

    ResourceContainer.setAutocompleteField($('.resource-list input.add-resource'));
}

/**
 * saves and resource (ajax)
 */
ResourceContainer.save = function(form) {

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

            ResourceContainer.availableResourceList.push({
                value: res.entity.title,
                title: res.entity.title,
                id: res.entity.id
            });

            $('.resource-list input.add-resource').autocomplete({
                source: ResourceContainer.availableResourceList
            });
            
            $('ul.available-resource-list').append($('<li></li>').append($(res.html).draggable({
                appendTo: "body",
                helper: "clone"
            })));
        }
    });
};

/**
 * creates and fills an editable row to an resourcelist
 */
ResourceContainer.addEditableRowToList = function(list, data) {
    var lastId = parseInt($(list).attr('data-last-id'));

    // adds border to all elements except the newly inserted one
    $(list).find('li').addClass('border-bottom');
    var li = $( "<li></li>" ).appendTo($(list));
    $(params.templates['add_resource_row'].html).appendTo(li);
    
    // if data is set => fill the fields
    if (data) {
        $(li).find('input.id').val(data.id);
        $(li).find('span.title').html(data.title);
        $(li).find('input.amount').val(data.amount);
        $(li).find('input.unit').val(data.unit);
        $(li).find('input.comment').val(data.comment);
        
        $(li).find('label.optional').attr('for', 'selected-resource-' + $(li).index() + '-' + data.id);
        $(li).find('input.optional').attr('id', 'selected-resource-' + $(li).index() + '-' + data.id);

        if (data.optional === 'true') {
            $(li).find('input.optional').prop('checked', 'checked');
        }

        $(li).find('input.id').attr('name', 'resource[' + lastId + '][id]').val(data.id);
        $(li).find('input.title').attr('name', 'resource[' + lastId + '][title]').val(data.title);
        $(li).find('input.amount').attr('name', 'resource[' + lastId + '][amount]').val(data.amount);
        $(li).find('input.unit').attr('name', 'resource[' + lastId + '][unit]').val(data.unit);
        $(li).find('input.comment').attr('name', 'resource[' + lastId + '][comment]').val(data.comment);
        $(li).find('input.optional').attr('name', 'resource[' + lastId + '][optional]').val(data.optional);
    }

    $(li).find('.delete').on('click', function() {
        $(li).remove();
    });
    
    $(list).attr('data-last-id', lastId + 1);

    return li;
};

/**
 * creates and fills a static (display only) row to an resourcelist
 */
ResourceContainer.addStaticRowToList = function(list, data, stepId) {
    var lastId = parseInt($(list).attr('data-last-id'));

    $(list).find('li').addClass('border-bottom');
    var li = $('<li></li>').appendTo($(list)).append($(params.templates['resource_row'].html));
    // $(params.templates['resource_row'].html).appendTo(li);

    if (data) {
        $(li).find('span.title').html(data.title);
        $(li).find('span.amount').html(data.amount);
        $(li).find('span.unit').html(data.unit);
        $(li).find('span.comment').html(data.comment);
        
        // sets data for form posts
        if (stepId !== undefined) {
            $(li).find('input.id').attr('name', 'step[' + stepId + '][resource][' + lastId + '][id]').val(data.id);
            $(li).find('input.title').attr('name', 'step[' + stepId + '][resource][' + lastId + '][title]').val(data.title);
            $(li).find('input.amount').attr('name', 'step[' + stepId + '][resource][' + lastId + '][amount]').val(data.amount);
            $(li).find('input.unit').attr('name', 'step[' + stepId + '][resource][' + lastId + '][unit]').val(data.unit);
            $(li).find('input.comment').attr('name', 'step[' + stepId + '][resource][' + lastId + '][comment]').val(data.comment);
            $(li).find('input.optional').attr('name', 'step[' + stepId + '][resource][' + lastId + '][optional]').val(data.optional);
        }
    }
    
    $(list).attr('data-last-id', lastId + 1);

    return li;
};

/**
 * inits autocomplete source
 */
ResourceContainer.initAvailableResourceAutocompleteSource = function(source) {

    for (var i=0;i<source.length;i++) {
        ResourceContainer.availableResourceList.push({
            value: source[i].title,
            label: source[i].title,
            id: source[i].id
        });
    }

};

ResourceContainer.setAutocompleteField = function(field) {
        
    $(field).autocomplete({
        source: ResourceContainer.availableResourceList,
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

            ResourceContainer.addEditableRowToList($('div.resource-list ul'), data).find('input.amount').focus();
            
            $(this).val('');
        }
    });

};

