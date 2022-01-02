// Mark LaFreniere
// Last Modified: 12/2/2021

function checkLogin(){

    const username = document.querySelector('#usernameIn').value;
    const password = document.querySelector('#passwordIn').value;
    const paramUrl = `../pages/newsfeed?username=${username}`;
    const url = "http://localhost:3000/login";
    const param = `?username=${username}&password=${password}`;

    const fetchObject = {
        method: 'GET',
        headers: {
            'Content-Type': 'text/html'
        }    
    };

    // don't allow empty fields
    if((username === "") || (password === "")){
        alert("Please insert a username and password");
    }
    else{
        // fetch to see if username and password match
        fetch(url + param, fetchObject)
            .then(response => response.json())
            .then(jsonObject =>{
                console.log(jsonObject.message)
                // if a match, send to newfeed
                if(jsonObject.message === 'direct'){
                    window.location.href = paramUrl;
                }
                else{
                    alert("Username or password are incorrect");
                }
            });  
    }

}

// start function
function start(){
    // activate login button
    const loginButton = document.querySelector('#loginSubmit');
    loginButton.onclick = checkLogin;
}

window.onload = start;