const API_URL = 'https://5dd3d5ba8b5e080014dc4bfa.mockapi.io/users/';
const DELETE_BTN_CLASS = 'delete-btn';
const EDIT_BTN_CLASS = 'edit-btn';
const INPUT_STRING = 'list_elements';
const STORAGE_KEY = 'usersList';

const inputForm = document.querySelector('.input_block');
const usersListEl = document.querySelector('.input_blocks');
const listTemplate = document.querySelector('.list_template').innerHTML;
const inputUsersEl = document.querySelectorAll('.input_elements');
const errorText = document.querySelector('.error');
const addBtn = document.querySelector('.input_btn');
const resultEl = document.querySelector('.input_blocks');

inputForm.addEventListener('submit', onUserFormSubmit);
usersListEl.addEventListener('click', onUsersListClick);

let usersList = [];

init();

function onUserFormSubmit(e) {
    e.preventDefault();

    const newUser = getUser();

    if (isUserElValid(newUser)) {
        addUser(newUser);
        resetForm();
        removeError();
    } else {
        showError();
    }
}

function getUser() {
    const users = {};

    inputUsersEl.forEach((inp) => {
        users[inp.name] = inp.value;
    });

    return users;
}

function setUser(users) {
    usersList.forEach((inp) => {
        inp.value = users[inp.name];
    });
}

function generateUserHtml(users) {
    return listTemplate.replace('{{id}}', users.id)
                        .replace('{{Name}}', users.name)
                        .replace('{{Email}}', users.email)
                        .replace('{{Phone_number}}', users.phone);
}

function isUserElValid(users) {
    return validateInput(users.name)
        && validateInput(users.surname)
        && validateInput(users.phone_number);
}

function validateInput(value) {
    return value !== '';
}

function addUser(users) {
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(users),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((data) => {
        fetchList();
    });
}

function init() {
    fetchList();
}

function fetchList() {
    fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
        usersList = data;
        renderList();
    });
}

function getUserID(el) {
    return el.closest('.' + INPUT_STRING).dataset.id;
}

function onUsersListClick(e) {
    const id = getUserID(e.target);

    if (e.target.classList.contains(DELETE_BTN_CLASS)) {
        fetch(API_URL + id, {
            method: 'DELETE',
        }).then((data) => {
            fetchList();
        });
    }

    if (e.target.classList.contains(EDIT_BTN_CLASS)) {
        fetch(API_URL + id, {
            method: 'PUT',
            body: JSON.stringify(getUser()),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((data) => {
            fetchList();
        });
    }
}

function renderList() {
    usersListEl.innerHTML = usersList.map(generateUserHtml).join('\n');
}

function resetForm() {
    inputForm.reset();
}

function showError() {
    errorText.classList.add('show');
}

function removeError() {
    errorText.classList.remove('show');
}