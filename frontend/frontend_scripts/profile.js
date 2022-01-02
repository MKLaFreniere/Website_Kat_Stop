// Mark LaFreniere
// Last Modified: 12/2/2021

// get information from url query string
const urlSearchParams = new URLSearchParams(window.location.search);
const username = urlSearchParams.get('username');
const profilename = urlSearchParams.get('profilename');

// direct user to their newsfeed
function toNewsFeed() {
    const paramUrl = `../pages/newsfeed?username=${username}`;
    window.location.href = paramUrl;
}

// open edit profile menu
function editProfile() {
    let box = document.querySelector('#editorBox');
    box.innerHTML = `<div>
                        <h3>EDIT HERE:</h3>
                    </div>
                    <div>
                        <label for="image">Pick a profile image:</label>
                        <select id="image">
                            <option value="lilkitty.jpg">Lil Kitty</option>
                            <option value="boredkitty.png">Bored Kitty</option>
                            <option value="crykitty.jpg">Cry Kitty</option>
                            <option value="curiouskitty.jpg">Curious Kitty</option>
                            <option value="cutekitty.jpg">Cute Kitty</option>
                            <option value="playkitty.jpg">Play Kitty</option>
                            <option value="DefaultProfile.png">Default</option>
                        </select><br>
                    </div>
                    <div>
                        <label for="bio">Bio:</label>
                        <textarea id="bio" placeholder=" -- up to 500 characters" maxlength=500></textarea><br>
                    </div>
                    <div>
                        <input type="button" id="submitB" value="Submit Changes"><br>
                    </div>
                    <div>
                        <input type="button" id="cancelB" value="Cancel Edit">
                    </div>`;
    // activate buttons in menu
    const submitter = document.querySelector('#submitB');
    submitter.onclick = submitChanges;
    const canceller = document.querySelector('#cancelB');
    canceller.onclick = cancel;

}

// submit profile changes to db
function submitChanges(){
    const imageGet = document.querySelector('#image').value;
    let bioGet = document.querySelector('#bio').value;
    const url = "http://localhost:3000/update-user";

    // if no bio is written, give default value
    if(bioGet === ''){
        bioGet = "(no bio)";
    }

    const dataObject = {
        username,
        imageGet,
        bioGet
    }

    const fetchObject = {
        method: 'PUT',
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(dataObject)
    };

    // fetch to update profile
    fetch(url, fetchObject)  
        .then(response => response.json())
        .then(jsonObject => {
            // if update is successful, reload page to display changes
            if(jsonObject.message === 'updated'){
                alert('Account successfully updated!');
                window.location.reload();
            }
            else {
                alert('Error occured while updating');
            }
        });

}

// remove edit or post menu
function cancel(){
    let box = document.querySelector('#editorBox');
    box.innerHTML = '';
}

// display post creation menu
function makePost(){
    let box = document.querySelector('#editorBox');
    box.innerHTML = `<div>
                        <h3>CREATE POST:</h3>
                    </div>
                    
                    <div>
                        <label for="postbody">Post:</label>
                        <textarea id="postbody" placeholder=" -- up to 500 characters" maxlength=500></textarea><br>
                    </div>
                    <div>
                        <input type="button" id="submitPost" value="Submit Post"><br>
                    </div>
                    <div>
                        <input type="button" id="cancelB" value="Cancel">
                    </div>`;
    // activate buttons on menu
    const submitter = document.querySelector('#submitPost');
    submitter.onclick = submitPost;
    const canceller = document.querySelector('#cancelB');
    canceller.onclick = cancel;
}

// submit post for db insertion
function submitPost() {
    const postsBody = document.querySelector('#postbody').value;
    const url = "http://localhost:3000/create-post";

    // make sure post body is active
    if(postsBody === ''){
        alert("You have a body to your post to submit");
        return;
    }

    const dataObject = {
        username,
        postsBody
    }

    const fetchObject = {
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(dataObject)
    };

    // fetch for db insertion
    fetch(url, fetchObject)  
        .then(response => response.json())
        .then(jsonObject => {
            // if post is successful, reload page to display changes
            if(jsonObject.message === 'made'){
                alert('Post Created!');
                window.location.reload();
            }
            else {
                alert('Error occured while posting');
            }
        });

}

// start function
function start(){

    const url = "http://localhost:3000/fetchprofile";
    const profileUrl ="http://localhost:3000/fetchprofileposts";
    const param = `?username=${profilename}`;
    let profileBox = document.querySelector('#profileBox');
    let statsBox = document.querySelector('#statsBox');
    let bioBox = document.querySelector('#bioBox');
    let optionsBox = document.querySelector('#optionsBox');
    let postArea = document.querySelector('#postArea');

    const fetchObject = {
        method: 'GET',
        headers: {
            'Content-Type': 'text/html'
        }    
    };

   // fetch profile data
    fetch(url + param, fetchObject)
            .then(response => response.json())
            .then(jsonObject =>{
                // Write profile data into html
                profileBox.innerHTML = `<img src="../images/${jsonObject.image}" alt="Profile Image" height="300" width="300">
                                        <h3 id="profileDisplay">${profilename}</h3>`;
                statsBox.innerHTML = `<h2>Posts</h2> <p>${jsonObject.posts}`;
                bioBox.innerHTML = `<h4>Bio:</h4> <p>${jsonObject.message}</p>`;
            });    

    // change button options depending on if you are on your own profile or not
    if(profilename === username){
        optionsBox.innerHTML = `<input type="button" id="toNewsfeed" value="Newsfeed"><br>
                                <input type="button" id="editProfile" value="Edit Profile"><br>
                                <input type="button" id="makePost" value="Post"><br>
                                <form action="../index.html">
                                    <input type="submit" id="logout" value="Logout">
                                </form>`;
        // activate said buttons
        const editProfileButton = document.querySelector('#editProfile');
        editProfileButton.onclick = editProfile;
        const createPost = document.querySelector('#makePost');
        createPost.onclick = makePost;
    }
    else{
        optionsBox.innerHTML = '<input type="button" id="toNewsfeed" value="Newsfeed">';
    }

    // set buttons that will always exist on the page
    const newsfeedButton = document.querySelector('#toNewsfeed');
    newsfeedButton.onclick = toNewsFeed;
    
    // fetch posts for profile page
    fetch(profileUrl + param, fetchObject)
            .then(response => response.json())
            .then(jsonObject =>{
                // find length of json object for for loop
                let count = Object.keys(jsonObject).length;
                // Write profile data into html
                // use for loop to write every post
                for(let i = 0; i < count; i++){
                     postArea.innerHTML += `<div id="post">
                                                <div id="postHeader">
                                                    <img src="../images/${jsonObject[i].image}" alt="Profile Image" height="70" width="70">
                                                    <h3 class="postuser">${jsonObject[i].username}</h3>
                                                    <h3 id="date">${jsonObject[i].date}</h3>
                                                </div>
                                                <p>${jsonObject[i].body}</p>               
                                            </div>`
                }
            });   
}

window.onload = start;