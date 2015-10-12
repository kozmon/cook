$(document).ready(function() {

    initFields();
    
    if (params.kitchen) {
        KitchenContainer.loadEditableDataFromRequest();
    }

    ResourceContainer.initAvailableResourceAutocompleteSource(params.availableResourceList);
    IngredientContainer.initAvailableIngredientAutocompleteSource(params.availableIngredientList);

});

function initFields() {
    IngredientContainer.initFields();
    ResourceContainer.initFields();
//    KitchenContainer.initFields();
}

