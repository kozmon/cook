var KitchenContainer = function() {
    
    initFields();
    
    if (params.process) {
        ProcessContainer.addInstructionStepsFromRequest();
    }

};

KitchenContainer.loadEditableDataFromRequest = function() {
    var kitchen = params.kitchen;

    // filling the resource and the ingredient list
    var ingredientList = $('div.ingredient-list').find('ul');
    $(ingredientList).html('');
    $(kitchen.ingredient).each(function(key, element) {
        IngredientContainer.addEditableRowToList(ingredientList, this);
    });
    
    // ... the resources
    var resourceList = $('div.resource-list').find('ul');
    $(resourceList).html('');
    $(kitchen.resource).each(function(key, element) {
        ResourceContainer.addEditableRowToList(resourceList, this);
    });
};

KitchenContainer.loadStaticDataFromRequest = function() {
    var kitchen = params.kitchen;

    // filling the resource and the ingredient list
    var ingredientList = $(li).find('ul.ingredient-list');
    $(ingredientList).html('');
    $(kitchen.ingredient).each(function(key, element) {
        IngredientContainer.addStaticRowToList(ingredientList, this);
    });
    
    // ... the resources
    var resourceList = $(li).find('ul.resource-list');
    $(resourceList).html('');
    $(data.resource).each(function(key, element) {
        ResourceContainer.addStaticRowToList(resourceList, this);
    });
};

