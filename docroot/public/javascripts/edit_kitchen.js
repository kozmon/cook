$(document).ready(function() {

    initFields();
    
    if (params.kitchen) {
//        loadKitchenFromRequest();
    }

    ResourceContainer.initAvailableResourceAutocompleteSource(params.availableResourceList);
    IngredientContainer.initAvailableIngredientAutocompleteSource(params.availableIngredientList);

});

function initFields() {
    $('form.new-ingredient input.submit').on('click', function() {
        IngredientContainer.save($('form.new-ingredient'));
    });
        
    $('form.new-resource input.submit').on('click', function() {
        ResourceContainer.save($('form.new-resource'));
    });
        
    IngredientContainer.setAutocompleteField($('.ingredient-list input.add-ingredient'));
    ResourceContainer.setAutocompleteField($('.resource-list input.add-resource'));
    
}

