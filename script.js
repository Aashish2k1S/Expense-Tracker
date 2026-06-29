// #region selectors 
const
    body = document.body,
    main = document.querySelector('main');

const
    loginSignup = document.querySelector('.loginSignup'),
    loginSignupForm = document.querySelector('#loginSignupForm'),
    loginSignupTitle = document.querySelector('.loginSignupTitle'),
    loginSignupHead = document.querySelector('.loginSignupHead'),
    loginSignupUsername = document.querySelector('.loginSignupUsername'),
    loginBtn = document.querySelector('#loginBtn'),
    signupBtn = document.querySelector('#signupBtn'),
    spanBottom = document.querySelector('#spanBottom'),
    anchor = document.querySelector('#anchor');

const
    hero = document.querySelector('.hero');

const
    dashboard = document.querySelector('#dashboard'),
    userId = document.querySelector('#userId'),
    userName = document.querySelector('#userName'),
    // theme = document.querySelector('#theme'),
    addTran = document.querySelector('#addTran'),
    logout = document.querySelector('#logout');

const
    graph = document.querySelector('#myChart'),
    themeSwitch = document.querySelector('#themeToggler'),
    reset = document.querySelector('#reset');


const
    setting = document.querySelector('#setting');

// #endregion selectors 


// #region to be removed
// setting.style.display = 'none';
// dashboard.style.display = 'block';

// // setting.style.display = 'block';
// // dashboard.style.display = 'none';

// hero.style.display = 'flex';
// main.style.display = "none";
// body.classList.toggle('dark');
// #endregion to be removed

theme.style.display = 'none';

function User(id, username, password, isDark = false, currency = `inr`, transactions = [], isLoggedIn = false) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.isDark = Boolean(isDark);
    this.currency = currency;
    this.transactions = transactions;
}
function Transaction(id, amount, type, category, date, description) {
    this.id = id;
    this.amount = amount;
    this.type = type;
    this.category = category;
    this.date = date;
    this.description = description;
}

const
    currency = [`usd`, `eur`, `gbp`, `inr`, `jpy`],
    type = [`income`, `expense`],
    category = [`Food & Dining`, `Shopping`, `Recharge`, `Petrol & Auto`, `Utilities`, `Salary`, `Entertainment`, `Other`];

let userData = [];

if (localStorage.getItem('userData')) userData = JSON.parse(localStorage.getItem('userData'));


function themeToggle(flag) {
    if (flag) {
        body.classList.add('dark')
        // theme.innerHTML = `<i class="ri-sun-fill"></i>`;
        themeSwitch.setAttribute('checked', 'true');
    }
    else {
        body.classList.remove('dark')
        // theme.innerHTML = `<i class="ri-moon-fill"></i>`;
        themeSwitch.removeAttribute('checked');
    }
}


function register(event) {
    event.preventDefault();
    let
        username = event.target[0].value,
        password = event.target[1].value;

    // console.log(username);
    // console.log(password);

    let usernameTaken = userData.filter((user) => user.username === username).length;
    if (usernameTaken) {
        alert('username already exists!!!');
        return;
    }

    let newUserID = 1;
    if (userData.length > 0) newUserID = Math.max(...userData.map(user => user.id)) + 1;

    const newUser = new User(newUserID, username, password);

    userData.push(newUser);
    localStorage.setItem('userData', JSON.stringify(userData));

    alert('Registration successful!');
    authToggle(false);
}

function login(event) {
    event.preventDefault();
    let
        username = event.target[0].value,
        password = event.target[1].value;

    // console.log(username);
    // console.log(password);

    let userCheck = userData.filter((user) => (user.username === username && user.password === password));

    if (!userCheck.length) {
        alert('Invalid username or password!!!');
        return;
    }
    let
        idx = userData.indexOf(userCheck[0]),
        userID = userCheck[0].id;

    userData[idx].isLoggedIn = true;
    localStorage.setItem('userData', JSON.stringify(userData));

    render(userID);

    // alert('logged in successfully');
    authToggle(false);
}


function render(id) {
    let idx = userData.findIndex((user) => user.id === id);    

    hero.style.display = "flex";
    main.style.display = "none";

    themeToggle(userData[idx].isDark);

    userId.textContent = id;
    userName.textContent = userData[idx].username;

    let transaction = userData[idx].transactions;
    graphrender(transaction);
}


function graphrender(transactions) {
    let income = 0, expense = 0;

    if (transactions.length) {
        income = transactions.filter((e) => e.type === 'income').reduce((a, b) => a + b.amount, 0);
        expense = transactions.filter((e) => e.type === 'expense').reduce((a, b) => a + b.amount, 0);
    }

    const ctx = graph.getContext('2d');
    const existingChart = Chart.getChart(ctx);
    if (existingChart) existingChart.destroy();

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [''],
            datasets: [
                { label: 'Income', data: [income], backgroundColor: 'rgba(69, 168, 69, 0.8)' },
                { label: 'Expenses', data: [expense], backgroundColor: 'rgba(153, 27, 27, 0.8)' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'top' } },
            scales: { x: { title: { display: true, text: 'Income vs Expenses' } } }
        }
    });
}

function pageLoad() {
    let user = userData.filter((user) => user.isLoggedIn);
    if (!user.length) {
        hero.style.display = "none";
        main.style.display = "flex";
        themeToggle(false);
        return;
    }
    else {
        render(user[0].id);
        return;
    }
}

pageLoad();



function authToggle(flag) {
    loginSignupForm.reset();
    loginSignupTitle.textContent =
        (flag ? "Create Account" : "Welcome Back");
    loginSignupHead.textContent =
        (flag ? "Join FinTrack Pro" : "Login to FinTrack Pro");
    loginSignupUsername.textContent =
        (flag ? "Choose a Username" : "Username");

    loginBtn.style.display = (flag ? 'none' : 'block');
    signupBtn.style.display = (flag ? 'block' : 'none');

    spanBottom.textContent =
        (flag ? 'Already have an account?' : 'Don\'t have an account?');
    anchor.textContent = (flag ? 'Login here' : 'Register here');
}




loginSignupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log(e);
    // if (e.target.matches('#loginBtn')) {

    if (e.submitter.matches('#loginBtn')) login(e);
    else if (e.submitter.matches('#signupBtn')) register(e);

});

anchor.addEventListener('click', () => authToggle(anchor.textContent.toLowerCase() === 'register here'));


logout.addEventListener('click', () => {
    let idx = userData.findIndex((user) => user.id === Number(userId.textContent));
    userData[idx].isLoggedIn = false;
    localStorage.setItem('userData', JSON.stringify(userData)); 
    themeToggle(false);

    hero.style.display = "none";
    main.style.display = "flex";
});


// theme.addEventListener('click', themeToggle);
themeSwitch.addEventListener('change', (e) => {
    let idx = userData.findIndex((user) => user.id === Number(userId.textContent));
    userData[idx].isDark = e.target.checked;
    localStorage.setItem('userData', JSON.stringify(userData));
    themeToggle(e.target.checked);
});


reset.addEventListener('click', () => {
    let consent = confirm('Are sure you want to delete entire transaction history?');
    if (!consent) return;

    let idx = userData.findIndex((user) => user.id === Number(userId.textContent));
    userData[idx].transactions = [];
    localStorage.setItem('userData', JSON.stringify(userData));
});