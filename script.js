//to prevent display overflow
const maxWidth = document.getElementById('display-div').getBoundingClientRect().width - 83;
const display = document.getElementById('inputs');

//expression array
let expression = ['', '', ''];
let expPointer = 0;

//number button event listeners
const numbers = Array.from(document.getElementsByClassName("number"));
numbers.map((number) =>{
    if(number.id == "decimal") number.addEventListener("click", ()=> updateExpression("."));
    else  number.addEventListener("click", ()=> updateExpression(number.innerHTML));
});

//operand button event listeners
const operands = Array.from(document.getElementsByClassName("operand"));
operands.map((operand) =>{
    switch(operand.id){
        case "add":
            operand.addEventListener("click", () => updateExpression("+"));
            break;
        case "subtract":
            operand.addEventListener("click", () => updateExpression("-"));
            break;
        case "multiply":
            operand.addEventListener("click", () => updateExpression("*"));
            break;
        case "divide":
            operand.addEventListener("click", () => updateExpression("/"));
            break;
        case "equals":
            operand.addEventListener("click", () => updateExpression(calculate()));
    }
});

//all clear, backspace button event listeners
document.getElementById("allclear").addEventListener("click", (e) => allclear());
document.getElementById("backspace").addEventListener("click", (e) => backspace());




//keyboard event listeners
window.addEventListener("keydown", (e) =>{
    //backspace
    if(e.key == "Backspace"){
        if(e.repeat) allclear();
        else backspace(); 
    }

    //enter
    if(e.key == "Enter") updateExpression(calculate());

    //numbers and decimal
    if((e.key >= 0 && e.key <= 9) || e.key == "." ) updateExpression(e.key);

    //operands
    switch(e.key){
        case "+":
        case "-":
        case "*":
        case "/":
            updateExpression(e.key);
    }
});


function backspace(){
    if(expression[expPointer] == "") return;
    expression[expPointer] = expression[expPointer].substring(0, expression[expPointer].length - 1);
    display.innerHTML = expression[expPointer];
    overflow(expression[expPointer]);
}

function allclear(){
    expression = ['', '', ''];
    expPointer = 0;
    display.innerHTML = "";
}

function calculate(){
    if(!validExpression(expression)) return;
    let result = 0;
    let x = Number(expression[0]);
    let operand = expression[1];
    let y = Number(expression[2]);

    switch(operand){
        case "+":
            result = x + y;
            break;
        case "-":
            result = x - y;
            break;
        case "*":
            result = x * y;
            break;
        case "/":
            if (y == 0) result = "ERROR";
            else result = x / y;
    }
    expression[0] = "";
    expPointer = 0;
    expression[1] = "";
    expression[2] = "";
    return result;
}

function updateExpression(input){
    if(input == "ERROR"){
        display.innerHTML = "ERROR";
        expression[0] = "ERROR";
        return;
    }

    if(expression[0] == "ERROR"){
        display.innerHTML = "";
        expression[0] = "";
    }

    if(!isNaN(input)){
        if(input == "0"){
            if(expression[expPointer] != "0") expression[expPointer] += input;
        }else expression[expPointer] += input;
    } 
    
    if(input == "."){
        if (!expression[expPointer].includes(".")) expression[expPointer] += ".";
    }
    let updateFromNewOperand = false;
    if(isOperand(input)){
        if(expression[0] != "" && expression[0] != "."){
            if(expression[2] != ""){
                expression[0] = calculate();
                expression[2] = "";
                updateFromNewOperand = true;
            }
            expPointer = 2;
            expression[1] = input;
        }else return;
    }
    if(updateFromNewOperand == true) display.innerHTML = expression[0];
    else display.innerHTML = expression[expPointer];

    //overflow control, using E notation (Example 300 = 3*10^2 = 3 E2)
    overflow(expression[expPointer]);
    console.log(expression);
}

function overflow(displayNum){
    if(display.getBoundingClientRect().width > maxWidth + 80){
        let e = 0;
        displayNum = (Number(displayNum).toFixed(6));
        display.innerHTML = displayNum;
        if(display.getBoundingClientRect().width > maxWidth){
            while(display.getBoundingClientRect().width > maxWidth){
                if(e == "") e = 0;
                e++;
                display.innerHTML = display.innerHTML.substring(0, display.innerHTML.length - 1);
                displayNum /= 10;
            }
            display.innerHTML = displayNum;
    
            while(display.getBoundingClientRect().width > maxWidth) display.innerHTML = display.innerHTML.substring(0, display.innerHTML.length - 1);
            display.innerHTML += " e" + e;
        }
        else display.innerHTML = displayNum;
    }
}

function validExpression(expression){
    if(!isNaN(expression[0]) && isOperand(expression[1]) && !isNaN(expression[2])) 
        return true;

    return false;
}

function isOperand(ch){
    if(ch == "+" || ch == "-" || ch == "*" ||ch == "/") 
        return true;

    return false;
}