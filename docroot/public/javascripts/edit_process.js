$(document).ready(function() {

    initFields();
    
    if (params.process) {
        ProcessContainer.addInstructionStepsFromRequest();
    }

    ResourceContainer.initAvailableResourceAutocompleteSource(params.availableResourceList);
    IngredientContainer.initAvailableIngredientAutocompleteSource(params.availableIngredientList);
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
        IngredientContainer.save($('form.new-ingredient'));
    });
        
    $('form.new-resource input.submit').on('click', function() {
        ResourceContainer.save($('form.new-resource'));
    });
        
    IngredientContainer.setAutocompleteField($('.ingredient-list input.add-ingredient'));
    ResourceContainer.setAutocompleteField($('.resource-list input.add-resource'));
    
    /* instruction step save (update) button click */
    $('div.add-instruction-step').find('div.controls input.save').on('click', function() {
        var form = $('div.add-instruction-step');
        var formData = ProcessContainer.collectDataFromInstructionStepForm(form);
        
        ProcessContainer.copyInstructionStepDataToList(formData, $('div.instruction-step-list ul.instruction-step-list'), $(form).find('input.loaded-instruction-step').val());
        ProcessContainer.emptyInstructionStepForm(form);
        
        $(form).find('div.controls input.submit').removeClass('hidden');
        $(form).find('div.controls input.save').addClass('hidden');
        $(form).find('div.controls input.cancel').addClass('hidden');
    });
    
    $('div.add-instruction-step').find('div.controls input.cancel').on('click', function() {
        var form = $('div.add-instruction-step');
        ProcessContainer.emptyInstructionStepForm(form);
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
        var formData = ProcessContainer.collectDataFromInstructionStepForm(form);
        var rowId = ProcessContainer.createInstructionStepListRow($('div.instruction-step-list ul.instruction-step-list'));
        ProcessContainer.copyInstructionStepDataToList(formData, $('ul.instruction-step-list'), rowId);
        ProcessContainer.emptyInstructionStepForm(form);
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
            
            ProcessContainer.addPrerequisiteRowToInstructionStepForm($(this).find('ul'), data);
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
            
            IngredientContainer.addRowToList('add_instruction_step_ingredient_row', $(this).find('ul'), data).find('input.amount').focus();
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
            
            ResourceContainer.addRowToList('add_instruction_step_resource_row', $(this).find('ul'), data).find('input.amount').focus();
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
            
            ProcessContainer.emptyInstructionStepForm(form);
            ProcessContainer.fillFormFromInstructionStep(form, ui.draggable);
            
            $(form).find('div.controls input.submit').addClass('hidden');
            $(form).find('div.controls input.save').removeClass('hidden');
            $(form).find('div.controls input.cancel').removeClass('hidden');
        }
    });
    
    $('input.submit-add-recipe').on('click', function() {
        submitProcessForm();
    });
}

function submitProcessForm() {
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

