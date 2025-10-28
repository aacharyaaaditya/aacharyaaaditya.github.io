let slideIndex = 0;
showSlides();

function showSlides() {
  let slides = document.getElementsByClassName("slide");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
    slides[i].classList.remove("active"); // remove active class
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  slides[slideIndex-1].style.display = "block";  
  slides[slideIndex-1].classList.add("active"); // add active to show caption
  setTimeout(showSlides, 4000); // Change image every 3 seconds
}
