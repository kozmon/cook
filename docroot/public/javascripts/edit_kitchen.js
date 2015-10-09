$(document).ready(function() {

    initFields();
    
    if (params.kitchen) {
//        loadKitchenFromRequest();
    }

    initAvailableIngredientAutocompleteSource(params.availableIngredientList);
    initAvailableResourceAutocompleteSource(params.availableResourceList);

});

function initFields() {
    setAutocompleteField($('.resource-list input.add-resource'), 'resource');
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
                    addIngredientRowToInstructionStepForm($('div.ingredient-list ul'), data).find('input.amount').focus();
                    break;
                case 'resource':
                    addResourceRowToInstructionStepForm($('div.resource-list ul'), data).find('input.amount').focus();
                    break;
            }
            
            $(this).val('');
        }
    });
}

