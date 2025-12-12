
const bootstrapScript = document.createElement("script");
bootstrapScript.src = "js/bootstrap.bundle.min.css";
document.body.appendChild(bootstrapScript);

fetch("header.html")
    .then(response => response.text())
    .then(data => {
        const header = document.getElementById("header");
        if (header) header.innerHTML = data;
    });
fetch("footer.html")
    .then(response => response.text())
    .then(data => {
        const footer = document.getElementById("footer");
        if (footer) footer.innerHTML = data;
    });
document.addEventListener("DOMContentLoaded", function () {
    const myCarousel = document.querySelector('#myCarousel');
    if (myCarousel && window.bootstrap) {
        new bootstrap.Carousel(myCarousel, {
            interval: 3000, 
            ride: 'carousel'
        });
    }
});
const aosScript = document.createElement("script");
aosScript.src = "js/aos.js";  
aosScript.onload = () => {
    if (window.AOS) {
        AOS.init({
            once: true,
            duration: 700
        });
        AOS.refresh();
    }
};
document.body.appendChild(aosScript);


