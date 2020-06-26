"use strict";

var elements = {
  countSpan: document.querySelector('header .count span'),
  mainHeading: document.querySelector('main h3'),
  answers: document.querySelector('main .answers'),
  btn: document.querySelector('.container main .footer .btn'),
  bullets: document.querySelector('.bullets'),
  spans: '',
  footer: document.querySelector('.container main .footer'),
  result: document.querySelector('.result'),
  selectBox: document.getElementById('cat')
};
var selected = elements.selectBox.options[elements.selectBox.selectedIndex].text;
var counter = 0;
var correct = 0;
var xhr = new XMLHttpRequest();
xhr.open('GET', "json/".concat(selected, ".json"), true);
xhr.send();
elements.selectBox.addEventListener('change', function () {
  selected = elements.selectBox.options[elements.selectBox.selectedIndex].text;
  xhr.open('GET', "json/".concat(selected, ".json"), true);
  xhr.send();
});

xhr.onreadystatechange = function () {
  if (xhr.status === 200 && xhr.readyState === 4) {
    theResponse = JSON.parse(xhr.responseText); // get and put the count in the DOM

    elements.countSpan.innerText = theResponse.length; // create bullets

    for (var i = 0; i < theResponse.length; i++) {
      var span = document.createElement('span');
      elements.bullets.insertAdjacentElement('beforeend', span);
    }

    elements.spans = document.querySelectorAll('.bullets span'); // get the question

    theQuestion = theResponse[counter];
    questionRender(theQuestion); // add click event to the button

    elements.btn.addEventListener('click', function () {
      submitBtn(theQuestion.right_answer);

      if (counter !== theResponse.length - 1) {
        // get next Question
        counter++;
        theQuestion = theResponse[counter];
        questionRender(theQuestion);
      } else {
        printResult();
      }
    });
  }
};

function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function questionRender(obj) {
  elements.mainHeading.innerText = obj.title;
  elements.answers.innerHTML = '';

  for (var i = 1; i <= 4; i++) {
    var el = "\n    <div>\n      <input type=\"radio\" id=\"answer_".concat(i, "\" name=\"question\" data-answer=\"").concat(obj["answer_".concat(i)], "\" ").concat(i === 1 ? "checked" : "", ">\n      <label for=\"answer_").concat(i, "\">").concat(htmlEntities(obj["answer_".concat(i)]), "</label>\n    </div>\n    ");
    elements.answers.insertAdjacentHTML('beforeend', el);
  }

  elements.spans[counter].classList.add('on');
}

function submitBtn(answer) {
  var choices = document.querySelectorAll('main .answers input');
  choices.forEach(function (el) {
    if (el.checked) {
      if (el.dataset.answer == answer) {
        correct++;
      }
    }
  });
}

function printResult() {
  elements.mainHeading.remove();
  elements.answers.innerHTML = '';
  elements.footer.innerText = '';
  var p = "\n    <p>You passed in <span>".concat(correct, "</span> out of <span>").concat(counter + 1, "</span> Questions</p>\n  ");
  elements.result.innerHTML = p;
}
//# sourceMappingURL=main.dev.js.map
