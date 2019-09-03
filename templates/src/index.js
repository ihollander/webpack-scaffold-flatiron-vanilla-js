import 'normalize.css'
import './styles/app.css'

(() => {
  const app = document.getElementById('app');

  setInterval(() => {
    app.textContent = `${new Date().toTimeString().split(" ")[0]}`
  }, 1000)
})()