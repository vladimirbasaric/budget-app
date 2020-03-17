// Budget Controller
let budgetController = (function(){

    

})();


// UI Controller
let UIController = (function(){

    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //will be inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }          
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }

})();


// Main Controller
let controller = (function(budgetCtrl, UICtrl) {

    let DOM = UICtrl.getDOMstrings();

    let ctrlAddItem = function(){
        //1. get the field input data
        let input = UICtrl.getinput();
        console.log(input);

       //2. add the item to budget controller

       //3. add the item to UI

       //4. calculate the budget

       //5.display the budget on the UI
      
    }

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(e){
        
        if (e.key === 13 || e.which === 13) {
            ctrlAddItem();
        }

    });

})(budgetController, UIController);


