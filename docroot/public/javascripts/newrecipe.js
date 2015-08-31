var
    steps;

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
        var rowId = addInstructionStepListRow($('ul.instruction-step-list'));
        addInstructionStepToList($('div.add-instruction-step'), $('ul.instruction-step-list'), rowId);
        emptyInstructionStepForm($('div.add-instruction-step'));
    });
    
    /* adds an ingredient from the ingredient list to the selected ingredients */
    $( "div.selected-ingredients pre, div.instruction-step-ingredients pre" ).droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        //accept: ":not(.ui-sortable-helper), .ingredient-box",
        accept: ".available-ingredient",
        drop: function( event, ui ) {
            var li = $( "<li></li>" ).appendTo($(this).find('ul'));
            var row = $( "<div class='row'></div>" ).appendTo($(li));

            $('<div class="col-md-2"></div>').append( "<span class='text' >" + (ui.draggable.text()) + "</span>" ).appendTo(row);
            $('<div class="col-md-2"></div>').append( "<input type='text' class='amount form-control' placeholder='amount' />" ).appendTo(row);
            $('<div class="col-md-2"></div>').append( "<input type='text' class='unit form-control' placeholder='unit' />" ).appendTo(row);
            $('<div class="col-md-2"></div>').append( "<input type='text' class='comment form-control' placeholder='comment'/>" ).appendTo(row);
            $('<div class="col-md-2"></div>').append( "<label for='selected-ingredient-" + $(row).index() + "-" + ui.draggable.attr('data-id') + "'>optional</label><input type='checkbox' class='optional checkbox-inline' id='selected-ingredient-" + ($(row).index()) + "-" + (ui.draggable.attr('data-id')) + "' />" ).appendTo(row);
            $('<div class="col-md-2"></div>').append( "<input type='button' class='remove form-control icon delete' value='remove' />" ).appendTo(row).on("click", function() {
                $(li).remove();
            });
            
            $(li).append( "<input type='hidden' class='id' value='" + ui.draggable.attr('data-id') + "' />" );
            //$( '.input-ingredients' ).val($( '.input-ingredients' ).val() + ' ' + (ui.draggable.text()));
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
        //accept: ":not(.ui-sortable-helper), .ingredient-box",
        accept: ".available-resource",
        drop: function( event, ui ) {
            var data = {
                id : '',
                text : '',
                amount: '',
                unit: '',
                comment: ''
            };
            
            addResourceRowToInstructionStepForm($(this).find('ul'), data);
/*            
            $(this).find('ul li').addClass('border-bottom');
            var li = $( "<li></li>" ).appendTo($(this).find('ul'));
            
            var rowTop = $( "<div class='row short'></div>" ).appendTo($(li));
            $('<div class="col-md-6 col-xs-12"></div>').append( "<span class='text' >" + (ui.draggable.text()) + "</span>" ).appendTo(rowTop);
            $('<div class="col-md-3 col-xs-12"></div>').append( "<label for='selected-ingredient-" + $(li).index() + "-" + ui.draggable.attr('data-id') + "'>optional</label><input type='checkbox' class='optional checkbox-inline' id='selected-ingredient-" + ($(li).index()) + "-" + (ui.draggable.attr('data-id')) + "' />" ).appendTo(rowTop);
            $('<div class="col-md-3 col-xs-12"></div>').append( "<input type='button' class='remove btn btn-default btn-xs' value='x' />" ).appendTo(rowTop).on("click", function() {
                $(li).remove();
            });
            
            var row = $( "<div class='row short'></div>" ).appendTo($(li));

            $('<div class="col-md-4"></div>').append( "<input type='text' class='amount form-control' placeholder='amount' />" ).appendTo(row);
            $('<div class="col-md-4"></div>').append( "<input type='text' class='unit form-control' placeholder='unit' />" ).appendTo(row);
            $('<div class="col-md-4"></div>').append( "<input type='text' class='comment form-control' placeholder='comment'/>" ).appendTo(row);
            
            $(li).append( "<input type='hidden' class='id' value='" + ui.draggable.attr('data-id') + "' />" );
            //$( '.input-ingredients' ).val($( '.input-ingredients' ).val() + ' ' + (ui.draggable.text()));
*/
        }
    }).sortable({
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
            fillFormFromInstructionStep(form, ui.draggable);
/*            
            $(form).find('div.instruction-step-controls input.submit').show().on('click', function() {
                
            });

            $('<input type="button", class="form-control cancel", value="cancel" />').appendTo($(this).find('div.instruction-step-controls')).on('click', function() {
                emptyInstructionStepForm(that);
            });
*/
        }
    });
    
});

/**
 * creates a new empty row in the instruction step list
 * 
 * returns: id of the inserted row
 */
function addInstructionStepListRow(list) {
    // get and set the id of the last inserted row
    var lastId = parseInt($(list).find('input.lastId').val()) + 1;
    $(list).find('input.lastId').val(lastId);
    
    var li = $('<li class="instruction-step list-group-item" data-id="' + lastId + '"></li>').appendTo($(list));
    
    // add hidden fields to store the data
    $(li).append('<input type="hidden" class="text" value="" />');
    $(li).append('<input type="hidden" class="duration" value="" />');
    $(li).append('<input type="hidden" class="attendance-rate" value="" />');

    var row = $('<div class="row"></div>').appendTo($(li).draggable({
        appendTo: "body",
        helper: "clone",
        handle: "div.move-box"
    }));

    $('<div class="col-md-1 move-box">').appendTo(row).append('<p>M</p>');
    $('<div class="col-md-2">').appendTo(row).append('<p><span class="text"></span>(<span class="duration"></span>)</p>');
    $('<div class="col-md-1">').appendTo(row).append('<span class="attendance-rate"></span>');
    var listContainer = $('<div class="col-md-7">').appendTo(row);
    $('<div class="col-md-1">').appendTo(row).append('<input type="button" class="remove form-control icon delete" value="" />').on("click", function() {
        $(li).remove();
    });

    var ingredientList = $('<ul class="ingredient-list"></ul>').appendTo($('<div class="col-md-12"></div>').appendTo($('<div class="row"></div>').appendTo(listContainer)));
    var resourceList = $('<ul class="resource-list"></ul>').appendTo($('<div class="col-md-12"></div>').appendTo($('<div class="row"></div>').appendTo(listContainer)));
    
    $(list).sortable("refresh");
    
    return lastId;
}

/**
 * fills a row in the instruction step list with the data from the form
 * 
 * returns: id of the inserted row
 */
function addInstructionStepToList(form, list, rowId) {
    var data = {
        text: $(form).find('textarea[name=text]').val(),
        duration: $(form).find('input[name=duration]').val(),
        attendanceRate: $(form).find('input[name=attendance-rate]').val()
    };

    var li = $(list).find('li[data-id="' + rowId + '"]');
    
    $(li).find('input.text').val(data.text);
    $(li).find('input.duration').val(data.duration);
    $(li).find('input.attendance-rate').val(data.attendanceRate);

    $(li).find('span.text').html(data.text + ' (' + data.duration + ' min) ' + data.attendanceRate + '%');
    
    var ingredientList = $(li).find('ul.ingredient-list');
    var resourceList = $(li).find('ul.resource-list');
    
    $(form).find(".instruction-step-ingredients ul li:not(.placeholder)").each(function(key, value) {
        var ingredientData = {
            text: $(value).find('.text').html(),
            amount: $(value).find('.amount').val(),
            unit: $(value).find('.unit').val(),
            comment: $(value).find('.comment').val()
        };
        var content = "<li>";
        content += '<span class="amount">' + ingredientData.amount + '</span> ';
        content += '<span class="unit">' + ingredientData.unit + '</span> of ';
        content += '<span class="text">' + ingredientData.text + '</span>';
        content += '<span class="comment"> (' + ingredientData.comment + ')</span>';
        content += "</li>";
        
        $(ingredientList).append(content);
    });
    
    $(form).find(".instruction-step-resources ul li:not(.placeholder)").each(function(key, value) {
        var resourceData = {
            text: $(value).find('.text').html(),
            amount: $(value).find('.amount').val(),
            unit: $(value).find('.unit').val(),
            comment: $(value).find('.comment').val()
        };
        var content = "<li>";
        content += '<span class="amount">' + resourceData.amount + '</span> ';
        content += '<span class="unit">' + resourceData.unit + '</span> of ';
        content += '<span class="text">' + resourceData.text + '</span>';
        content += '<span class="comment"> (' + resourceData.comment + ')</span>';
        content += "</li>";
        
        $(resourceList).append(content);
    });
    
}

/**
 * creates a new empty row in the instruction step list's resource list
 * 
 * returns: id of the inserted row
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
    $('<div class="col-md-3 col-xs-12"></div>').append('<label for="selected-ingredient-' + $(li).index() + '-' + ui.draggable.attr('data-id') + '">optional</label><input type="checkbox" class="optional checkbox-inline" id="selected-ingredient-' + ($(li).index()) + '-' + (ui.draggable.attr('data-id')) + '" ' + optionalValue + '/>' ).appendTo(rowTop);
    $('<div class="col-md-3 col-xs-12"></div>').append('<input type="button" class="remove btn btn-default btn-xs" value="" />' ).appendTo(rowTop).on("click", function() {
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
 * 
 * returns: id of the inserted row
 */
function emptyInstructionStepForm(form) {
    $(form).find('textarea[name=text]').val('');
    $(form).find('input[name=duration]').val('');
    $(form).find('input[name=attendance-rate]').val('');
    
    $(form).find('div.instruction-step-ingredients ul').html('');
    $(form).find('div.instruction-step-resources ul').html('');
}

/**
 * copy data from a list row to the form fields
 * 
 * returns: id of the inserted row
 */
function fillFormFromInstructionStep(form, li) {
    $(form).find('input[name="loaded-instruction-step"]').val($(li).attr('data-id'));
    $(form).find('textarea[name="text"]').val($(li).find('input.text').val());
    $(form).find('input[name="duration"]').val($(li).find('input.duration').val());
    $(form).find('input[name="attendance-rate"]').val($(li).find('input.attendance-rate').val());
    
    $(li).find('ul.resource-list li').each(function() {
        console.log(this);
    });
    
    console.log($(li).find('ul.resource-list'));
    console.log($(li).find('ul.ingredient-list'));
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

