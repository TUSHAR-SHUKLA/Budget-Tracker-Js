const form = document.querySelector(".add");
const incomeList = document.querySelector("ul.income-list")
const expenseList = document.querySelector("ul.expense-list")
const balance = document.getElementById("balance"); 
const income = document.getElementById("income"); 
const expense = document.getElementById("expense"); 


let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")): [] ;


function updateStatistics(){
   const updatedIncome = transactions.filter(transaction=>transaction.amount > 0
   ).reduce((total,transaction)=>
    total+=Number(transaction.amount)
   ,0)

   const updatedExpense = transactions.filter(transaction=>{
    return transaction.amount < 0;
   }).reduce((total,transaction)=>
    total+=Math.abs(Number(transaction.amount))
   ,0)

    balance.textContent=updatedIncome-updatedExpense;
    income.textContent=updatedIncome;
    expense.textContent=updatedExpense;
}
updateStatistics();


function generateTemplate(id,source,amount,time){
    return `<li data-id="${id}" >
        <p><span>${source}</span>
        <span id="time">${time}</span>
        </p>
        <span>$${Math.abs(amount)}</span>
        <i class="bi bi-trash delete">
        </li>`;
}
function addTransactionDOM(id, source, amount, time){
    if(amount > 0){
        incomeList.innerHTML+= generateTemplate(id,source,amount,time)
    }else{
        expenseList.innerHTML+=generateTemplate(id,source,amount,time)
    }
}

function addTransaction(source,amount){
    const time = new Date();
    const transaction = {
        id:Math.floor(Math.random()*1000)+1,
        source: source,
        amount: amount,
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    };

    transactions.push(transaction)
    localStorage.setItem("transactions",JSON.stringify(transactions))

    // insetion of li
    addTransactionDOM(transaction.id, source, amount, transaction.time);


}

form.addEventListener("submit",(event)=>{
    event.preventDefault();
    if(form.source.value.trim()==="" || form.amount.value===""){ 
        alert("Enter Proper Values!!!")
    }else{
    addTransaction(form.source.value, form.amount.value)
    updateStatistics();
    form.reset();
    }
})

function getTransactions(){
    transactions.forEach(transaction =>{
        addTransactionDOM(transaction.id, transaction.source, transaction.amount, transaction.time)
    })
}
getTransactions();

function deleteTransaction(id){
    transactions=transactions.filter(transaction =>{
        return transaction.id!==Number(id);
    })
    // console.log(transactions);
    localStorage.setItem("transactions", JSON.stringify(transactions))
}

incomeList.addEventListener('click',(event)=>{
    console.log(event.target);
    if(event.target.classList.contains("delete")){
        // console.log(event.target.parentElement.dataset.id);
        event.target.parentElement.remove();
        deleteTransaction(event.target.parentElement.dataset.id)
        updateStatistics();
    }
})
expenseList.addEventListener('click',(event)=>{
    

    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
         deleteTransaction(event.target.parentElement.dataset.id)
        updateStatistics();

        
    }
})

