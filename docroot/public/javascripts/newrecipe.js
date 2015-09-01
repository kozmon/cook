$(document).ready(function() {

    $( "ul.available-resource-list li" ).draggable({
        appendTo: "body",
        helper: "clone"
    });
    
    $( "ul.available-ingredient-list li" ).draggable({
        appendTo: "body",
        helper: "clone"
    });
 
    $('.instruction-step-list').sortable({
        revert: true
    });
    
    $('div.add-instruction-step').find('div.instruction-step-controls input.save').on('click', function() {
        var form = $('div.add-instruction-step');
        copyInstructionStepDataToList(form, $('ul.instruction-step-list'), $(form).find('input[name="loaded-instruction-step"]').val());
        emptyInstructionStepForm(form);
        
        $(form).find('div.instruction-step-controls input.submit').removeClass('hidden');
        $(form).find('div.instruction-step-controls input.save').addClass('hidden');
        $(form).find('div.instruction-step-controls input.cancel').addClass('hidden');
    });
    
    $('div.add-instruction-step').find('div.instruction-step-controls input.cancel').on('click', function() {
        var form = $('div.add-instruction-step');
        emptyInstructionStepForm(form);
        
        $(form).find('div.instruction-step-controls input.submit').removeClass('hidden');
        $(form).find('div.instruction-step-controls input.save').addClass('hidden');
        $(form).find('div.instruction-step-controls input.cancel').addClass('hidden');
    });
    
    $( ".input-add-resource" ).on( "enter", function() {
        $('.new-resource').show();
    });
    
    $( ".input-add-ingredient" ).on( "enter", function() {
        $('.new-ingredient').show();
    });
    
    $( ".instruction-step-ingredients .input-add-ingredient" ).on("click", function() {
        $('.new-ingredient').show();
    });
  
    $( ".instruction-step-resources .input-add-resource" ).on("click", function() {
        $('.new-resource').show();
    });
  
    /* submit the new instruction step form */
    $( ".add-instruction-step input.submit" ).on( "click", function(e) {
        var rowId = createInstructionStepListRow($('ul.instruction-step-list'));
        copyInstructionStepDataToList($('div.add-instruction-step'), $('ul.instruction-step-list'), rowId);
        emptyInstructionStepForm($('div.add-instruction-step'));
    });
    
    /* adds an ingredient from the ingredient list to the selected ingredients */
    $( "div.selected-ingredients pre, div.instruction-step-ingredients pre" ).droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ".available-ingredient",
        drop: function( event, ui ) {
            var data = {
                id : ui.draggable.attr('data-id'),
                text : ui.draggable.attr('data-name'),
                amount: '',
                unit: '',
                comment: '',
                optional: false
            };
            
            addIngredientRowToInstructionStepForm($(this).find('ul'), data);
        }
    });
    
    $( "div.selected-ingredients ul, div.instruction-step-ingredients ul" ).sortable({
        items: "li:not(.placeholder)",
        sort: function() {
            $( this ).removeClass( "ui-state-default" );
        }
    });
    
    /* adds a resource from the resource list to the selected resources */
    $( "div.selected-resources pre, div.instruction-step-resources pre" ).droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ".available-resource",
        drop: function( event, ui ) {
            var data = {
                id : ui.draggable.attr('data-id'),
                text : ui.draggable.attr('data-name'),
                amount: '',
                unit: '',
                comment: '',
                optional: false
            };
            
            addResourceRowToInstructionStepForm($(this).find('ul'), data);
        }
    });
    
    $( "div.selected-resources ul, div.instruction-step-resources ul" ).sortable({
        items: "li:not(.placeholder)",
        sort: function() {
            $( this ).removeClass( "ui-state-default" );
        }
    });

    // loads instruction step form from list
    $( "div.add-instruction-step" ).droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ".instruction-step",
        drop: function( event, ui ) {
            var form = this;
            
            emptyInstructionStepForm(form);
            fillFormFromInstructionStep(form, ui.draggable);
            
            $(form).find('div.instruction-step-controls input.submit').addClass('hidden');
            $(form).find('div.instruction-step-controls input.save').removeClass('hidden');
            $(form).find('div.instruction-step-controls input.cancel').removeClass('hidden');
        }
    });
    
    $('input.submit-add-recipe').on('click', function() {
        submitRecipeForm();
    });
});

/**
 * creates a new empty row in the instruction step list
 * 
 * returns: id of the inserted row
 */
function createInstructionStepListRow(list) {
    // get and set the id of the last inserted row
    var lastId = parseInt($(list).find('input.lastId').val()) + 1;
    $(list).find('input.lastId').val(lastId);
    
    var li = $('<li class="instruction-step list-group-item" data-id="' + lastId + '"></li>').appendTo($(list));
    
    // add hidden fields to store the data
    $(li).append('<input type="hidden" class="index" name="instruction-step-index[' + lastId + ']" value="" />');
    $(li).append('<input type="hidden" class="text" name="instruction-step-text[' + lastId + ']" value="" />');
    $(li).append('<input type="hidden" class="duration" name="instruction-step-duration[' + lastId + ']" value="" />');
    $(li).append('<input type="hidden" class="attendance-rate" name="instruction-step-attendance-rate[' + lastId + ']" value="" />');

    var row = $('<div class="row"></div>').appendTo($(li).draggable({
        appendTo: "body",
        helper: "clone",
        handle: "div.move-box"
    }));

    $('<div class="col-md-1 move-box">').appendTo(row).append('<p>M</p>');
    $('<div class="col-md-2">').appendTo(row).append('<p><span class="text"></span></p>');
    $('<div class="col-md-1">').appendTo(row).append('<span class="attendance-rate"></span>');
    var listContainer = $('<div class="col-md-7">').appendTo(row);
    $('<div class="col-md-1">').appendTo(row).append('<input type="button" class="remove form-control icon delete" value="" />').on("click", function() {
        $(li).remove();
    });

    // todo: lastId-s here
    var ingredientList = $('<ul class="ingredient-list"></ul>').appendTo($('<div class="col-md-12"></div>').append('<input type="hidden" class="last-ingredient-id" value="" />').appendTo($('<div class="row"></div>').appendTo(listContainer)));
    var resourceList = $('<ul class="resource-list"></ul>').appendTo($('<div class="col-md-12"></div>').append('<input type="hidden" class="last-resource-id" value="" />').appendTo($('<div class="row"></div>').appendTo(listContainer)));
    
    $(list).sortable("refresh");
    
    return lastId;
}

/**
 * fills a row in the instruction step list with the data from the form
 * 
 * returns: id of the inserted row
 */
function copyInstructionStepDataToList(form, list, rowId) {
    var data = {
        text: $(form).find('textarea[name=text]').val(),
        duration: $(form).find('input[name=duration]').val(),
        attendanceRate: $(form).find('input[name=attendance-rate]').val()
    };

    var li = $(list).find('li[data-id="' + rowId + '"]');
    
    $(li).find('input.text').val(data.text);
    $(li).find('input.duration').val(data.duration);
    $(li).find('input.attendance-rate').val(data.attendanceRate);

    var text = data.text + ' (' + data.duration + ' min)';
    if (data.attendanceRate) {
        text += ' ' + data.attendanceRate + '%';
    }
    
    $(li).find('span.text').html(text);
    
    // filling the resource and the ingredient list
    var ingredientList = $(li).find('ul.ingredient-list');    
    $(ingredientList).html('');
    
    $(form).find(".instruction-step-ingredients ul li:not(.placeholder)").each(function(key, element) {
        var ingredientData = {
            id: $(element).find('input.id').val(),
            text: $(element).find('span.text').html(),
            optional: $(element).find('input.optional').prop('checked'),
            amount: $(element).find('.amount').val(),
            unit: $(element).find('.unit').val(),
            comment: $(element).find('.comment').val()
        };
        var ingredientRow = $('<li></li>').appendTo($(ingredientList));
        var ingIndex = $(ingredientRow).index();
        
        var content = '';
        content += '<input type="hidden" class="index" value="' + ingIndex + '" />';
        content += '<input type="hidden" class="id" name="instruction-step-ingredient-id[' + rowId + '][' + ingIndex + ']" value="' + ingredientData.id + '" />';
        content += '<input type="hidden" class="text" name="instruction-step-ingredient-text[' + rowId + '][' + ingIndex + ']" value="' + ingredientData.text + '" />';
        content += '<input type="hidden" class="amount" name="instruction-step-ingredient-amount[' + rowId + '][' + ingIndex + ']" value="' + ingredientData.amount + '" />';
        content += '<input type="hidden" class="unit" name="instruction-step-ingredient-unit[' + rowId + '][' + ingIndex + ']" value="' + ingredientData.unit + '" />';
        content += '<input type="hidden" class="comment" name="instruction-step-ingredient-comment[' + rowId + '][' + ingIndex + ']" value="' + ingredientData.comment + '" />';
        content += '<input type="hidden" class="optional" name="instruction-step-ingredient-optional[' + rowId + '][' + ingIndex + ']" value="' + ingredientData.optional + '" />';
        
        content += '<span class="amount">' + ingredientData.amount + '</span> ';
        content += '<span class="unit">' + ingredientData.unit + '</span> of ';
        content += '<span class="text">' + ingredientData.text + '</span>';
        if (ingredientData.comment) {
            content += '<span class="comment"> (' + ingredientData.comment + ')</span>';
        }
        
        $(ingredientRow).append(content);
    });
    
    // ... the resources    
    var resourceList = $(li).find('ul.resource-list');
    $(resourceList).html('');
    
    $(form).find(".instruction-step-resources ul li:not(.placeholder)").each(function(key, element) {
        var resourceData = {
            id: $(element).find('input.id').val(),
            text: $(element).find('span.text').html(),
            optional: $(element).find('input.optional').prop('checked'),
            amount: $(element).find('.amount').val(),
            unit: $(element).find('.unit').val(),
            comment: $(element).find('.comment').val()
        };
        var resourceRow = $('<li></li>').appendTo($(resourceList));
        var resIndex = $(resourceRow).index();
        
        var content = '';
        content += '<input type="hidden" class="index" value="' + resIndex + '" />';
        content += '<input type="hidden" class="id" name="instruction-step-resource-id[' + rowId + '][' + resIndex + ']" value="' + resourceData.id + '" />';
        content += '<input type="hidden" class="text" name="instruction-step-resource-text[' + rowId + '][' + resIndex + ']" value="' + resourceData.text + '" />';
        content += '<input type="hidden" class="amount" name="instruction-step-resource-amount[' + rowId + '][' + resIndex + ']" value="' + resourceData.amount + '" />';
        content += '<input type="hidden" class="unit" name="instruction-step-resource-unit[' + rowId + '][' + resIndex + ']" value="' + resourceData.unit + '" />';
        content += '<input type="hidden" class="comment" name="instruction-step-resource-comment[' + rowId + '][' + resIndex + ']" value="' + resourceData.comment + '" />';
        content += '<input type="hidden" class="optional" name="instruction-step-resource-optional[' + rowId + '][' + resIndex + ']" value="' + resourceData.optional + '" />';
        
        content += '<span class="amount">' + resourceData.amount + '</span> ';
        content += '<span class="unit">' + resourceData.unit + '</span> of ';
        content += '<span class="text">' + resourceData.text + '</span>';
        if (resourceData.comment) {
            content += '<span class="comment"> (' + resourceData.comment + ')</span>';
        }
        
        $(resourceRow).append(content);
    });
    
}

/**
 * creates and fills a row in the instruction step form's resourcelist
 */
function addResourceRowToInstructionStepForm(list, data) {
    $(list).find('li').addClass('border-bottom');
    var li = $( "<li></li>" ).appendTo($(list));

    var optionalValue = ' ';
    if (data.optional) {
        optionalValue = 'checked="checked"' + optionalValue;
    }
    
    var rowTop = $( "<div class='row short'></div>" ).appendTo($(li));
    $('<div class="col-md-6 col-xs-12"></div>').append($('<span class="text" ></span>').append(data.text)).appendTo(rowTop);
    $('<div class="col-md-3 col-xs-12"></div>').append('<label for="selected-resource-' + $(li).index() + '-' + data.id + '">optional</label><input type="checkbox" class="optional checkbox-inline" id="selected-resource-' + ($(li).index()) + '-' + data.id + '" ' + optionalValue + '/>' ).appendTo(rowTop);
    $('<div class="col-md-3 col-xs-12"></div>').append('<input type="button" class="icon delete btn btn-default btn-xs" value="" />' ).appendTo(rowTop).on("click", function() {
        $(li).remove();
    });
    
    var row = $( '<div class="row short"></div>' ).appendTo($(li));

    $('<div class="col-md-4"></div>').append( '<input type="text" class="amount form-control" placeholder="amount" value="' + data.amount + '" />' ).appendTo(row);
    $('<div class="col-md-4"></div>').append( '<input type="text" class="unit form-control" placeholder="unit" value="' + data.unit + '" />' ).appendTo(row);
    $('<div class="col-md-4"></div>').append( '<input type="text" class="comment form-control" placeholder="comment" value="' + data.comment + '" />' ).appendTo(row);
    
    $(li).append('<input type="hidden" class="id" value="' + data.id + '" />');
}

/**
 * creates and fills a row in the instruction step form's ingredientlist
 */
function addIngredientRowToInstructionStepForm(list, data) {
    $(list).find('li').addClass('border-bottom');
    var li = $( "<li></li>" ).appendTo($(list));

    var optionalValue = ' ';
    if (data.optional) {
        optionalValue = 'checked="checked"' + optionalValue;
    }
    
    var rowTop = $( "<div class='row short'></div>" ).appendTo($(li));
    $('<div class="col-md-6 col-xs-12"></div>').append($('<span class="text" ></span>').append(data.text)).appendTo(rowTop);
    $('<div class="col-md-3 col-xs-12"></div>').append('<label for="selected-ingredient-' + $(li).index() + '-' + data.id + '">optional</label><input type="checkbox" class="optional checkbox-inline" id="selected-ingredient-' + ($(li).index()) + '-' + data.id + '" ' + optionalValue + '/>' ).appendTo(rowTop);
    $('<div class="col-md-3 col-xs-12"></div>').append('<input type="button" class="icon delete btn btn-default btn-xs" value="" />' ).appendTo(rowTop).on("click", function() {
        $(li).remove();
    });
    
    var row = $( '<div class="row short"></div>' ).appendTo($(li));

    $('<div class="col-md-4"></div>').append( '<input type="text" class="amount form-control" placeholder="amount" value="' + data.amount + '" />' ).appendTo(row);
    $('<div class="col-md-4"></div>').append( '<input type="text" class="unit form-control" placeholder="unit" value="' + data.unit + '" />' ).appendTo(row);
    $('<div class="col-md-4"></div>').append( '<input type="text" class="comment form-control" placeholder="comment" value="' + data.comment + '" />' ).appendTo(row);
    
    $(li).append('<input type="hidden" class="id" value="' + data.id + '" />');
}

/**
 * empty the form fields
 */
function emptyInstructionStepForm(form) {
    $(form).find('textarea[name=text]').val('');
    $(form).find('input[name=duration]').val('');
    $(form).find('input[name=attendance-rate]').val('');
    
    $(form).find('div.instruction-step-ingredients ul').html('');
    $(form).find('div.instruction-step-resources ul').html('');
}

/**
 * copy data from a list row to the instruction step form's fields
 */
function fillFormFromInstructionStep(form, li) {
    $(form).find('input[name="loaded-instruction-step"]').val($(li).attr('data-id'));
    $(form).find('textarea[name="text"]').val($(li).find('input.text').val());
    $(form).find('input[name="duration"]').val($(li).find('input.duration').val());
    $(form).find('input[name="attendance-rate"]').val($(li).find('input.attendance-rate').val());
        
    $(li).find('ul.resource-list li').each(function() {
        var data = {
            id : $(this).find('input.id').val(),
            text : $(this).find('input.text').val(),
            amount: $(this).find('input.amount').val(),
            unit: $(this).find('input.unit').val(),
            comment: $(this).find('input.comment').val(),
            optional: $(this).find('input.optional').val()
        };
        addResourceRowToInstructionStepForm($(form).find('div.instruction-step-resources ul'), data);
    });
    
    $(li).find('ul.ingredient-list li').each(function() {
        var data = {
            id : $(this).find('input.id').val(),
            text : $(this).find('input.text').val(),
            amount: $(this).find('input.amount').val(),
            unit: $(this).find('input.unit').val(),
            comment: $(this).find('input.comment').val(),
            optional: $(this).find('input.optional').val()
        };
        addIngredientRowToInstructionStepForm($(form).find('div.instruction-step-ingredients ul'), data);
    });
    
}

function submitRecipeForm() {
    
}

/*    
    $( ".form-instruction-step .input-add-resource" ).autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: "/resourcelist",
                dataType: "jsonp",
                data: {
                    q: request.term
                },
                success: function( data ) {
                    response(data);
                }
            });
        },
        minLength: 2,
        select: function( event, ui ) {
            log( ui.item ? "Selected: " + ui.item.label : "Nothing selected, input was " + this.value);
        },
        open: function() {
            $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
        },
        close: function() {
            $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        }
    });
*/

