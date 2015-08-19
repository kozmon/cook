var
    steps;

$(document).ready(function() {
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
    
    $( "ol.instruction-steps" ).sortable({
        sort: function() {
            // gets added unintentionally by droppable interacting with sortable
            // using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
            $( this ).removeClass( "ui-state-default" );
        }
    });
    
    $( ".form-instruction-step input.submit" ).on( "click", function(e) {
        
        var form = $(e.toElement).parents( ".form-instruction-step" );
        var data = {
            text: $(form).find('input[name=text]').val(),
            duration: $(form).find('input[name=duration]').val(),
            attendanceRate: $(form).find('input[name=attendance-rate]').val()
        };
        var element = $("<li></li>").appendTo($( "ol.instruction-steps" ));
        
        $(element).append("<p>todo:<span class='text'>" + data.text + "</span>(<span class='duration'>" + data.duration + "</span>)</p>");
        $(element).append("<span class='attendance-rate'>" + data.attendanceRate + "</span>");
        
        var ingredientList = $("<ul></ul>").appendTo($(element));
            console.log($(form).find(".instruction-step-ingredients ol"));
        $(form).find(".instruction-step-ingredients ol li:not(.placeholder)").each(function(key, value) {
            var data = {
                text: $(value).find('.text').html(),
                amount: $(value).find('.amount').val(),
                unit: $(value).find('.unit').val(),
                comment: $(value).find('.comment').val()
            };
            
            var content = "<li>";
            content += 'text:';
            content += '<span class="text">' + data.text + '</span><br/>';
            content += 'amount:';
            content += '<span class="amount">' + data.amount + '</span><br/>';
            content += 'unit:';
            content += '<span class="unit">' + data.unit + '</span><br/>';
            content += 'comment:';
            content += '<span class="comment">' + data.comment + '</span><br/>';
            
            content += "</li>";
            
            $(ingredientList).append(content);
        });
        
        //console.log($(form .instruction-step-ingredients ol));
        
        $( "ol.instruction-steps" ).sortable("refresh");
        //$( "div.instruction-steps ol" ).append("<li><p>" + data.name + " (" + data.duration + " mins)</p></li>");
        
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

    $( "div.selected-ingredients pre" ).droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        //accept: ":not(.ui-sortable-helper), .ingredient-box",
        accept: ".ingredient-box",
        drop: function( event, ui ) {
            var content = "<span class='text' >" + (ui.draggable.text() + "</span>");
            var row = $( "<li></li>" ).html(content).appendTo($(this).find('ol'));

            $(row).append("<input type='text' class='amount' placeholder='amount' />");
            $(row).append("<input type='text' class='unit' placeholder='unit' />");
            $(row).append("<input type='text' class='comment' placeholder='comment'/>");
            // todo: replace id, this can be non-unique
            $(row).append("<label for='selected-ingredient-" + ($(row).index()) + "-" + (ui.draggable.attr('data-id')) + "'>optional</label>");
            $(row).append("<input type='checkbox' class='optional' id='selected-ingredient-" + ($(row).index()) + "-" + (ui.draggable.attr('data-id')) + "' />");
            $("<input type='button' class='remove' value='remove' />").appendTo($(row)).on("click", function() {
                $(row).remove();
            });
            $(row).append("<input type='hidden' class='id' value='" + ui.draggable.attr('data-id') + "' />");
            
            $( '.input-ingredients' ).val($( '.input-ingredients' ).val() + ' ' + (ui.draggable.text()));
        }
    }).sortable({
        items: "li:not(.placeholder)",
        sort: function() {
            $( this ).removeClass( "ui-state-default" );
        }
    });
    
    $( "div.selected-resources pre" ).droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        //accept: ":not(.ui-sortable-helper), .resource-box",
        accept: ".resource-box",
        drop: function( event, ui ) {
            var content = "<span class='text'>" + (ui.draggable.text() + "</span>");
            var row = $( "<li></li>" ).html(content).appendTo($(this).find('ol'));

            $(row).append("<input type='text' class='comment' placeholder='comment'/>");
            // todo: replace id, this can be non-unique
            $(row).append("<label for='selected-resource-" + ($(row).index()) + "-" + (ui.draggable.attr('data-id')) + "'>optional</label>");
            $(row).append("<input type='checkbox' class='optional' id='selected-resource-" + ($(row).index()) + "-" + (ui.draggable.attr('data-id')) + "' />");
            $("<input type='button' class='remove' value='remove' />").appendTo($(row)).on("click", function() {
                $(row).remove();
            });
            $(row).append("<input type='hidden' class='id' value='" + ui.draggable.attr('data-id') + "' />");
            
            $( '.input-resources' ).val($( '.input-resources' ).val() + ' ' + (ui.draggable.text()));
        }
    }).sortable({
        items: "li:not(.placeholder)",
        sort: function() {
            $( this ).removeClass( "ui-state-default" );
        }
    });
    
});
