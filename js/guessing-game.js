/* eslint-disable no-throw-literal */
/* eslint-disable no-unused-vars */

// makes a new game state
function gameStateFactory() {
  return {
    guesses: [],
    secret: Math.ceil(Math.random() * 100),
    playing: true,
    message: '[enter] to submit guess',
    messageColor: 'darkgrey',
  }
}

// state updater after hint requested
function makeHint(state) {
  let array = [state.secret, Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 100)]

  // shuffle
  for (let i = array.length - 1; i > 0; i -= 1) {
    let s = Math.floor(Math.random() * (i + 1))
    let temp = array[i]
    array[i] = array[s]
    array[s] = temp
  }

  // set message in state
  state.message = array.join(' ')
  return
}

// state updater after player guess
// eslint-disable-next-line complexity
function processGuess(state, guess) {
  guess = Number(guess)

  // invalid guess
  if (guess < 1 || guess > 100 || isNaN(guess)) {
    state.message = 'Invalid guess.'
    state.messageColor = 'darkgrey'
    return
  }

  // win case
  else if (guess === state.secret) {
    state.message = `You win! The number was ${state.secret}.`
    state.messageColor = 'limegreen'
    state.playing = false
    return
  }

  // repeat guess
  else if (state.guesses.includes(guess)) {
    state.message = 'Repeat guess.'
    state.messageColor = 'darkgrey'
    return
  }

  // process as a valid non-winning guess
  else {
    // add to guess list
    state.guesses.push(guess)

    // out of guesses?
    if (state.guesses.length >= 5) {
      state.message = `You lose. The number was ${state.secret}.`
      state.messageColor = 'crimson'
      state.playing = false
      return
    }

    // higher or lower?
    if (guess < state.secret) {
      state.message = 'Too low, '
      state.messageColor = 'darkgrey'
    } else {
      state.message = 'Too high, '
      state.messageColor = 'darkgrey'
    }

    // Add warmth message
    let diff = Math.abs(state.secret - guess)
    if (diff < 10) {
      state.message += 'but you\'re burning up!'
    } else if (diff < 25) {
      state.message += 'but you\'re lukewarm.'
    } else if (diff < 50) {
      state.message += 'and you\'re a bit chilly.'
    } else if (diff < 100) {
      state.message += 'and you\'re ice cold.'
    }
  }
  return
}

// Globals for page elements
const inputBox = document.querySelector('#guess')
const msgBox = document.querySelector('#status_message')
const guessBox = document.querySelector('#previous_guesses_box')
const guessesLeftText = document.querySelector('#guesses_left')
const submitButton = document.querySelector('#submit')
const restartButton = document.querySelector('#restart')
const hintButton = document.querySelector('#hint')

// update views
function updateView(state) {

  // update guesses left
  let guessWordArray = [
    'Zero guesses left',
    'One guess left',
    'Two guesses left',
    'Three guesses left',
    'Four guesses left',
    'Five guesses left'
  ]
  guessesLeftText.innerHTML = guessWordArray[5 - state.guesses.length]

  // update previous guesses
  if (state.guesses.length > 0) {
    // sort them
    state.guesses.sort((a, b) => a - b)

    // add up/down arrows
    let guessDisplayArray = []
    state.guesses.forEach(g => {
      if (g < state.secret) {
        guessDisplayArray.push('>' + String(g))
      } else {
        guessDisplayArray.push('<' + String(g))
      }
    })

    // display
    guessBox.innerHTML = `Previous guesses: ${guessDisplayArray.join(' ')}`
  } else {
    guessBox.innerHTML = 'Previous guesses: none'
  }

  // update status message
  msgBox.innerHTML = state.message
  msgBox.setAttribute('style', `color: ${state.messageColor};`)

  // empty the guess box
  inputBox.value = ''

  // set the border on the restart button
  if (state.playing) {
    inputBox.disabled = false;
    submitButton.setAttribute('style', 'color: black;')
    hintButton.setAttribute('style', 'color: black;')
  } else {
    inputBox.disabled = true;
    submitButton.setAttribute('style', 'color: darkgrey;')
    hintButton.setAttribute('style', 'color: darkgrey;')
  }
}

// ----- START THE GAME -----
let state = gameStateFactory()
console.log('new game; state: ', state)
inputBox.focus();
updateView(state)

// Set up event handlers
submitButton.addEventListener('click', function (event) {
  if (state.playing) {
    processGuess(state, inputBox.value)
    updateView(state)
    console.log('submit clicked; state: ', state)
  }
})

restartButton.addEventListener('click', function (event) {
  state = gameStateFactory()
  updateView(state)
  inputBox.focus();
  console.log('restart clicked; state: ', state)
})

hintButton.addEventListener('click', function (event) {
  if (state.playing) {
    makeHint(state)
    updateView(state)
    console.log('hint clicked; state: ', state)
  }
})

window.onkeypress = function (event) {
  // get key code
  if (!event) event = window.event;
  let keyCode = event.keyCode || event.which;

  // if playing and enter pressed, submit
  if (state.playing && keyCode === 13) {
    processGuess(state, inputBox.value)
    updateView(state)
    console.log('enter hit; guess submitted; state: ', state)
  }

  // if won/lost and enter pressed, restart
  else if (!(state.playing) && keyCode === 13) {
    state = gameStateFactory()
    updateView(state)
    inputBox.focus();
    console.log('enter hit; restarting; state: ', state)
  }
}

