// Mark LaFreniere
// Last Modified: 12/2/2021

// process of account creation
function createAnAccount(){
    
    const username = document.querySelector('#usernameCreate').value;
    const password1 = document.querySelector('#passwordCreate1').value;
    const password2 = document.querySelector('#passwordCreate2').value;
    const url = "http://localhost:3000/create-user";

    const dataObject = {
        username,
        password1
    }

    const fetchObject = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(dataObject)
    };

    // if passwords don't match, return function
    if(password1 != password2){
        alert("Your passwords do not match");
        return;
    }

    // if a field is empty, return function
    if((username === "") || (password1 === "") || (password2 === "")){
        alert("Please insert a username and confirm your password");
        return;
    }

    // fetch sending with account info
    fetch(url, fetchObject)  
        .then(response => response.json())
        .then(jsonObject => {
            console.log(jsonObject.message);
            //if account is created, go to login page
            if(jsonObject.message === 'created'){
                alert('Account successfully created!');
                window.location.href = "../index.html";
            }
            else {
                alert('An account already exists with this username');
            }
        });

}

// start function
function start(){
    // activate submit button
    const createAccount = document.querySelector('#createSubmit');
    createAccount.onclick = createAnAccount;
}

window.onload = start;