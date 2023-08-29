// To fetch profile photo when page loads
window.addEventListener('load', fetchUserProfilePhoto);

const menu =document.querySelector('.menu-icon');

let navbarr=document.querySelector('.navbar');
menu.onclick = () => {
   menu.classList.toggle("changed");
   
   navbarr.classList.toggle('open');
}

const wrapper =document.querySelector('.signup-login');
const loginPopup =document.querySelectorAll('#login-popup');
const loginPopout =document.querySelector('.icon-close');
const loginPopinBlur =document.querySelector('.blur-overlay');
const loginBtn =document.querySelector('.login-link');
const registerBtn =document.querySelector('.register-link');
const guideonlyprop =document.querySelectorAll('.input-field.guide');
const selUsertype =document.getElementById("usertype");

selUsertype.addEventListener('change',function(){
   if (this.value=='user') {
      
      guideonlyprop.forEach((a)=>{a.style.display='none';
      })
   }else{
   
      guideonlyprop.forEach((a)=>{
        a.style.display='block';
      })
   }
});


registerBtn.addEventListener('click',()=>{
   wrapper.classList.add('active'); 

});
loginBtn.addEventListener('click',()=>{
   wrapper.classList.remove('active'); 
   
});
loginPopup.forEach((a)=>{
   a.addEventListener('click',()=>{
      console.log("gggggg")
      wrapper.classList.add('active-popup'); 
      loginPopinBlur.classList.add('active');
      
   });
})
loginPopout.addEventListener('click',()=>{
   wrapper.classList.remove('active-popup'); 
   wrapper.classList.remove('active');
   loginPopinBlur.classList.remove('active');
   
});
loginPopinBlur.addEventListener('click',()=>{
   wrapper.classList.remove('active-popup'); 
   wrapper.classList.remove('active');
   loginPopinBlur.classList.remove('active');
   
});


let confpw = document.getElementById("conf-pw");
let pw=document.getElementById('pw');
let reqDiv=document.querySelector('.incorrect-pw');
confpw.onblur=function(){
   
if(confpw.value.length !=0){
   if(pw.value!=confpw.value){
      document.querySelector('.incorrect-pw').style.display='block';}
   if(pw.value==confpw.value){
      document.querySelector('.incorrect-pw').style.display='none';}
}
}
confpw.onfocus=function(){
 document.querySelector('.incorrect-pw').style.display='none';}

let navbar=document.querySelectorAll('ul.navbar > li > a');
navbar.forEach(function (a) {
  a.addEventListener('click',()=>{
   navbar.forEach(function (a){
      a.classList.remove('active');
   })
  a.classList.add('active');
  });

});

document.querySelectorAll('.btn.enroll').forEach(function(a){
a.addEventListener('click',()=>{
   wrapper.classList.add('active-popup'); 
   loginPopinBlur.classList.add('active');
   
});
});




function showMessage() {
   const citySelect = document.getElementById('city');
   const selectedCity = citySelect.value;
   const message = document.getElementById('popup')
   if (selectedCity !== 'San Francisco') {
       message.classList.add("open-popup");
   }
}

function closeMessage() {
   const message = document.getElementById('popup')
   message.classList.remove("open-popup");
}

function showFutureUpdate() {
   const message = document.getElementById('popup')
   message.classList.add("open-popup");
}


          
function fetchUserProfilePhoto() {
   fetch('/getUserProfilePhoto')
   .then(response => response.json())
   .then(result => {
      if (result) {
         const userProfilePhoto = document.getElementById('userProfilePhoto');
         const profilePicture = atob(result.photo);
         userProfilePhoto.src = `data:image/jpeg;base64,${profilePicture}`;
      }
      })
      .catch(error => {
         console.log(error);
      });
   }
          
         
         
 
 
