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
  selectBox: document.getElementById('cat'),
  categories: document.querySelector('header .cat')
};
var selected = elements.selectBox.options[elements.selectBox.selectedIndex].text;
var counter = 0;
var correct = 0;
var max_count = 10;
var theResponse;
var submitted = [];
var q = {
  question: '',
  your_answer: '',
  correct_answer: ''
};
var xhr = new XMLHttpRequest();
xhr.open('GET', "json/".concat(selected, ".json"), true);
xhr.send();
elements.selectBox.addEventListener('change', function () {
  counter = 0;
  correct = 0;
  selected = elements.selectBox.options[elements.selectBox.selectedIndex].text;
  xhr.open('GET', "json/".concat(selected, ".json"), true);
  xhr.send();
});

xhr.onreadystatechange = function () {
  if (xhr.status === 200 && xhr.readyState === 4) {
    theResponse = JSON.parse(xhr.responseText); // get the length

    var len = theResponse.length; // Shuffle the object

    for (var i = 0; i < len; i++) {
      var j = i + Math.round(Math.random() * (len - i - 1));
      var tmp = theResponse[j];
      theResponse[j] = theResponse[i];
      theResponse[i] = tmp;
    } // get and put the count in the DOM


    elements.countSpan.innerText = max_count; // create bullets

    elements.bullets.innerHTML = '';

    for (var _i = 0; _i < max_count; _i++) {
      var span = document.createElement('span');
      elements.bullets.insertAdjacentElement('beforeend', span);
    }

    elements.spans = document.querySelectorAll('.bullets span'); // get the question

    theQuestion = theResponse[counter];
    questionRender(theQuestion);
  }
}; // add click event to the button


elements.btn.addEventListener('click', function () {
  submitBtn(theQuestion.right_answer, theQuestion.title);
  elements.selectBox.disabled = true;

  if (counter !== max_count - 1) {
    // get next Question
    counter++;
    theQuestion = theResponse[counter];
    questionRender(theQuestion);
  } else {
    printResult();
  }
});

function questionRender(obj) {
  elements.mainHeading.innerText = obj.title;
  elements.answers.innerHTML = '';
  var len = Object.keys(obj).length;
  var start = Math.round(Math.random() * (len - 3));

  for (var i = (start + 1) % (len - 2);; i = (i + 1) % (len - 2)) {
    // Create the label
    var label = document.createElement('label');
    label.htmlFor = "answer_".concat(i + 1); // Create the input field

    var input = document.createElement('input');
    input.type = 'radio';
    input.id = "answer_".concat(i + 1);
    input.name = 'question';
    input.dataset.answer = "".concat(obj["answer_".concat(i + 1)]);
    if (i == (start + 1) % (len - 2)) input.checked = true;
    label.appendChild(input);
    label.appendChild(document.createTextNode("".concat(obj["answer_".concat(i + 1)])));
    label.appendChild(document.createElement('span'));
    elements.answers.insertAdjacentElement('beforeend', label);
    if (i === start) break;
  }

  elements.spans[counter].classList.add('current');
}

function submitBtn(answer, title) {
  var choices = document.querySelectorAll('main .answers input');
  choices.forEach(function (el) {
    if (el.checked) {
      if (el.dataset.answer == answer) {
        correct++;
        elements.spans[counter].classList.remove('current');
        elements.spans[counter].classList.add('on');
      } else {
        elements.spans[counter].classList.remove('current');
        elements.spans[counter].classList.add('off');
      } // Store the sumbitted answers in an object


      q = {
        'question': title,
        'your_answer': el.dataset.answer,
        'correct_answer': answer
      };
      submitted.push(q);
    }
  });
}

function printResult() {
  elements.mainHeading.remove();
  elements.answers.innerHTML = '';
  elements.footer.innerText = '';
  var p = "\n    <p>You passed in <span>".concat(correct, "</span> out of <span>").concat(counter + 1, "</span> Questions</p>\n  ");
  elements.result.innerHTML = p;
  submitted.forEach(function (el) {
    // create the main div
    var mainDiv = document.createElement('div');
    mainDiv.classList.add('questions-result'); // add the class which add the correct and wrong box

    if (el.your_answer === el.correct_answer) mainDiv.classList.add('right');else mainDiv.classList.add('wrong'); // create the h4

    var heading = document.createElement('h4');
    heading.appendChild(document.createTextNode(el.question));
    mainDiv.appendChild(heading); // create the first paragraph for the user answer

    var your_p = document.createElement('p');
    your_p.classList.add('your'); // the span

    var your_span = document.createElement('span');
    your_span.appendChild(document.createTextNode('Your Answer: '));
    your_p.appendChild(your_span); // append the span inside the first paragraph

    your_p.appendChild(document.createTextNode(el.your_answer)); // append the user answer in the paragraph

    mainDiv.appendChild(your_p); // apend the first paragraph in the mian div 
    // create the second paragraph for the correct answer

    var correct_p = document.createElement('p');
    correct_p.classList.add('correct'); // the span

    var correct_span = document.createElement('span');
    correct_span.appendChild(document.createTextNode('correct Answer: '));
    correct_p.appendChild(correct_span); // append the span inside the second paragraph

    correct_p.appendChild(document.createTextNode(el.correct_answer)); // append the correct answer in the paragraph

    mainDiv.appendChild(correct_p); // apend the second paragraph in the mian div 

    elements.result.insertAdjacentElement('beforeend', mainDiv);
  }); // add the refrech button

  var btn = document.createElement('button');
  btn.classList.add('btn');
  btn.appendChild(document.createTextNode('Start again :)'));

  btn.onclick = function () {
    location.reload();
  };

  elements.categories.appendChild(btn);
}

function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
//# sourceMappingURL=main.dev.js.map
