document.addEventListener("DOMContentLoaded", function () {
let email = document.getElementById("email");
let password=document.getElementById("password");
let btnLogn=document.getElementById("btn");


let signUpBtn=document.getElementById("signUp");
let emailignUP=document.getElementById("emailignUP");
let passwordSignUP=document.getElementById("passwordSignUP");
let user=document.getElementById("user");

// btnLogn.addEventListener("click",()=>{
    

// })
let users = JSON.parse(localStorage.getItem("user")) || []; 
signUpBtn.addEventListener("click", () => {
    if (!user.value || !emailignUP.value || !passwordSignUP.value) {
        alert("Please complete your data.");
    } else {
        let userData = {
            userName: user.value,
            email: emailignUP.value,
            password: passwordSignUP.value
        };

        users.push(userData); 

        localStorage.setItem("user", JSON.stringify(users)); 

        alert("Data stored successfully!");

        
        user.value = "";
        emailignUP.value = "";
        passwordSignUP.value = "";

       
        window.location.replace('./login.html');
    }
});

})