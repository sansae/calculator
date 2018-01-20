$(document).ready(function(){
  var buttons = "#1, #2, #3, #4, #5, #6, #7, #8, #9, #zero, #divide, #times, #plus, #minus, #dot, #equals";
  var accumulator = "";
  var copy = "";
  var popped = "";
  var result = "";
  var defaultText = 0;
  var decimalPresent = false;
  var lastButton = accumulator.slice(-1);
  var symbols = ["−", "+", "×", "÷"];
  $("#result").text(defaultText);
  $("#accumulator").text(defaultText);

  $(buttons).click(function() {
    var text = $(this).text();
    if (text.match(/\d/g) || (text == "." && !result.includes("."))) {
      result += text;
      $("#result").text(result);
    } else if (symbols.includes(text)) {
      result = "";
      $("#result").text(text);
    }

    var lastAccumulatorElement = accumulator[accumulator.length - 1]
    var isSymbol = symbols.includes(text);
    var noSymbol = !symbols.includes(lastAccumulatorElement);
    var accumulatorNotEmpty = accumulator != "";

    if (isSymbol && noSymbol && accumulatorNotEmpty) {
      if (lastAccumulatorElement == ".") {
        accumulator = "";
      } else {
        accumulator += text;
        decimalPresent = false;
      }
    } else if (text.match(/\d/g)) {
      accumulator += text;
    } else if (result[result.length - 1] == "." && !decimalPresent) {
      decimalPresent = true;
      accumulator += text;
    }

    $("#accumulator").text(accumulator);
  });//end #buttons

  $("#ac").click(function() {
    defaultText = 0;
    accumulator = "";
    result = "";
    $("#result").text(defaultText);
    $("#accumulator").text(defaultText);
    decimalPresent = false;
  })

  var getLastNumber = function(accum) {
    var accumArr = accum.split("");
    var lastNumber = [];
    for (var i = accumArr.length - 1; i >= 0; i--) {
      if (!symbols.includes(accum[i])) {
        lastNumber.unshift(accum[i]);
      } else {
        break;
      }
    }
    return lastNumber.join("");
  };

  $("#ce").click(function() {
    result = result.slice(0, -1);
    if (accumulator != "") {
      copy = JSON.parse(JSON.stringify(accumulator));
      copy = copy.split("");
      popped = copy.pop();
      if (popped == ".") {
        decimalPresent = false;
      }

      accumulator = accumulator.slice(0, -1);
      if (symbols.includes(popped)) {
        result = getLastNumber(accumulator);
        if (result.includes(".")) {
          decimalPresent = true;
        }
      }
      $("#accumulator").text(accumulator);
    }

    $("#result").text(result);

    if (accumulator == "") {
      $("#result").text(defaultText);
      $("#accumulator").text(defaultText);
    }
  })//end ce

  var calculateInput = function(string) {
    var symbolsRegex = /[+,\−,÷,×]/g;
    var numbers = string.split(symbolsRegex);
    var symbols = string.match(/[^\d.]+/g)
    var result = parseFloat(numbers[0]);

    for (var i = 1; i < numbers.length; i++) {
      for (var j = 0; j < symbols.length; j++) {
        var number = parseFloat(numbers[i]);
        if (symbols[j] == "+") {
          result += number;
        } else if (symbols[j] == "−") {
          result -= number;
        } else if (symbols[j] == "÷") {
          result /= number;
        } else if (symbols[j] == "×") {
          result *= number;
        }
        symbols.shift();
        break;
      }
    }
    return parseFloat(result.toFixed(9));
  };//end calculateInput()

  $("#equals").click(function() {
    result = calculateInput(accumulator);
    $("#result").text(result);
    $("#accumulator").text(result);
    accumulator = result;
  })
});
