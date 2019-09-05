import 'normalize.css'
import './index.css'

(() => {
  const timer = document.getElementById('timer')

  setInterval(() => {
    timer.textContent = `${new Date().toTimeString().split(' ')[0]}`
  }, 1000)
})()