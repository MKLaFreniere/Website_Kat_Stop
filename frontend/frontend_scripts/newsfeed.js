// Mark LaFreniere
// Last Modified: 12/2/2021

// retrieve info from url query string
const urlSearchParams = new URLSearchParams(window.location.search);
const username = urlSearchParams.get('username');

// send user to their own profile page
function directToOwnProfile() {
    const param = username;
    const paramUrl = `../pages/profile?username=${username}&profilename=${param}`;
    window.location.href = paramUrl;
}

// send user to a profile page that's not their own
function directToOtherProfile(param){
    const paramUrl = `../pages/profile?username=${username}&profilename=${param}`;
    window.location.href = paramUrl;
}

// start function
function start() {

    let rightBar = document.querySelector('#rightBar');
    const profileUrl ="http://localhost:3000/fetchotherposts";
    const url = "http://localhost:3000/fetchprofile";
    const param = `?username=${username}`;

    const fetchObject = {
        method: 'GET',
        headers: {
            'Content-Type': 'text/html'
        }    
    };

   // fetch profile data for taskbar
    fetch(url + param, fetchObject)
            .then(response => response.json())
            .then(jsonObject =>{
                // Write profile data into html
               rightBar.innerHTML = `<img src="../images/${jsonObject.image}" alt="Profile Image" height="100" width="100">
                                        <input type="button" id="usernameDisplay" value="${username}">
                                        <form action="../index.html">
                                            <input type="submit" id="logout" value="Logout">
                                        </form>`;
               let usernameDisplayer = document.querySelector('#usernameDisplay');
               usernameDisplayer.onclick = directToOwnProfile;
            }); 

    // fetch posts
    fetch(profileUrl, fetchObject)
            .then(response => response.json())
            .then(jsonObject =>{
                // get the length of the jsonObject
                let count = Object.keys(jsonObject).length;
                // Write profile data into html
                // for loop used to write every post retrieved
                for(let i = 0; i < count; i++){
                      postArea.innerHTML += `<div id="post">
                                                <div id="postHeader">
                                                    <img src="../images/${jsonObject[i].image}" alt="Profile Image" height="70" width="70">
                                                    <input type="button" id="postWriter" class="postUser" value="${jsonObject[i].username}">
                                                    <h3 id="date">${jsonObject[i].date}</h3>
                                                </div>
                                                <p>${jsonObject[i].body}</p>
                                             </div>`
                }
                // make sure every post's ability to direct its respective profile page is available
                let postUsername = document.querySelectorAll('.postUser');
                for(let i = 0; i < postUsername.length; i++){
                    postUsername[i].onclick = function() {
                        directToOtherProfile(this.value);
                    }
                }                
            });   
}

window.onload = start;