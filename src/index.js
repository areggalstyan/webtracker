let currentPage = 'view';

const passwordInput = document.querySelector('.password');

passwordInput.setAttribute('placeholder', generatePassword());

const addPageButton = document.querySelector('.add-page-btn');
const viewPageButton = document.querySelector('.view-page-btn');
const add = document.querySelector('.add');
const view = document.querySelector('.view');

addPageButton.addEventListener('click', () => {
    if (currentPage === 'add') return;

    view.classList.remove('container-active');
    viewPageButton.classList.remove('page-btn-active');
    add.classList.add('container-active');
    addPageButton.classList.add('page-btn-active');
    currentPage = 'add';
});

viewPageButton.addEventListener('click', () => {
    if (currentPage === 'view') return;

    add.classList.remove('container-active');
    addPageButton.classList.remove('page-btn-active');
    view.classList.add('container-active');
    viewPageButton.classList.add('page-btn-active');
    currentPage = 'view';
});

const generateButton = document.querySelector('.generate-btn');

generateButton.addEventListener('click', () => {
    passwordInput.value = generatePassword();
});

const viewContent = document.querySelector('.view-content');

const os = require('os');
const fs = require('fs');
const folder = `${os.homedir()}/.webtracker`;

if (!fs.existsSync(folder)) fs.mkdirSync(folder);

const websites = {};

fs.readdirSync(folder).forEach(file => {
    const website = JSON.parse(fs.readFileSync(`${folder}/${file}`, 'utf-8'));
    websites[website.name] = website;
});

const search = document.querySelector('.search');

search.addEventListener('input', renderView);

renderView();

const addButton = document.querySelector('.add-btn');
const nameInput = document.querySelector('.name');
const urlInput = document.querySelector('.url');
const emailInput = document.querySelector('.email');

addButton.addEventListener('click', () => {
    const website = {
        name: nameInput.value,
        url: urlInput.value,
        email: emailInput.value,
        password: passwordInput.value
    };

    fs.writeFileSync(`${folder}/${nameInput.value}.json`, JSON.stringify(website));
    websites[website.name] = website;
    renderView();
});

async function copyEmail(name) {
    await navigator.clipboard.writeText(websites[name].email);
}

async function copyPassword(name) {
    await navigator.clipboard.writeText(websites[name].password);
}

function deleteWebsite(name) {
    fs.unlinkSync(`${folder}/${name}.json`);
    delete websites[name];
    renderView();
}

function addWebsiteToView({ name, url, email, password }) {
    const element = document.createElement('div');
    element.className = "website";
    element.innerHTML = `
        <h3 class="website-title">${name} (<a href="${url}" target="_blank">${url}</a>)</h3>
        <h5>${email} (${password})</h5>
        <h6 class="copy" onclick="copyEmail('${name}')">COPY EMAIL</h6>
        <h6 class="copy" onclick="copyPassword('${name}')">COPY PASSWORD</h6>
        <h6 class="delete" onclick="deleteWebsite('${name}')">DELETE</h6>
    `;
    viewContent.appendChild(element);
}

function renderView() {
    clearView();

    for (let key in websites) {
        const value = search.value.toLowerCase();

        if (value.trim() === '') {
            addWebsiteToView(websites[key]);
            continue;
        }

        const { name, url, email, password } = websites[key];

        if (name.toLowerCase().includes(value)
            || url.toLowerCase().includes(value)
            || email.toLowerCase().includes(value)
            || password.toLowerCase().includes(value)) {

            addWebsiteToView(websites[key]);
        }
    }
}

function generatePassword() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let password = "";

    for (let i = 0; i < 12; i++) {
        let random = Math.floor(Math.random() * chars.length);
        password += chars.substring(random, random + 1);
    }

    return password;
}

function clearView() {
    document.querySelectorAll('.website').forEach(website => website.remove());
}
