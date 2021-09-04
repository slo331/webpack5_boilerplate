import './styles/main.scss'

import 'core-js/stable'
import $ from 'jquery';

import example from './images/sample.jpg'
import exampleSVG from './images/sample.svg'

// Create a class property without a constructor
class Game {
  name = 'Violin Charades'
}
const myGame = new Game()
// Create paragraph node
const p = document.createElement('p')
p.textContent = `I like ${myGame.name}.`

// Create heading node
const heading = document.createElement('h1')
heading.textContent = 'Interesting!'

// Append heading node to the DOM
// const app = document.querySelector('#root')
// app.appendChild(heading)
const app = $('#root');
app.append(heading);
console.log('YAY!!!');