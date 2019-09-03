import 'normalize.css'
import './index.css'

(() => {
  const app = document.getElementById('app')

  const welcome = document.createElement('h2')
  welcome.innerText = "Welcome! The current time is:"
  app.appendChild(welcome)

  const timer = document.createElement('h1')
  app.appendChild(timer)

  setInterval(() => {
    timer.textContent = `${new Date().toTimeString().split(' ')[0]}`
  }, 1000)
})()