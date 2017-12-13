// TOGGLE BURGER MENU
function onLoad() {
	//    if (window.innerWidth <= 768) {
	function toggleMenu() {
		document.querySelector(".burger").classList.toggle("change");
		document.querySelector("nav").classList.toggle("show");
	}
	document.querySelector(".burger").addEventListener("click", toggleMenu);
	document.querySelector("ul").addEventListener("click", toggleMenu);
	// }
}
document.addEventListener("DOMContentLoaded", function (event) {
	onLoad();
});
