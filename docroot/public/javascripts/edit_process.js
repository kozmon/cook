$(document).ready(function() {

    initFields();
    
    if (params.process) {
        ProcessContainer.addInstructionStepsFromRequest();
    }

    ResourceContainer.initAvailableResourceAutocompleteSource(params.availableResourceList);
    IngredientContainer.initAvailableIngredientAutocompleteSource(params.availableIngredientList);

});

function initFields() {
    IngredientContainer.initFields();    
    ResourceContainer.initFields();    
    ProcessContainer.initFields();
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

