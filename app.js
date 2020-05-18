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

   let calculateTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
   };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        // this method is pased to main controller to ctrlAddItem -> newItem
        addItem: function(type, des, val) {
            let newItem, ID;

            // [1 2 3 4 5], next ID = 6
            // [1 2 4 6 8], next ID = 9
            // ID = last ID + 1

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val)
            }

            // Push into our data structure
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;
        },

        deleteItem: function(type, id) {
            let ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }


        },

        calculateBudget: function () {

            // calculate total income and expanses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if(data.totals.inc > 0) {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);     
            } else {
                data.percentage = -1;
            }
        },

        // this metod just retuns data to be available to other modules
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }

    };

})();

// UI Controller
let UIController = (function(){

    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }

    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //will be inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }          
        },

        addListItem: function (obj, type) {
            let html, newHtml, element;

            // Create HTML string with placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = `<div class="item clearfix" id="inc-%id%">
                        <div class="item__description">%description%</div>
                        <div class="right clearfix">
                            <div class="item__value">%value%</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>`;
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = `<div class="item clearfix" id="exp-%id%">
                        <div class="item__description">%description%</div>
                        <div class="right clearfix">
                            <div class="item__value">%value%</div>
                            <div class="item__percentage">21%</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>`;
            }
                      
            // Replace the placeholder text with some actual data

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function () {
            let fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = '';
            });

            fieldsArr[0].focus();
        },

        displayBudget: function (obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        // exposing DOMstrings object to public
        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();


// Main Controller
let controller = (function(budgetCtrl, UICtrl) {

    let setupEventListeners = function() {

        // in this variable I store DOMstrings from UI Controler, and Now I can use them in this controller
        let DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // this EventListener is for global document
        document.addEventListener('keypress', function(e){
            
            if (e.key === 13 || e.which === 13) {// e.which is for older browsers
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };

    let updateBudget = function() {

        // 1. calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        let budget = budgetCtrl.getBudget();

        // 3. display the budget on the UI
        UICtrl.displayBudget(budget);
    };


    let ctrlAddItem = function(){
        let input, newItem;

        //1. get the field input data
        input = UICtrl.getinput();

        if(input.description !== '' && !isNaN(input.value) && input.value > 0) {
            //2. add the item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3. add the item to UI
            UICtrl.addListItem(newItem, input.type);

            // 4. clear the fields
            UICtrl.clearFields();

            // 5. calculate and update budget
            updateBudget();  
        }
    };

    let ctrlDeleteItem = function(e) {
        let itemID, splitID, type, ID;

        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete item from data structure
            budgetCtrl.deleteItem(type, ID);
            // 2. delete item from UI

            // 3. update and show new budget

        }

    };

    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayBudget( {
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();
