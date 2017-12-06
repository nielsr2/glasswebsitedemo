// NOTE: vi bør overveje nedenstående
//		document.addEventListener("DOMContentLoaded", lazyload());
let filterList = new Array();
// *************************************************************************************************************** LOAD GALLERY-->
var galleri;
async function loadGallery() {
	let template = document.querySelector("#galleriTemplate");
	let parent = document.querySelector("#itemSection");
	let galleriObj = await fetch("http://rearrangingly.com/KEA/raad/wp-json/wp/v2/galleri?per_page=100");
	galleri = await galleriObj.json();
	console.log(galleri);
	let show;
	let vars;
	let url;
	let sort;
	galleri.forEach(function (billede, index) {
		let clone = template.cloneNode(true).content;
		//					modalClick(index);
		clone.querySelector(".itemImg").dataset.item_id = billede.id;
		clone.querySelector(".itemImg").setAttribute("data-src", billede.acf.billede);
		clone.querySelector(".itemImg").onclick = modalClick;
		let descrip = billede.content.rendered.replace(/<(?:.|\n)*?>/gm, '');
		clone.querySelector(".itemDescription").textContent = cap(descrip);
		console.log("niiiiib", descrip);
		let kat = billede.acf.kategori;
		console.log("kategories", kat);
		clone.querySelector(".borderWrapper").classList.add(kat);
		if (filterList.includes(kat) == !true) {
			filterList.push(billede.acf.kategori);
		}
		url = new URL(window.location.href);
		vars = new URLSearchParams(url.search);
		sort = vars.get("sort");
		show = vars.get("show");
		if (sort == "all" || sort == null) {
			console.log(" all or null");
			parent.appendChild(clone);
		}
		else if (kat == sort) {
			parent.appendChild(clone);
			console.log("sorting: " + kat + sort);
		}
	});
	if (show !== null) {
		modalURL(show);
	}
	else {
		console.log("no show");
	}
	loadFilter(filterList);
	var myLazyLoad = new LazyLoad;
}
//       *************************************************************************************************************** MODAL URL
function modalURL(show) {
	let obj = galleri.find(function (element) {
		return element.id == show;
	});
	console.log(obj);
	document.querySelector("#modalDescription").textContent = obj.content.rendered.replace(/<(?:.|\n)*?>/gm, '');
	document.querySelector("#modalImage").setAttribute("src", obj.acf.billede);
	document.querySelector("#modalWindow").style.visibility = "visible";
}
//       *************************************************************************************************************** MODAL CLICK
function modalClick(index) {
	console.log("index", index);
	let item_id = index.currentTarget.dataset.item_id;
	window.history.pushState(null, null, "?show=" + item_id);
	let obj = galleri.find(function (element) {
		return element.id == item_id
	});
	console.log(obj);
	document.querySelector("#modalDescription").textContent = obj.content.rendered.replace(/<(?:.|\n)*?>/gm, '');
	document.querySelector("#modalImage").setAttribute("src", obj.acf.billede);
	document.querySelector("#modalWindow").style.visibility = "visible";
	console.log(index);
}
//       *************************************************************************************************************** CLOSE EVENT HANDLER
document.querySelector("#modalClose").addEventListener("click", function closeModal() {
	console.log("closed modal..");
	document.querySelector("#modalWindow").style.visibility = "hidden";
});
//       *************************************************************************************************************** LOAD FILTER
function loadFilter() {
	let template = document.querySelector("#filterTemplate");
	let parent = document.querySelector("#filterContainer");
	console.log(filterList);
	filterList.forEach(function (filter) {
		let clone = template.cloneNode(true).content;
		clone.querySelector(".filterItem").textContent = filter;
		clone.querySelector(".filterLink").setAttribute("href", "galleri.html" + "?sort=" + filter);
		parent.appendChild(clone);
	});
}
loadGallery();

function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);

}
