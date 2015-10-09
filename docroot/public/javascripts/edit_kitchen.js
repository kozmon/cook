var availableIngredientList = [];
var availableResourceList = [];

$(document).ready(function() {

    initFields();
    
    if (params.kitchen) {
        loadKitchenFromRequest();
    }

    for (var i=0;i<params.availableIngredientList.length;i++) {
        availableIngredientList.push({
            value: params.availableIngredientList[i].title,
            label: params.availableIngredientList[i].title,
            id: params.availableIngredientList[i].id
        });
    }

    for (var i=0;i<params.availableResourceList.length;i++) {
        availableResourceList.push({
            value: params.availableResourceList[i].title,
            label: params.availableResourceList[i].title,
            id: params.availableResourceList[i].id
        });
    }

});

function initFields() {
    $( "div.available-process" ).draggable({
        appendTo: "body",
        helper: "clone"
    });
    
    $( "div.available-resource" ).draggable({
        appendTo: "body",
        helper: "clone"
    });
    
    $( "div.available-ingredient" ).draggable({
        appendTo: "body",
        helper: "clone"
    });
 
    $('ul.instruction-step-list').sortable({
        revert: true
    });

    $('form.new-ingredient input.submit').on('click', function() {
        addIngredient();
    });
        
    $('form.new-resource input.submit').on('click', function() {
        addResource();
    });
        
    setAutocompleteField($('.ingredient-list input.add-ingredient'), 'ingredient');
    setAutocompleteField($('.resource-list input.add-resource'), 'resource');
    
    /* instruction step save (update) button click */
    $('div.add-instruction-step').find('div.controls input.save').on('click', function() {
        var form = $('div.add-instruction-step');
        var formData = collectDataFromInstructionStepForm(form);
        
        copyInstructionStepDataToList(formData, $('div.instruction-step-list ul.instruction-step-list'), $(form).find('input.loaded-instruction-step').val());
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
    
    $( ".instruction-step-ingredients .input-add-ingredient" ).on("click", function() {
        $('.new-ingredient').show();
    });
  
    $( ".instruction-step-resources .input-add-resource" ).on("click", function() {
        $('.new-resource').show();
    });
  
    /* submit the new instruction step form */
    $( ".add-instruction-step input.submit" ).on( "click", function(e) {
        var form = $('div.add-instruction-step');
        var formData = collectDataFromInstructionStepForm(form);
        var rowId = createInstructionStepListRow($('div.instruction-step-list ul.instruction-step-list'));
        copyInstructionStepDataToList(formData, $('ul.instruction-step-list'), rowId);
        emptyInstructionStepForm(form);
    });
    
    /* accepts prerequisites from the instruction step list */
    $( "div.add-instruction-step div.prerequisite-list" ).droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ".instruction-step",
        greedy: true,
        drop: function( event, ui ) {
            var data = {
                id : ui.draggable.attr('data-id'),
                text : ui.draggable.find('input.text').val()
            };
            
            addPrerequisiteRowToInstructionStepForm($(this).find('ul'), data);
        }
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
            
            addIngredientRowToInstructionStepForm($(this).find('ul'), data).find('input.amount').focus();
        }
    });
    
    $( "div.selected-ingredients ul, div.instruction-step-ingredients ul" ).sortable({
        items: "li:not(.placeholder)",
        sort: function() {
            $( this ).removeClass( "ui-state-default" );
        }
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
            
            addResourceRowToInstructionStepForm($(this).find('ul'), data).find('input.amount').focus();
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
        submitProcessForm();
    });
}

function collectDataFromInstructionStepForm(form) {
    var formData = {
        text: $(form).find('textarea.text').val(),
        duration: $(form).find('input.duration').val(),
        attendance: $(form).find('input.attendance-rate').val(),
        resource: [],
        ingredient: [],
        prerequisite: []
    };

    $(form).find("div.ingredient-list ul li:not(.placeholder)").each(function(key, element) {
        formData.ingredient.push({
            id: $(element).find('input.id').val(),
            title: $(element).find('span.title').html(),
            optional: $(element).find('input.optional').prop('checked'),
            amount: $(element).find('.amount').val(),
            unit: $(element).find('.unit').val(),
            comment: $(element).find('.comment').val()
        });
    });

    $(form).find("div.resource-list li:not(.placeholder)").each(function(key, element) {
        formData.resource.push({
            id: $(element).find('input.id').val(),
            title: $(element).find('span.title').html(),
            optional: $(element).find('input.optional').prop('checked'),
            amount: $(element).find('.amount').val(),
            unit: $(element).find('.unit').val(),
            comment: $(element).find('.comment').val()
        });
    });

    $(form).find("div.prerequisite-list li:not(.placeholder)").each(function(key, element) {
        formData.prerequisite.push({
            id: $(element).find('input.id').val(),
            text: $(element).find('span.text').html()
        });
    });

    return formData;
}

function submitProcessForm() {
}

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

function addResource() {
    var data = {
        title : $('form.new-resource input[name="title"]').val(),
        description : $('form.new-resource input[name="description"]').val()
    };

    $.ajax({
        url: "/addresource",
        type : "POST",
        dataType: "json",
        data: data,
        success: function(res) {
            $('form.new-resource input.title').val('');
            $('form.new-resource input.description').val('');
            
            $('ul.available-resource-list').append($('<li></li>').append($(res.html).draggable({
                appendTo: "body",
                helper: "clone"
            })));
        }
    });
}

function setAutocompleteField(field, type) {
    var source;
    switch (type) {
        case 'ingredient':
            source = availableIngredientList;
            break;
        case 'resource':
            source = availableResourceList;
            break;
    }
    
    $(field).autocomplete({
        source: source,
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
            
            switch (type) {
                case 'ingredient':
                    addIngredientRowToInstructionStepForm($('div.add-instruction-step div.ingredient-list ul'), data).find('input.amount').focus();
                    break;
                case 'resource':
                    addResourceRowToInstructionStepForm($('div.add-instruction-step div.resource-list ul'), data).find('input.amount').focus();
                    break;
            }
            
            $(this).val('');
        }
    });
}

function getKeyByValue(list, value) {
    for (var prop in list) {
        if (list.hasOwnProperty(prop)) {
            if (list[prop] === value) {
                return prop;
            }
        }
    }
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
