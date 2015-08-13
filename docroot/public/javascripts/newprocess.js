$(document).ready(function() {
    $( "ul.process-list li" ).draggable({
        appendTo: "body",
        helper: "clone"
    });
    
    $( "ul.resource-list li" ).draggable({
        appendTo: "body",
        helper: "clone"
    });
    
    $( "div.selected-processes ol" ).droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ".process-box",
        drop: function( event, ui ) {
            $( this ).find( ".placeholder" ).remove();
            $( "<li></li>" ).text( ui.draggable.text() ).appendTo( this );
            $( '#inputProcesses' ).val($( '#inputProcesses' ).val() + ' ' + (ui.draggable.text()));
        }
    }).sortable({
        items: "li:not(.placeholder)",
        sort: function() {
            // gets added unintentionally by droppable interacting with sortable
            // using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
            $( this ).removeClass( "ui-state-default" );
        }
    });
    
    $( "div.selected-resources ol" ).droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        //accept: ":not(.ui-sortable-helper), .resource-box",
        accept: ".resource-box",
        drop: function( event, ui ) {
            $( this ).find( ".placeholder" ).remove();
            $( "<li></li>" ).text( ui.draggable.text() ).appendTo( this );
            $( '#inputResources' ).val($( '#inputResources' ).val() + ' ' + (ui.draggable.text()));
        }
    }).sortable({
        items: "li:not(.placeholder)",
        sort: function() {
            // gets added unintentionally by droppable interacting with sortable
            // using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
            $( this ).removeClass( "ui-state-default" );
        }
    });
    
    //$('input.search').focus();
});
