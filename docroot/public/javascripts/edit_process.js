var availableIngredientList = [];
var availableResourceList = [];

$(document).ready(function() {

    initFields();
    
    if (params.process) {
        addInstructionStepsFromRequest();
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

/**
 * creates a new empty row in the instruction step list
 * 
 * returns: id of the inserted row
 */
function createInstructionStepListRow(list) {
    // get and set the id of the last inserted row
    var lastId = parseInt($(list).attr('data-last-id'));

    var li = $(params.templates['instruction_step_row'].html).appendTo($(list));

    $(li).attr('data-id', lastId);
    $(li).find('input.id').attr('name', 'step[' + lastId + '][id]');
    $(li).find('input.id').val(lastId);
    $(li).find('input.text').attr('name', 'step[' + lastId + '][text]');
    $(li).find('input.duration').attr('name', 'step[' + lastId + '][duration]');
    $(li).find('input.attendance-rate').attr('name', 'step[' + lastId + '][attendance]');
    
    $(li).draggable({
        appendTo: "body",
        helper: "clone",
        handle: "div.move-box"
    });
    
    $(li).find('input.remove').on("click", function() {
        $(li).remove();
    });
    
    $(list).sortable("refresh");
    $(list).attr('data-last-id', lastId + 1);
    
    return lastId;
}

/**
 * fills a row in the instruction step list with the data from the form
 * 
 * returns: id of the inserted row
 */
function copyInstructionStepDataToList(data, list, stepId) {
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
    
    $(data.ingredient).each(function(key, element) {
        addIngredientToInstructionStep(stepId, ingredientList, this);
    });
    
    // ... the resources
    var resourceList = $(li).find('ul.resource-list');
    $(resourceList).html('');
    $(data.resource).each(function(key, element) {
        addResourceToInstructionStep(stepId, resourceList, this);
    });
    
    // ... the prerequisites
    var prerequisiteList = $(li).find('ul.prerequisite-list');
    $(prerequisiteList).html('');
    $(data.prerequisite).each(function(key, element) {
        addPrerequisiteToInstructionStep(stepId, prerequisiteList, this);
    });
    
}

/**
 * adds a new prerequisite list element to the requested instruction step
 */
function addPrerequisiteToInstructionStep(stepId, list, data) {
    var lastId = parseInt($(list).attr('data-last-id'));
    
    var row = $(params.templates['instruction_step_prerequisite_row'].html).appendTo($(list));

    $(row).find('input.id').attr('name', 'step[' + stepId + '][prerequisite][' + lastId + '][id]').val(data.id);
    $(row).find('span.text').html(data.text);
    
    $(list).attr('data-last-id', lastId + 1);
    
    return row;
}

/**
 * adds a new resource list element to the requested instruction step
 */
function addResourceToInstructionStep(stepId, list, data) {
    var lastId = parseInt($(list).attr('data-last-id'));
    
    var row = $(params.templates['instruction_step_resource_row'].html).appendTo($(list));

    $(row).find('input.id').attr('name', 'step[' + stepId + '][resource][' + lastId + '][id]').val(data.id);
    $(row).find('input.title').attr('name', 'step[' + stepId + '][resource][' + lastId + '][title]').val(data.title);
    $(row).find('input.amount').attr('name', 'step[' + stepId + '][resource][' + lastId + '][amount]').val(data.amount);
    $(row).find('input.unit').attr('name', 'step[' + stepId + '][resource][' + lastId + '][unit]').val(data.unit);
    $(row).find('input.comment').attr('name', 'step[' + stepId + '][resource][' + lastId + '][comment]').val(data.comment);
    $(row).find('input.optional').attr('name', 'step[' + stepId + '][resource][' + lastId + '][optional]').val(data.optional);
    
    $(row).find('span.title').html(data.title);
    $(row).find('span.amount').html(data.amount);
    $(row).find('span.unit').html(data.unit);
    $(row).find('span.comment').html(data.comment);
    
    $(list).attr('data-last-id', lastId + 1);
    
    return row;
}

/**
 * adds a new ingredient list element to the requested instruction step
 */
function addIngredientToInstructionStep(stepId, list, data) {
    var lastId = parseInt($(list).attr('data-last-id'));
    
    var row = $(params.templates['instruction_step_ingredient_row'].html).appendTo($(list));

    $(row).find('input.id').attr('name', 'step[' + stepId + '][ingredient][' + lastId + '][id]').val(data.id);
    $(row).find('input.title').attr('name', 'step[' + stepId + '][ingredient][' + lastId + '][title]').val(data.title);
    $(row).find('input.amount').attr('name', 'step[' + stepId + '][ingredient][' + lastId + '][amount]').val(data.amount);
    $(row).find('input.unit').attr('name', 'step[' + stepId + '][ingredient][' + lastId + '][unit]').val(data.unit);
    $(row).find('input.comment').attr('name', 'step[' + stepId + '][ingredient][' + lastId + '][comment]').val(data.comment);
    $(row).find('input.optional').attr('name', 'step[' + stepId + '][ingredient][' + lastId + '][optional]').val(data.optional);
    
    $(row).find('span.title').html(data.title);
    $(row).find('span.amount').html(data.amount);
    $(row).find('span.unit').html(data.unit);
    $(row).find('span.comment').html(data.comment);
    
    $(list).attr('data-last-id', lastId + 1);
    
    return row;
}

/**
 * creates a row in the instruction step form's prerequisitelist
 */
function addPrerequisiteRowToInstructionStepForm(list, data) {
    if (data.id === $('.add-instruction-step input.loaded-instruction-step').val()) {
        return;
    }
    
    $(list).find('li').addClass('border-bottom');
    var li = $( "<li></li>" ).appendTo($(list));
    $(params.templates['add_instruction_step_prerequisite_row'].html).appendTo(li);
    $(li).find('span.text').html(data.text);
    $(li).find('input.id').val(data.id);
    
    $(li).find('input.delete').on('click', function() {
        $(li).remove();
    });
    
    return li;
}

/**
 * creates and fills a row in the instruction step form's resourcelist
 */
function addResourceRowToInstructionStepForm(list, data) {
    $(list).find('li').addClass('border-bottom');
    var li = $( "<li></li>" ).appendTo($(list));
    $(params.templates['add_instruction_step_resource_row'].html).appendTo(li);
    $(li).find('span.title').html(data.title);
    $(li).find('input.id').val(data.id);
    $(li).find('input.amount').val(data.amount);
    $(li).find('input.unit').val(data.unit);
    $(li).find('input.comment').val(data.comment);
    
    $(li).find('label.optional').attr('for', 'selected-resource-' + $(li).index() + '-' + data.id);
    $(li).find('input.optional').attr('id', 'selected-resource-' + $(li).index() + '-' + data.id);

    if (data.optional === 'true') {
        $(li).find('input.optional').prop('checked', 'checked');
    }
    
    return li;
}

/**
 * creates and fills a row in the instruction step form's ingredientlist
 */
function addIngredientRowToInstructionStepForm(list, data) {
    $(list).find('li').addClass('border-bottom');
    var li = $( "<li></li>" ).appendTo($(list));
    $(params.templates['add_instruction_step_ingredient_row'].html).appendTo(li);
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
    $(form).find('div.prerequisite-list ul').html('');
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
            title : $(this).find('input.title').val(),
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
            title : $(this).find('input.title').val(),
            amount: $(this).find('input.amount').val(),
            unit: $(this).find('input.unit').val(),
            comment: $(this).find('input.comment').val(),
            optional: $(this).find('input.optional').val()
        };
        addIngredientRowToInstructionStepForm($(form).find('div.ingredient-list ul'), data);
    });
    
}

function addInstructionStepsFromRequest() {
    var process = params.process;
    for (var i=0;i<process.step.length;i++) {
        var rowId = createInstructionStepListRow($('div.instruction-step-list ul.instruction-step-list'));
        copyInstructionStepDataToList(process.step[i], $('div.instruction-step-list ul.instruction-step-list'), rowId);
    }
}

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
