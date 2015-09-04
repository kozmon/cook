$(document).ready(function() {

    $( "li.available-resource" ).draggable({
        appendTo: "body",
        helper: "clone"
    });
    
    $( "li.available-ingredient" ).draggable({
        appendTo: "body",
        helper: "clone"
    });
 
    $('.instruction-step-list').sortable({
        revert: true
    });
    
    $('div.add-instruction-step').find('div.controls input.save').on('click', function() {
        var form = $('div.add-instruction-step');
        copyInstructionStepDataToList(form, $('div.instruction-step-list ul.instruction-step-list'), $(form).find('input.loaded-instruction-step').val());
        emptyInstructionStepForm(form);
        
        $(form).find('div.controls input.submit').removeClass('hidden');
        $(form).find('div.controls input.save').addClass('hidden');
        $(form).find('div.controls input.cancel').addClass('hidden');
    });
    
    $('div.add-instruction-step').find('div.controls input.cancel').on('click', function() {
        var form = $('div.add-instruction-step');
        emptyInstructionStepForm(form);
        
        $(form).find('div.controls input.submit').removeClass('hidden');
        $(form).find('div.controls input.save').addClass('hidden');
        $(form).find('div.controls input.cancel').addClass('hidden');
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
        var rowId = createInstructionStepListRow($('div.instruction-step-list ul.instruction-step-list'));
        copyInstructionStepDataToList($('div.add-instruction-step'), $('ul.instruction-step-list'), rowId);
        emptyInstructionStepForm($('div.add-instruction-step'));
    });
    
    /* adds an ingredient from the ingredient list to the selected ingredients */
    $( "div.add-instruction-step div.ingredient-list pre" ).droppable({
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
    $( "div.add-instruction-step div.resource-list pre" ).droppable({
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
    
    $( "div.add-instruction-step div.ingredient-list ul, div.add-instruction-step div.resource-list ul" ).sortable({
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
            
            $(form).find('div.controls input.submit').addClass('hidden');
            $(form).find('div.controls input.save').removeClass('hidden');
            $(form).find('div.controls input.cancel').removeClass('hidden');
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
    var lastId = parseInt($(list).attr('data-last-id')) + 1;
    $(list).attr('data-last-id', lastId);
    
    var li = $('<li class="instruction-step list-group-item" data-id="' + lastId + '"></li>').appendTo($(list));
    
    // add hidden fields to store the data
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

    var ingredientList = $('<ul class="ingredient-list" data-last-id="0" ></ul>').appendTo($('<div class="col-md-12"></div>').appendTo($('<div class="row"></div>').appendTo(listContainer)));
    var resourceList = $('<ul class="resource-list" data-last-id="0"></ul>').appendTo($('<div class="col-md-12"></div>').appendTo($('<div class="row"></div>').appendTo(listContainer)));
    
    $(list).sortable("refresh");
    
    return lastId;
}

/**
 * fills a row in the instruction step list with the data from the form
 * 
 * returns: id of the inserted row
 */
function copyInstructionStepDataToList(form, list, stepId) {
    // get the head data from the instruction step form
    var data = {
        text: $(form).find('textarea.text').val(),
        duration: $(form).find('input.duration').val(),
        attendanceRate: $(form).find('input.attendance-rate').val()
    };
console.log('copyInstructionStepDataToList', data);

    // finds the needed step from the list
    var li = $(list).find('li[data-id="' + stepId + '"]');
    
    // sets head data
    $(li).find('input.text').val(data.text);
    $(li).find('input.duration').val(data.duration);
    $(li).find('input.attendance-rate').val(data.attendanceRate);

    var text = data.text + ' (' + data.duration + ' min)';
    if (data.attendanceRate) {
        text += ' ' + data.attendanceRate + '%';
    }
    
    // displays head data
    $(li).find('span.text').html(text);
    
    // filling the resource and the ingredient list
    var ingredientList = $(li).find('ul.ingredient-list');
    $(ingredientList).html('');
    
    $(form).find("div.ingredient-list ul li:not(.placeholder)").each(function(key, element) {
        var ingredientData = {
            id: $(element).find('input.id').val(),
            text: $(element).find('span.text').html(),
            optional: $(element).find('input.optional').prop('checked'),
            amount: $(element).find('.amount').val(),
            unit: $(element).find('.unit').val(),
            comment: $(element).find('.comment').val()
        };
        
        addIngredientToInstructionStep(stepId, resourceList, ingredientData);
    });
    
    // ... the resources    
    var resourceList = $(li).find('ul.resource-list');
    $(resourceList).html('');
    $(form).find("div.resource-list li:not(.placeholder)").each(function(key, element) {
        // get the resource data from the form
        var resourceData = {
            id: $(element).find('input.id').val(),
            text: $(element).find('span.text').html(),
            optional: $(element).find('input.optional').prop('checked'),
            amount: $(element).find('.amount').val(),
            unit: $(element).find('.unit').val(),
            comment: $(element).find('.comment').val()
        };
        
        addResourceToInstructionStep(stepId, resourceList, resourceData);
    });
    
}

/**
 * adds a new resource list element to the requested instruction step
 */
function addResourceToInstructionStep(stepId, list, data) {
    var lastId = parseInt($(list).attr('data-last-id')) + 1;
    $(list).attr('data-last-id', lastId);
    
    var row = $('<li></li>').appendTo($(list));
    var content = '';
    content += '<input type="hidden" class="id" name="instruction-step-resource-id[' + stepId + '][' + lastId + ']" value="' + data.id + '" />';
    content += '<input type="hidden" class="text" name="instruction-step-resource-text[' + stepId + '][' + lastId + ']" value="' + data.text + '" />';
    content += '<input type="hidden" class="amount" name="instruction-step-resource-amount[' + stepId + '][' + lastId + ']" value="' + data.amount + '" />';
    content += '<input type="hidden" class="unit" name="instruction-step-resource-unit[' + stepId + '][' + lastId + ']" value="' + data.unit + '" />';
    content += '<input type="hidden" class="comment" name="instruction-step-resource-comment[' + stepId + '][' + lastId + ']" value="' + data.comment + '" />';
    content += '<input type="hidden" class="optional" name="instruction-step-resource-optional[' + stepId + '][' + lastId + ']" value="' + data.optional + '" />';
    
    content += '<span class="amount">' + data.amount + '</span> ';
    content += '<span class="unit">' + data.unit + '</span> of ';
    content += '<span class="text">' + data.text + '</span>';
    if (data.comment) {
        content += '<span class="comment"> (' + data.comment + ')</span>';
    }
    
    $(row).append(content);
    
    return row;
}

/**
 * adds a new ingredient list element to the requested instruction step
 */
function addIngredientToInstructionStep(stepId, list, data) {
    var lastId = parseInt($(list).attr('data-last-id')) + 1;
    $(list).attr('data-last-id', lastId);
    
    var row = $('<li></li>').appendTo($(list));
    var content = '';
    content += '<input type="hidden" class="id" name="instruction-step-ingredient-id[' + stepId + '][' + lastId + ']" value="' + data.id + '" />';
    content += '<input type="hidden" class="text" name="instruction-step-ingredient-text[' + stepId + '][' + lastId + ']" value="' + data.text + '" />';
    content += '<input type="hidden" class="amount" name="instruction-step-ingredient-amount[' + stepId + '][' + lastId + ']" value="' + data.amount + '" />';
    content += '<input type="hidden" class="unit" name="instruction-step-ingredient-unit[' + stepId + '][' + lastId + ']" value="' + data.unit + '" />';
    content += '<input type="hidden" class="comment" name="instruction-step-ingredient-comment[' + stepId + '][' + lastId + ']" value="' + data.comment + '" />';
    content += '<input type="hidden" class="optional" name="instruction-step-ingredient-optional[' + stepId + '][' + lastId + ']" value="' + data.optional + '" />';
    
    content += '<span class="amount">' + data.amount + '</span> ';
    content += '<span class="unit">' + data.unit + '</span> of ';
    content += '<span class="text">' + data.text + '</span>';
    if (data.comment) {
        content += '<span class="comment"> (' + data.comment + ')</span>';
    }
    
    $(row).append(content);
    
    return row;
}

/**
 * creates and fills a row in the instruction step form's resourcelist
 */
function addResourceRowToInstructionStepForm(list, data) {
    $(list).find('li').addClass('border-bottom');
    var li = $( "<li></li>" ).appendTo($(list));

    var optionalValue = ' ';
    if (data.optional === 'true') {
        optionalValue = 'checked="checked"' + optionalValue;
    }
    
    var rowTop = $( "<div class='row short'></div>" ).appendTo($(li));
    $('<div class="col-md-6 col-xs-12"></div>').append($('<span class="text" ></span>').append(data.text)).appendTo(rowTop);
    $('<div class="col-md-3 col-xs-12"></div>').append('<label for="selected-resource-' + $(li).index() + '-' + data.id + '">optional</label><input type="checkbox" class="optional checkbox-inline no-post" id="selected-resource-' + ($(li).index()) + '-' + data.id + '" ' + optionalValue + '/>' ).appendTo(rowTop);
    $('<div class="col-md-3 col-xs-12"></div>').append('<input type="button" class="icon delete btn btn-default btn-xs no-post" value="" />' ).appendTo(rowTop).on("click", function() {
        $(li).remove();
    });
    
    var row = $( '<div class="row short"></div>' ).appendTo($(li));

    $('<div class="col-md-4"></div>').append( '<input type="text" class="amount form-control no-post" placeholder="amount" value="' + data.amount + '" />' ).appendTo(row);
    $('<div class="col-md-4"></div>').append( '<input type="text" class="unit form-control no-post" placeholder="unit" value="' + data.unit + '" />' ).appendTo(row);
    $('<div class="col-md-4"></div>').append( '<input type="text" class="comment form-control no-post" placeholder="comment" value="' + data.comment + '" />' ).appendTo(row);
    
    $(li).append('<input type="hidden" class="id no-post" value="' + data.id + '" />');
}

/**
 * creates and fills a row in the instruction step form's ingredientlist
 */
function addIngredientRowToInstructionStepForm(list, data) {
    $(list).find('li').addClass('border-bottom');
    var li = $( "<li></li>" ).appendTo($(list));

    var optionalValue = ' ';
    if (data.optional === 'true') {
        optionalValue = 'checked="checked"' + optionalValue;
    }
    
    var rowTop = $( "<div class='row short'></div>" ).appendTo($(li));
    $('<div class="col-md-6 col-xs-12"></div>').append($('<span class="text" ></span>').append(data.text)).appendTo(rowTop);
    $('<div class="col-md-3 col-xs-12"></div>').append('<label for="selected-ingredient-' + $(li).index() + '-' + data.id + '">optional</label><input type="checkbox" class="optional checkbox-inline no-post" id="selected-ingredient-' + ($(li).index()) + '-' + data.id + '" ' + optionalValue + '/>' ).appendTo(rowTop);
    $('<div class="col-md-3 col-xs-12"></div>').append('<input type="button" class="icon delete btn btn-default btn-xs no-post" value="" />' ).appendTo(rowTop).on("click", function() {
        $(li).remove();
    });
    
    var row = $( '<div class="row short"></div>' ).appendTo($(li));

    $('<div class="col-md-4"></div>').append( '<input type="text" class="amount form-control no-post" placeholder="amount" value="' + data.amount + '" />' ).appendTo(row);
    $('<div class="col-md-4"></div>').append( '<input type="text" class="unit form-control no-post" placeholder="unit" value="' + data.unit + '" />' ).appendTo(row);
    $('<div class="col-md-4"></div>').append( '<input type="text" class="comment form-control no-post" placeholder="comment" value="' + data.comment + '" />' ).appendTo(row);
    
    $(li).append('<input type="hidden" class="id no-post" value="' + data.id + '" />');
}

/**
 * empty the form fields
 */
function emptyInstructionStepForm(form) {
    $(form).find('textarea.text').val('');
    $(form).find('input.duration').val('');
    $(form).find('input.attendance-rate').val('');
    
    $(form).find('div.ingredient-list ul').html('');
    $(form).find('div.resource-list ul').html('');
}

/**
 * copy data from a list row to the instruction step form's fields
 */
function fillFormFromInstructionStep(form, li) {
    $(form).find('input.loaded-instruction-step').val($(li).attr('data-id'));
    $(form).find('textarea.text').val($(li).find('input.text').val());
    $(form).find('input.duration').val($(li).find('input.duration').val());
    $(form).find('input.attendance-rate').val($(li).find('input.attendance-rate').val());
        
    $(li).find('ul.resource-list li').each(function() {
        var data = {
            id : $(this).find('input.id').val(),
            text : $(this).find('input.text').val(),
            amount: $(this).find('input.amount').val(),
            unit: $(this).find('input.unit').val(),
            comment: $(this).find('input.comment').val(),
            optional: $(this).find('input.optional').val()
        };
        addResourceRowToInstructionStepForm($(form).find('div.resource-list ul'), data);
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
        addIngredientRowToInstructionStepForm($(form).find('div.ingredient-list ul'), data);
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
