var KitchenContainer = function() {
    
};

KitchenContainer.addInstructionStepsFromRequest = function() {
    var kitchen = params.kitchen;

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
};

