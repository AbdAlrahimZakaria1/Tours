/* eslint-disable */
import { login, logout } from './login';
import { displayMap } from './mapbox';

// DOM
const map = document.getElementById('map');
const formLogin = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');

// VALUES

// DELEGATIONS
if (map) {
  const locations = JSON.parse(map.dataset.locations);
  displayMap(locations);
}

if (formLogin) {
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
