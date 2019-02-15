/* eslint-disable no-throw-literal */
/* eslint-disable no-unused-vars */

function generateWinningNumber() {
  return Math.ceil(Math.random() * 100)
}

function shuffle(array) {
  // loop from start to end
  for (let i = array.length - 1; i > 0; i -= 1) {

    // pick index to shuffle
    let s = Math.floor(Math.random() * (i + 1))
    // swap

    let temp = array[i]
    array[i] = array[s]
    array[s] = temp
  }
  return array
}

class Game {
  constructor() {
    this.playersGuess = null
    this.pastGuesses = []
    this.winningNumber = generateWinningNumber()
  }

  difference() {
    return Math.abs(this.playersGuess - this.winningNumber)
  }

  isLower() {
    return this.playersGuess < this.winningNumber
  }

  playersGuessSubmission(n) {
    if (n < 1 || n > 100 || typeof n !== 'number') {
      throw 'That is an invalid guess.'
    } else {
      this.playersGuess = n
      return this.checkGuess()
    }
  }

  checkGuess() {
    // win case
    if (this.playersGuess === this.winningNumber) {
      return 'You Win!'
    // already guessed...
    } else if (this.pastGuesses.includes(this.playersGuess)) {
      return 'You have already guessed that number.'
    // if not already guessed
    } else {
      // add to guesses...
      this.pastGuesses.push(this.playersGuess)
    }

    // have we lost?
    if (this.pastGuesses.length === 5) {
      return 'You Lose.'
    }

    // calculate difference and return
    let diff = this.difference()
    if (diff < 10) {
      return 'You\'re burning up!'
    } else if (diff < 25) {
      return 'You\'re lukewarm.'
    } else if (diff < 50) {
      return 'You\'re a bit chilly.'
    } else if (diff < 100) {
      return 'You\'re ice cold!'
    }
  }

  provideHint() {
    let hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()]
    hintArray = shuffle(hintArray)
    return hintArray
  }

}

function newGame() {
  return new Game()
}

