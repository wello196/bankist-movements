'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];


// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);




//create usernames

const createUsernames=function(accounts){
  //loop over accounts
  accounts.forEach(user=>{
    //add new property in object and compute it
    user.userName=user.owner.toLowerCase().split(' ').map(v=>v[0]).join('')
    console.log(user.userName)
  })
}

createUsernames(accounts)

//login
let currentAccount;
let timer;
btnLogin.addEventListener('click',function(e){
  e.preventDefault();
  currentAccount=accounts.find(acc=>acc.userName===inputLoginUsername.value&&acc.pin===Number(inputLoginPin.value))
  labelWelcome.textContent=`Welcome Back, ${currentAccount.owner.split(' ').at(0)}`
  if(timer) clearInterval(timer);
  timer=startLogoutTimer()
  fullDate(currentAccount)
  displayMovements(currentAccount);
  displayBalance(currentAccount);
  displaySummary(currentAccount);

  containerApp.style.opacity=1;
  inputLoginUsername.value=inputLoginPin.value='';
  

})




//movements
function displayMovements(accounts,sort=false){
  
  containerMovements.innerHTML=''
  const combinedMovsDates=accounts.movements.map((mov,i)=>{
    return{
      movement:mov,
      movementTime:accounts.movementsDates[i],
    }
  })
  console.log(combinedMovsDates)
  if(sort){
    combinedMovsDates.sort((a,b)=>{
      return a.movement-b.movement
    })
  }
  combinedMovsDates.forEach((obj,i)=>{
    const{movement,movementTime}=obj
    const movementsDate=new Date(movementTime);
    const movDate=dayPassedFun(movementsDate,Date.now());

    const type=movement>0?'deposit':'withdrawal'
    const html=`<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__date">${movDate}</div>
          <div class="movements__value">${new Intl.NumberFormat(currentAccount.locale,{
  style: 'currency',
  currency: currentAccount.currency,
}).format(movement.toFixed(2))}</div>
        </div>`;
        containerMovements.insertAdjacentHTML('afterbegin',html)
  })
}

//total balance

function displayBalance(accounts){
   accounts.balance = accounts.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${new Intl.NumberFormat(currentAccount.locale,{style:'currency',currency:currentAccount.currency}).format(accounts.balance.toFixed(2))}`;
}


//summary
function displaySummary(accounts){
  const income=accounts.movements.filter(mov=>mov>0).reduce((acc,curr)=>acc+curr,0);
  labelSumIn.textContent=`${new Intl.NumberFormat(currentAccount.locale,{style:'currency',currency:currentAccount.currency}).format(income.toFixed(2))}`
  const outcome=accounts.movements.filter(mov=>mov<0).reduce((acc,curr)=>acc+curr,0);
  labelSumOut.textContent=`${new Intl.NumberFormat(currentAccount.locale,{style:'currency',currency:currentAccount.currency}).format(Math.abs(outcome.toFixed(2)))}`
  const interest=accounts.movements.filter(mov=>mov>0).map(mov=>(mov*accounts.interestRate)/100).reduce((acc,curr)=>acc+curr,0);
  labelSumInterest.textContent=`${new Intl.NumberFormat(currentAccount.locale,{style:'currency',currency:currentAccount.currency}).format(interest.toFixed(2))}`//`${interest.toFixed(2)}$`

}


//transfer money

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Number(inputTransferAmount.value);
  const reciever=accounts.find(user=>inputTransferTo.value===user.userName);
  console.log(amount,reciever)
  if(amount>0 && reciever.userName !== currentAccount.userName && currentAccount.balance>=amount){
    currentAccount.movements.push(-amount);
    reciever.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    reciever.movementsDates.push(new Date().toISOString());
    displayMovements(currentAccount);
    displayBalance(currentAccount);
    displaySummary(currentAccount);
    containerApp.style.opacity=1;
  }
  inputTransferTo.value='';
  inputTransferAmount.value='';
  
})

btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Number(inputLoanAmount.value);
  if(currentAccount.movements.some(mov=>mov>=amount*0.1)&& amount>0){
    setTimeout(function(){
      currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    displayMovements(currentAccount);
    displayBalance(currentAccount);
    displaySummary(currentAccount);

    },3000)
    
    
    containerApp.style.opacity=1;
  }
  inputLoanAmount.value='';
})

btnClose.addEventListener('click',function(e){
  e.preventDefault();
  if(inputClosePin.value==currentAccount.pin && inputCloseUsername.value==currentAccount.userName){
    const index= accounts.findIndex(user=>user.userName===currentAccount.userName);
    accounts.splice(index,1);
    containerApp.style.opacity=0;
    inputClosePin.value=inputCloseUsername.value='';
  }
}
)

btnSort.addEventListener('click',function(e){
 e.preventDefault();
 displayMovements(currentAccount,true);
})




const group=Object.groupBy(accounts,mov=>{
  const movLength=mov.movements.length;
  if(movLength<=5){
    return 'small';
  }else if(movLength>6 && movLength<10){
    return 'medium';
  }else{
    return 'large';
  }
})
console.log(group)


/////////////////////////////////////////////////

//dates


function dayPassedFun(date1,date2){
  const day=`${date1.getDate()}`.padStart(2,0)
    const month=`${date1.getMonth()+1}`.padStart(2,0)
    const year=`${date1.getFullYear()}`
  const dayPassed=Math.trunc((date2-date1) / (1000 * 60 * 60 * 24))
  let movDate;
    if (dayPassed === 0) movDate = `Today`;
     else if (dayPassed === 1) movDate = `Yesterday`;
    else if (dayPassed <= 7) movDate = `${dayPassed} days ago`;
     else movDate = `${day}/${month}/${year}`;
  return movDate
}

function fullDate(accounts){
   const now=new Date();
  const options={
  hour:'numeric',
  minute:'numeric',
  day:'numeric',
  month:'long',
  year:'numeric',
  weekday:'long',
}

labelDate.textContent=new Intl.DateTimeFormat(currentAccount.locale,options).format(now);
}


const startLogoutTimer=function(){
  let time=120;
  const timer=setInterval(function(){
    const min=`${Math.trunc(time / 60)}`.padStart(2, '0');
    const sec=`${time % 60}`.padStart(2, '0');;
    labelTimer.textContent=`${min}:${sec}`;
    
    if(time===0){
      clearInterval(timer);
      containerApp.style.opacity=0;
    }
    time--;
  },1000)

  return timer;
  
}
