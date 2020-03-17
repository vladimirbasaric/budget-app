// Budget Controller
let budgetController = (function(){

    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let allExpenses = [];
    let allIncomes = [];
    let totalExpenses = 0;

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

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

    let setupEventListeners = function() {
        let DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e){
            
            if (e.key === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
    };


    let ctrlAddItem = function(){
        //1. get the field input data
        let input = UICtrl.getinput();

       //2. add the item to budget controller

       //3. add the item to UI

       //4. calculate the budget

       //5.display the budget on the UI
      
    };

    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();
