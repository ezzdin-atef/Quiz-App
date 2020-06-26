const elements = {
  countSpan: document.querySelector('header .count span'),
  mainHeading: document.querySelector('main h3'),
  answers: document.querySelector('main .answers'),
  btn: document.querySelector('.container main .footer .btn'),
  bullets: document.querySelector('.bullets'),
  spans: '',
  footer: document.querySelector('.container main .footer'),
  result: document.querySelector('.result'),
  selectBox: document.getElementById('cat'),
};

let selected = elements.selectBox.options[elements.selectBox.selectedIndex].text;
let counter = 0;
let correct = 0;

const xhr = new XMLHttpRequest();
xhr.open('GET', `json/${selected}.json`, true);
xhr.send();

elements.selectBox.addEventListener('change', ()=> {
  selected = elements.selectBox.options[elements.selectBox.selectedIndex].text;
  xhr.open('GET', `json/${selected}.json`, true);
  xhr.send();
});

xhr.onreadystatechange = () => {
  if (xhr.status === 200 && xhr.readyState === 4) {
    
    theResponse = JSON.parse(xhr.responseText);

    // get and put the count in the DOM
    elements.countSpan.innerText = theResponse.length;

    // create bullets
    for (let i=0;i<theResponse.length;i++) {
      const span = document.createElement('span');
      elements.bullets.insertAdjacentElement('beforeend', span);
    }
    elements.spans = document.querySelectorAll('.bullets span');

    // get the question
    theQuestion = theResponse[counter];
    questionRender(theQuestion);


    // add click event to the button
    elements.btn.addEventListener('click', () => {
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
  for (let i=1;i<=4;i++) {
    let el = `
    <div>
      <input type="radio" id="answer_${i}" name="question" data-answer="${obj[`answer_${i}`]}" ${(i === 1)? `checked`: ``}>
      <label for="answer_${i}">${htmlEntities(obj[`answer_${i}`])}</label>
    </div>
    `;
    
    elements.answers.insertAdjacentHTML('beforeend', el);
  }

  elements.spans[counter].classList.add('on');
}

function submitBtn(answer) {
  let choices = document.querySelectorAll('main .answers input');
  choices.forEach(el => {
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
  let p = `
    <p>You passed in <span>${correct}</span> out of <span>${counter+1}</span> Questions</p>
  `;
  elements.result.innerHTML = p;
}