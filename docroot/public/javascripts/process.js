var ProcessContainer = function() {
    
};

ProcessContainer.createInstructionStepListRow = function(list) {
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
};

/**
 * fills a row in the instruction step list with the data from the form
 * 
 * returns: id of the inserted row
 */
ProcessContainer.copyInstructionStepDataToList = function(data, list, stepId) {
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
        ProcessContainer.addIngredientToInstructionStep(stepId, ingredientList, this);
    });
    
    // ... the resources
    var resourceList = $(li).find('ul.resource-list');
    $(resourceList).html('');
    $(data.resource).each(function(key, element) {
        ProcessContainer.addResourceToInstructionStep(stepId, resourceList, this);
    });
    
    // ... the prerequisites
    var prerequisiteList = $(li).find('ul.prerequisite-list');
    $(prerequisiteList).html('');
    $(data.prerequisite).each(function(key, element) {
        ProcessContainer.addPrerequisiteToInstructionStep(stepId, prerequisiteList, this);
    });
    
};

/**
 * adds a new prerequisite list element to the requested instruction step
 */
ProcessContainer.addPrerequisiteToInstructionStep = function(stepId, list, data) {
    var lastId = parseInt($(list).attr('data-last-id'));
    
    var row = $(params.templates['instruction_step_prerequisite_row'].html).appendTo($(list));

    $(row).find('input.id').attr('name', 'step[' + stepId + '][prerequisite][' + lastId + '][id]').val(data.id);
    $(row).find('span.text').html(data.text);
    
    $(list).attr('data-last-id', lastId + 1);
    
    return row;
};

/**
 * adds a new resource list element to the requested instruction step
 */
ProcessContainer.addResourceToInstructionStep = function(stepId, list, data) {
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
};

/**
 * adds a new ingredient list element to the requested instruction step
 */
ProcessContainer.addIngredientToInstructionStep = function(stepId, list, data) {
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
};

/**
 * creates a row in the instruction step form's prerequisitelist
 */
ProcessContainer.addPrerequisiteRowToInstructionStepForm = function(list, data) {
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
};

/**
 * empty the form fields
 */
ProcessContainer.emptyInstructionStepForm = function(form) {
    $(form).find('textarea.text').val('');
    $(form).find('input.duration').val('');
    $(form).find('input.attendance-rate').val('');
    
    $(form).find('div.ingredient-list ul').html('');
    $(form).find('div.resource-list ul').html('');
    $(form).find('div.prerequisite-list ul').html('');
};

/**
 * copy data from a list row to the instruction step form's fields
 */
ProcessContainer.fillFormFromInstructionStep = function(form, li) {
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
        ResourceContainer.addRowToList('add_instruction_step_resource_row', $(form).find('div.resource-list ul'), data);
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
        
        IngredientContainer.addRowToList('add_instruction_step_ingredient_row', $(form).find('div.ingredient-list ul'), data);
    });
    
};

ProcessContainer.addInstructionStepsFromRequest = function() {
    var process = params.process;
    for (var i=0;i<process.step.length;i++) {
        var rowId = ProcessContainer.createInstructionStepListRow($('div.instruction-step-list ul.instruction-step-list'));
        ProcessContainer.copyInstructionStepDataToList(process.step[i], $('div.instruction-step-list ul.instruction-step-list'), rowId);
    }
};

ProcessContainer.collectDataFromInstructionStepForm = function(form) {
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
};

