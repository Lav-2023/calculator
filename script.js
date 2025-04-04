const numberButtons = document.querySelectorAll("[dataNumber");
const operationButtons = document.querySelectorAll("[dataOperation");
const allClearButton = document.querySelector("[dataAllClear]");
const plusOrMinusButton = document.querySelector("[dataPlusOrMinus]");
const backspaceButton = document.querySelector("[dataBackspace]");
const equalsButton = document.querySelector("[dataEquals]");
const previousOperandTextElement = document.querySelector("[dataPreviousOperand]");
const currentOperandTextElement = document.querySelector("[dataCurrentOperand]");
const decimalButton = document.querySelector("[dataNumber][id='decimal']");

let resultDisplayed = false; // Tracks whether a result is currently displayed

// Helper function to update the current operand
const updateCurrentOperand = (value, resetResult = false) => {
    if (resetResult && resultDisplayed) {
        currentOperandTextElement.textContent = ""; // Clear display for a new calculation
        resultDisplayed = false;
    }
    // Append the value to the display
    currentOperandTextElement.textContent += value;
    
    // Enable or disable the decimal button based on the current operand only
    const currentInput = currentOperandTextElement.textContent.split(/[+\-*/%]/).pop(); // Get the last operand
    // Disable decimal button only if the current operand has a decimal
    decimalButton.disabled = currentInput.includes("."); 
};

// Helper function to reset calculator state
const resetCalculator = () => {
    previousOperandTextElement.textContent = "";
    currentOperandTextElement.textContent = "0";
    decimalButton.disabled = false;
    resultDisplayed = false;
};

// Handle number button clicks
numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        updateCurrentOperand(button.textContent, true);
    });
});

// Handle operator button clicks
operationButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Prevent consecutive operators
        if(/[/+\-*/%]$/.test(currentOperandTextElement.textContent)) return; 
        // Append the operator
        updateCurrentOperand(button.textContent, false);
        // Re-enable the decimal button for the second number
        decimalButton.disabled = false;
    });
});

// Handle all clear button
allClearButton.addEventListener("click", resetCalculator);

// Allow users to toggle the sign of the current operand
plusOrMinusButton.addEventListener("click", () => {
    const value = parseFloat(currentOperandTextElement.textContent);
    currentOperandTextElement.textContent = value ? (value * -1).toString() : '0';
});

// Allow users to undo their last input if they click the wrong number
backspaceButton.addEventListener("click", () => {
    currentOperandTextElement.textContent = currentOperandTextElement.textContent.slice(0, -1) || '0'; // Ensure the display never becomes empty
    // Check if the decimal should be re-enabled
    decimalButton.disabled = !currentOperandTextElement.textContent.includes(".");
});

// Handle equals button
equalsButton.addEventListener("click", () => {
    // Show original expression in the previous operand display
    previousOperandTextElement.textContent = currentOperandTextElement.textContent;
    
    const expression = currentOperandTextElement.textContent.trim();

    // Regular expression to match numbers and operators
    const numberPattern = /\d+(\.\d+)?|\.\d+/g; // Matches numbers with or without leading zeros
    const operatorPattern = /[+\-*/%]/g; // Matches valid operators

    // Reset resultDisplayed when starting a new calculation
    if (resultDisplayed) {
        resultDisplayed = false;
    }

    // Extract numbers and operators from the current element
    const numbers = expression.match(numberPattern).map(Number) || [];
    const operators = expression.match(operatorPattern) || [];

    if(numbers.length < 2 || !operators) {
        currentOperandTextElement.textContent = "Error: Incomplete input" // Handle incomplete input
        return;
    }

    // Perform calculation
    let result = numbers[0];
    for(let i = 0; i < operators.length; i++) {
        const nextNumber = numbers[i + 1];
        const operator = operators[i];

        switch(operator) {
            case "+":
                result = parseFloat((result + nextNumber).toFixed(10)); // Ensure precision for addition
                break;
            
            case "-":
                result = parseFloat((result - nextNumber).toFixed(10)); // Ensure precise subtraction
                break;

            case "*":
                result = parseFloat((result * nextNumber).toFixed(10)); // Ensure precision for multiplication
                break;

            case "/":
                if(nextNumber === 0) {
                    currentOperandTextElement.textContent = "Error: Cannot divide by 0" // Prevent division by zero
                    return;
                }
                result = parseFloat((result / nextNumber).toFixed(10)); // Ensure precision for division
                break;

            case "%":
                result = parseFloat((result % nextNumber).toFixed(10)); // Ensure precision for modulus
                break;

            default:
                currentOperandTextElement.textContent = "Error: Invalid operation";
                return;
        }
    }

    // Displays the result
    // Adjust "10" for desired precision
    currentOperandTextElement.textContent = parseFloat(result.toFixed(10)); // Fix floating-point precision issues
    resultDisplayed = true; // Set the state to indicate a result is displayed

    // Re-enable the decimal button and mark result as displayed
    decimalButton.disabled = false;
    resultDisplayed = true;
});

// Addition Function
const add = (a, b) => {
    return a + b;
};

// Subtraction Function
const subtract = (a, b) => {
    return a - b;
};

// Multiplication Function
const multiply = (a, b) => {
    return a * b;
};

// Division Function
const divide = (a, b) => {
    if(b === 0) {
        return "Error: Division by zero is not allowed.";
    }
    return a / b;
};

// Handle keyboard inputs 
document.addEventListener("keydown", (event) => { 
    const key = event.key; // Get the key that was pressed 
    
    // Numbers (0-9) and decimal point 
    if (!isNaN(key) || key === ".") { 
        if (key === "." && currentOperandTextElement.textContent.includes(".")) return; // Prevent multiple decimals 
        updateCurrentOperand(key, true); 
    } 

    // Operators (+, -, *, /, %) 
    if (["+", "-", "*", "/", "%"].includes(key)) { 
        if (/[+\-*/%]$/.test(currentOperandTextElement.textContent)) return; // Prevent consecutive operators 
        updateCurrentOperand(key, false); 
    } 

    // Backspace (delete the last character) 
    if (key === "Backspace") { 
        backspaceButton.click(); 
    } 

    // Clear (Escape key clears the display) 
    if (key === "Escape") { 
        allClearButton.click(); 
    } 

    // Equals (Enter key calculates the result)
    if (key === "Enter" || key === "=") { 
        equalsButton.click(); 
    }
});