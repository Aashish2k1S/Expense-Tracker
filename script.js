// #region selectors
const body = document.body,
    main = document.querySelector("main");

const loginSignup = document.querySelector(".loginSignup"),
    loginSignupForm = document.querySelector("#loginSignupForm"),
    loginSignupTitle = document.querySelector(".loginSignupTitle"),
    loginSignupHead = document.querySelector(".loginSignupHead"),
    loginSignupUsername = document.querySelector(".loginSignupUsername"),
    loginBtn = document.querySelector("#loginBtn"),
    signupBtn = document.querySelector("#signupBtn"),
    spanBottom = document.querySelector("#spanBottom"),
    anchor = document.querySelector("#anchor");

const hero = document.querySelector(".hero");

const
    dashboard = document.querySelector("#dashboard"),
    userId = document.querySelector("#userId"),
    userName = document.querySelector("#userName"),
    // theme = document.querySelector('#theme'),
    addTranBtn = document.querySelector("#addTranBtn"),
    logout = document.querySelector("#logout");

const
    amtBalance = document.querySelector('#amtBalance'),
    amtIncome = document.querySelector('#amtIncome'),
    amtExpense = document.querySelector('#amtExpense'), 
    cntTransaction = document.querySelector('#cntTransaction');


const graph = document.querySelector("#myChart"),
    themeSwitch = document.querySelector("#themeToggler"),
    reset = document.querySelector("#reset");

const
    seacrhInp = document.querySelector("#seacrhInp"),
    transactionsData = document.querySelector("#transactionsData");

const setting = document.querySelector("#setting");



const
    addTransaction = document.querySelector(".add-transaction-wrapper"),
    addTransactionForm = document.querySelector("#addTransactionForm"),
    addTransactionHead = document.querySelector("#addTransactionHead"),
    closeAddTransaction = document.querySelector(".add-transaction-close");


// #endregion selectors

// #region RMV to be removed
// setting.style.display = 'none';
// dashboard.style.display = 'block';

// // setting.style.display = 'block';
// // dashboard.style.display = 'none';

// hero.style.display = 'flex';
// main.style.display = "none";
// body.classList.toggle('dark');
// #endregion to be removed

theme.style.display = "none";

function User(
    id,
    username,
    password,
    isDark = false,
    currency = `inr`,
    transactions = [],
    isLoggedIn = false,
) {
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
    currency = { usd: `$`, eur: `€`, gbp: `£`, inr: `₹`, jpy: `¥` },
    type = [`income`, `expense`],
    category = [`Food & Dining`, `Shopping`, `Recharge`, `Petrol & Auto`, `Utilities`, `Salary`, `Entertainment`, `Other`];

let userData = [];

if (localStorage.getItem("userData"))
    userData = JSON.parse(localStorage.getItem("userData"));

function themeToggle(flag) {
    if (flag) {
        body.classList.add("dark");
        // theme.innerHTML = `<i class="ri-sun-fill"></i>`;
        themeSwitch.setAttribute("checked", "true");
    } else {
        body.classList.remove("dark");
        // theme.innerHTML = `<i class="ri-moon-fill"></i>`;
        themeSwitch.removeAttribute("checked");
    }
}

function register(event) {
    event.preventDefault();
    let username = event.target[0].value,
        password = event.target[1].value;

    // console.log(username);
    // console.log(password);

    let usernameTaken = userData.filter(
        (user) => user.username === username,
    ).length;
    if (usernameTaken) {
        alert("username already exists!!!");
        return;
    }

    let newUserID = 1;
    if (userData.length > 0)
        newUserID = Math.max(...userData.map((user) => user.id)) + 1;

    const newUser = new User(newUserID, username, password);

    userData.push(newUser);
    localStorage.setItem("userData", JSON.stringify(userData));

    alert("Registration successful!");
    authToggle(false);
}

function login(event) {
    event.preventDefault();
    let username = event.target[0].value,
        password = event.target[1].value;

    // console.log(username);
    // console.log(password);

    let userCheck = userData.filter(
        (user) => user.username === username && user.password === password,
    );

    if (!userCheck.length) {
        alert("Invalid username or password!!!");
        return;
    }
    let idx = userData.indexOf(userCheck[0]),
        userID = userCheck[0].id;

    userData[idx].isLoggedIn = true;
    localStorage.setItem("userData", JSON.stringify(userData));

    render(userID);

    // alert('logged in successfully');
    authToggle(false);
}

function render(id) {
    let idx = userData.findIndex((user) => user.id === id);

    hero.style.display = "flex";
    main.style.display = "none";

    userId.textContent = id;
    userName.textContent = userData[idx].username;

    addTransaction.style.display = 'none';
    addTransactionForm.reset();


    let 
        balance = 0, income = 0, 
        expense = 0, transactionCount = 0, 
        userCurrency = currency[userData[idx]];

    let transactions = userData[idx].transactions;

    console.log(transactions);
    

    if (transactions.length) {
        balance = transactions.map((tran) => (tran.type === 'income' ? tran.amount : -tran.amount)).reduce((a, b) => a + b, 0);
        income = transactions.map((tran) => (tran.type === 'income' ? tran.amount : 0)).reduce((a, b) => a + b, 0);
        expense = transactions.map((tran) => (tran.type === 'income' ? 0 : tran.amount)).reduce((a, b) => a + b, 0);
        transactionCount = transactions.length;
    }

    amtBalance.textContent = `${userCurrency} ${balance}`;
    amtIncome.textContent = `${userCurrency} ${income}`;
    amtExpense.textContent = `${userCurrency} ${expense}`;
    cntTransaction.textContent = `${transactionCount}`;

    let transaction = userData[idx].transactions;
    graphrender(transaction);
    themeToggle(userData[idx].isDark);

    seacrhInp.value = "";
    transactionRender(seacrhInp.value);
}

function graphrender(transactions) {
    let income = 0,
        expense = 0;

    if (transactions.length) {
        income = transactions
            .filter((e) => e.type === "income")
            .reduce((a, b) => a + b.amount, 0);
        expense = transactions
            .filter((e) => e.type === "expense")
            .reduce((a, b) => a + b.amount, 0);
    }

    const ctx = graph.getContext("2d");
    const existingChart = Chart.getChart(ctx);
    if (existingChart) existingChart.destroy();

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [""],
            datasets: [
                {
                    label: "Income",
                    data: [income],
                    backgroundColor: "rgba(69, 168, 69, 0.8)",
                },
                {
                    label: "Expenses",
                    data: [expense],
                    backgroundColor: "rgba(153, 27, 27, 0.8)",
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: "top" } },
            scales: {
                x: { title: { display: true, text: "Income vs Expenses" } },
            },
        },
    });
}
function transactionRender(search) {
    transactionsData.innerHTML = "";
    let idx = userData.findIndex(
        (user) => user.id === Number(userId.textContent),
    );
    let
        userCurrency = currency[userData[idx].currency],
        transactions = userData[idx].transactions || [];

    if (search.trim()) {
        transactions = transactions.filter((transaction) =>
            transaction.description
                .toLowerCase()
                .includes(search.toLowerCase()),
        );
    }

    if (!transactions.length) return;

    transactionsData.innerHTML = transactions
        .map((transaction) => {
            return `
                <tr>
                    <td style="display: none;">${transaction.id}</td>
                    <td>${transaction.date}</td>
                    <td>${transaction.description}</td>
                    <td>
                        <span class=${`"category-pill ${transaction.category.toLowerCase()}"`}>
                            ${transaction.category}
                        </span>
                    </td>
                    <td class=${`"${transaction.type.toLowerCase()}"`}>
                        ${transaction.type.toLowerCase() === "income" ? "+" : "-"}${userCurrency}${parseFloat(transaction.amount).toFixed(2)}
                    </td>
                    <td>
                        <span class="edit" onclick="edit(${transaction.id})" data-Id="${transaction.id}">
                            <i class="ri-pencil-fill"></i>
                        </span>
                        <span class="delete" onclick="del(${transaction.id})" data-Id="${transaction.id}">
                            <i class="ri-delete-bin-7-fill"></i>
                        </span>
                    </td>
                </tr>                
            `;
        })
        .join("");
}

function pageLoad() {
    let user = userData.filter((user) => user.isLoggedIn);
    if (!user.length) {
        hero.style.display = "none";
        main.style.display = "flex";
        themeToggle(false);
        return;
    } else {
        render(user[0].id);
        return;
    }
}

pageLoad();


function loadAddTransactionForm(tranID) {
    addTransactionForm.reset();



    if (tranID) {
        let idx = userData.findIndex((user) => user.id === parseInt(userId.textContent));

        transaction = userData[idx].transactions.filter((tran) => tran.id === tranID);

        if (!transaction.length) {
            addTransactionHead.textContent = "Add Transaction";
            addTransactionForm.reset();
            return;
        }

        addTransactionHead.textContent = "Edit Transaction";

        addTransactionForm[0].value = transaction[0].id;
        addTransactionForm[1].value = transaction[0].type;
        addTransactionForm[2].value = transaction[0].description;
        addTransactionForm[3].value = transaction[0].amount;
        addTransactionForm[4].value = transaction[0].date;
        addTransactionForm[5].value = transaction[0].category;

    }
    else {
        addTransactionHead.textContent = "Add Transaction";
        addTransactionForm[0].value = "0";
    }

    addTransaction.style.display = 'flex';
}



function edit(tranId) {
    loadAddTransactionForm(tranId);
}

function del(tranId) {
    let consent = confirm('Are you sure you want to delete this transaction?');
    if (!consent) return;

    if (!tranId) {
        alert('Transaction is invalid!!!');
        return;
    }

    let idx = userData.findIndex((user) => user.id === parseInt(userId.textContent));
    let tranIdx = userData[idx].transactions.findIndex((tran) => tran.id === tranId);
    userData[idx].transactions.splice(1, tranIdx);
    localStorage.setItem("userData", JSON.stringify(userData));
    render();
}

function submit(e) { //NTW on submit tranID is NaN 
    e.preventDefault();

    let idx = userData.findIndex((user) => user.id === parseInt(userId.textContent));



    let
        id = parseInt(e.target[0].value),
        type = e.target[1].value.toLowerCase(),
        description = e.target[2].value,
        amount = parseFloat(e.target[3].value).toFixed(2),
        date = e.target[4].value,
        category = e.target[5].value.toLowerCase();

    if (!id) {
        let maxTranID = userData[idx].transactions.map((tran) => tran.id).sort((a, b) => b - a)[0];
        id = maxTranID + 1;
    }

    if (!type || !description || !amount || !date || !category) {
        alert('Please fill all the fields!!!');
        return;
    }

    let transaction = new Transaction(id, amount, type, category, date, description);

    userData[idx].transactions.unshift(transaction);
    localStorage.setItem('userData', JSON.stringify(userData));

    render(userData[idx].id);
}

function authToggle(flag) {
    loginSignupForm.reset();
    loginSignupTitle.textContent = flag ? "Create Account" : "Welcome Back";
    loginSignupHead.textContent = flag
        ? "Join FinTrack Pro"
        : "Login to FinTrack Pro";
    loginSignupUsername.textContent = flag ? "Choose a Username" : "Username";

    loginBtn.style.display = flag ? "none" : "block";
    signupBtn.style.display = flag ? "block" : "none";

    spanBottom.textContent = flag
        ? "Already have an account?"
        : "Don't have an account?";
    anchor.textContent = flag ? "Login here" : "Register here";
}

function logOut() {
    let idx = userData.findIndex(
        (user) => user.id === Number(userId.textContent),
    );
    userData[idx].isLoggedIn = false;
    localStorage.setItem("userData", JSON.stringify(userData));
    themeToggle(false);

    hero.style.display = "none";
    main.style.display = "flex";
}

function resetAllData() {
    let consent = confirm(
        "Are sure you want to delete entire transaction history?",
    );
    if (!consent) return;

    let idx = userData.findIndex(
        (user) => user.id === Number(userId.textContent),
    );
    userData[idx].transactions = [];
    localStorage.setItem("userData", JSON.stringify(userData));
    render(userData[idx].id);
}

loginSignupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // console.log(e);
    // if (e.target.matches('#loginBtn')) {

    if (e.submitter.matches("#loginBtn")) login(e);
    else if (e.submitter.matches("#signupBtn")) register(e);
});

anchor.addEventListener("click", () => authToggle(anchor.textContent.toLowerCase() === "register here"));


addTranBtn.addEventListener("click", () => loadAddTransactionForm(0));
addTransactionForm.addEventListener("submit", (e) => submit(e));
closeAddTransaction.addEventListener("click", () => render(parseInt(userId.textContent)));


logout.addEventListener("click", () => logOut());

// theme.addEventListener('click', themeToggle);
themeSwitch.addEventListener("change", (e) => {
    let idx = userData.findIndex((user) => user.id === Number(userId.textContent));
    userData[idx].isDark = e.target.checked;
    localStorage.setItem("userData", JSON.stringify(userData));
    themeToggle(e.target.checked);
});

reset.addEventListener("click", () => resetAllData());

seacrhInp.addEventListener("keyup", (e) => transactionRender(e.target.value));


