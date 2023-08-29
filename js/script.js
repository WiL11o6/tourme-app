const menu =document.querySelector('.menu-icon');

let navbarr=document.querySelector('.navbar');
menu.onclick=()=>{
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



