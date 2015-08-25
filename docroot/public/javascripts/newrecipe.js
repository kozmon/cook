var
    steps;

$(document).ready(function() {
/*
    $( "ul.ingredient-list li" ).draggable({
        appendTo: "body",
        helper: "clone"
    });
*/
    $( "ul.ingredient-list li" ).draggable({
        appendTo: "body",
        helper: "clone"
    });
    
    $( "ul.resource-list li" ).draggable({
        appendTo: "body",
        helper: "clone"
    });
    
    $( ".input-add-resource" ).on( "enter", function() {
        $('.new-resource').show();
    });
    
    $( ".input-add-ingredient" ).on( "enter", function() {
        $('.new-ingredient').show();
    });
    
    $( "ul.instruction-steps" ).sortable({
        sort: function() {
            // gets added unintentionally by droppable interacting with sortable
            // using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
            $( this ).removeClass( "ui-state-default" );
        }
    });
        
    /* add new instruction step on submit */
    $( ".add-instruction-step input.submit" ).on( "click", function(e) {
        var form = $('div.add-instruction-step');
        var data = {
            text: $(form).find('input[name=text]').val(),
            duration: $(form).find('input[name=duration]').val(),
            attendanceRate: $(form).find('input[name=attendance-rate]').val()
        };
        var li = $('<li class="instruction-step list-group-item"></li>').appendTo($( 'div.instruction-step-list ul' ));
        var row = $('<div class="row"></div>').appendTo($(li).draggable({
            appendTo: "body",
            helper: "clone"
        }));
        var index = $(li).index();
        $('<div class="col-md-2">').appendTo(row).append('<p><span class="text">' + data.text + '</span> (<span class="duration">' + data.duration + ' min</span>)</p><input type="hidden" name="text-' + index + '" value="' + data.text + '" />');
        $('<div class="col-md-2">').appendTo(row).append('<span class="attendance-rate">' + data.attendanceRate + '</span>');
        var listContainer = $('<div class="col-md-8">').appendTo(row);
        var ingredientList = $('<ul class="ingredient-list"></ul>').appendTo($('<div class="col-md-12"></div>').appendTo($('<div class="row"></div>').appendTo(listContainer)));
        var resourceList = $('<ul class="resource-list"></ul>').appendTo($('<div class="col-md-12"></div>').appendTo($('<div class="row"></div>').appendTo(listContainer)));
        
        $(form).find(".instruction-step-ingredients ul li:not(.placeholder)").each(function(key, value) {
            var data = {
                text: $(value).find('.text').html(),
                amount: $(value).find('.amount').val(),
                unit: $(value).find('.unit').val(),
                comment: $(value).find('.comment').val()
            };
            var content = "<li>";
            content += '<span class="amount">' + data.amount + '</span> ';
            content += '<span class="unit">' + data.unit + '</span> of ';
            content += '<span class="text">' + data.text + '</span>';
            content += '<span class="comment"> (' + data.comment + ')</span>';
            content += "</li>";
            
            $(ingredientList).append(content);
        });
        
        $(form).find(".instruction-step-resources ul li:not(.placeholder)").each(function(key, value) {
            var data = {
                text: $(value).find('.text').html(),
                amount: $(value).find('.amount').val(),
                unit: $(value).find('.unit').val(),
                comment: $(value).find('.comment').val()
            };
            var content = "<li>";
            content += '<span class="amount">' + data.amount + '</span> ';
            content += '<span class="unit">' + data.unit + '</span> of ';
            content += '<span class="text">' + data.text + '</span>';
            content += '<span class="comment"> (' + data.comment + ')</span>';
            content += "</li>";
            
            $(ingredientList).append(content);
        });
        
        $( "ul.instruction-steps" ).sortable("refresh");
        
    });
    
    $( ".instruction-step-ingredients .input-add-ingredient" ).on("click", function() {
        $('.new-ingredient').show();
    });
  
    $( ".instruction-step-resources .input-add-resource" ).on("click", function() {
        $('.new-resource').show();
    });
  
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
            $('<div class="col-md-1"></div>').append( "<input type='text' class='amount form-control' placeholder='amount' />" ).appendTo(row);
            $('<div class="col-md-1"></div>').append( "<input type='text' class='unit form-control' placeholder='unit' />" ).appendTo(row);
            $('<div class="col-md-4"></div>').append( "<input type='text' class='comment form-control' placeholder='comment'/>" ).appendTo(row);
            $('<div class="col-md-2"></div>').append( "<label for='selected-ingredient-" + $(row).index() + "-" + ui.draggable.attr('data-id') + "'>optional</label><input type='checkbox' class='optional checkbox-inline' id='selected-ingredient-" + ($(row).index()) + "-" + (ui.draggable.attr('data-id')) + "' />" ).appendTo(row);
            $('<div class="col-md-2"></div>').append( "<input type='button' class='remove form-control' value='remove' />" ).appendTo(row).on("click", function() {
                $(li).remove();
            });
            
            $(li).append( "<input type='hidden' class='id' value='" + ui.draggable.attr('data-id') + "' />" );
            //$( '.input-ingredients' ).val($( '.input-ingredients' ).val() + ' ' + (ui.draggable.text()));
        }
    }).sortable({
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
            var li = $( "<li></li>" ).appendTo($(this).find('ul'));
            var row = $( "<div class='row'></div>" ).appendTo($(li));

            $('<div class="col-md-2"></div>').append( "<span class='text' >" + (ui.draggable.text()) + "</span>" ).appendTo(row);
            $('<div class="col-md-1"></div>').append( "<input type='text' class='amount form-control' placeholder='amount' />" ).appendTo(row);
            $('<div class="col-md-1"></div>').append( "<input type='text' class='unit form-control' placeholder='unit' />" ).appendTo(row);
            $('<div class="col-md-4"></div>').append( "<input type='text' class='comment form-control' placeholder='comment'/>" ).appendTo(row);
            $('<div class="col-md-2"></div>').append( "<label for='selected-ingredient-" + $(row).index() + "-" + ui.draggable.attr('data-id') + "'>optional</label><input type='checkbox' class='optional checkbox-inline' id='selected-ingredient-" + ($(row).index()) + "-" + (ui.draggable.attr('data-id')) + "' />" ).appendTo(row);
            $('<div class="col-md-2"></div>').append( "<input type='button' class='remove form-control' value='remove' />" ).appendTo(row).on("click", function() {
                $(li).remove();
            });
            
            $(li).append( "<input type='hidden' class='id' value='" + ui.draggable.attr('data-id') + "' />" );
            //$( '.input-ingredients' ).val($( '.input-ingredients' ).val() + ' ' + (ui.draggable.text()));
        }
    }).sortable({
        items: "li:not(.placeholder)",
        sort: function() {
            $( this ).removeClass( "ui-state-default" );
        }
    });

    /* fills instruction step form from list */
    $( "div.add-instruction-step" ).droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ".instruction-step",
        drop: function( event, ui ) {
            console.log($(ui.draggable));
            //console.log(ui.draggable.find('span.text'));
            
            $('.add-instruction-step input[name=text]').val();
        }
    });
    
});
