//to prevent display overflow
const maxWidth = document.getElementById('display-div').getBoundingClientRect().width - 83;
const display = document.getElementById('inputs');

let expression = ['', '', ''];
let expPointer = 0;


//keyboard support
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

    if(!isNaN(input)) expression[expPointer] += input;

    if(input == "."){
        if (Number.isInteger(expression[expPointer]) || expression[expPointer] == "") 
            expression[expPointer] += ".";
    }

    if(isOperand(input)){
        if(expression[0] != ""){
            if(expression[2] != ""){
                expression[0] = calculate();
                expression[2] = ""; 
            }
            expPointer = 2;
            expression[1] = input;
        }
    }

    display.innerHTML = expression[expPointer];
    //overflow, using e notation (Example 300 = 3*10^2 = 3e2)
    if(display.getBoundingClientRect().width > maxWidth + 80){
        let e = 0;
        while(display.getBoundingClientRect().width > maxWidth){
            e++;
            display.innerHTML = display.innerHTML.substring(0, display.innerHTML.length - 1);
        }
        display.innerHTML += " e" + e;
    }
    console.log(expression);
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