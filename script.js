
// #region selectors 
const
    body = document.body,
    main = document.querySelector('main');

const
    loginSignup = document.querySelector('.loginSignup'),
    form = document.querySelector('form'),
    loginSignupTitle = document.querySelector('.loginSignupTitle'),
    loginSignupHead = document.querySelector('.loginSignupHead'),
    loginSignupUsername = document.querySelector('.loginSignupUsername'),
    loginBtn = document.querySelector('#loginBtn'),
    signupBtn = document.querySelector('#signupBtn'),
    spanBottom = document.querySelector('#spanBottom'),
    anchor = document.querySelector('#anchor');

const
    hero = document.querySelector('.hero'),
    theme = document.querySelector('#theme'),
    addTran = document.querySelector('#addTran'),
    logout = document.querySelector('#logout');

const
    graph = document.querySelector('#myChart');
// #endregion selectors 


// #region to be removed
hero.style.display = 'flex';
main.style.display = "none";
body.classList.toggle('dark');
// #endregion to be removed



function User(id, name, password, isDark, transactions) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.isDark = Boolean(isDark);
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



function themeToggle() {
    if (body.classList.toggle('dark')) {
        theme.innerHTML = `<i class="ri-sun-fill"></i>`;
    }
    else {
        theme.innerHTML = `<i class="ri-moon-fill"></i>`;
    }
}

function graphrender() {
    const ctx = graph.getContext('2d');

    // console.log(Chart);


    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [''],
            datasets: [
                {
                    label: 'Income',
                    data: [999],
                    backgroundColor: 'rgba(69, 168, 69, 0.8)', 
                    barThickness: 50, 
                    barPercentage: 0.6
                },
                {
                    label: 'Expense',
                    data: [888],
                    backgroundColor: 'rgba(153, 27, 27, 0.8)', 
                    barThickness: 50, 
                    barPercentage: 0.6
                }
            ]             
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true, 
                    position: 'top'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Income Vs Expense'
                    }
                },
                y: { beginAtZero: true }
            }
        }
    });
}

function render() {
    graphrender();
}


function pageLoad() {
    render();
}

pageLoad();



function toggle(flag) {
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
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log(e);
    // if (e.target.matches('#loginBtn')) {

    if (e.submitter.matches('#loginBtn')) {
        // alert('login');
        hero.style.display = "flex";
        main.style.display = "none";
        form.reset();
        render();
    }
    else if (e.submitter.matches('#signupBtn')) {
        // alert('signup');
        toggle(false);
        form.reset();
    }
});
anchor.addEventListener('click', () => {
    toggle(anchor.textContent.toLowerCase() === 'register here');
});
theme.addEventListener('click', themeToggle);
logout.addEventListener('click', () => {
    hero.style.display = "none";
    main.style.display = "flex";
});


