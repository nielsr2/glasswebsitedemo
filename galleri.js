// NOTE: vi bør overveje nedenstående
document.addEventListener("DOMContentLoaded", loadGallery());
let filterList = new Array();
// ************************************************************************************************************* LOAD GALLERY-->
var galleri;
let sort;
let desktop = ifDesktop();
async function loadGallery() {
    let template = document.querySelector("#galleriTemplate");
    let parent = document.querySelector("#itemSection");
    let galleriObj = await fetch("http://rearrangingly.com/KEA/raad/wp-json/wp/v2/galleri?per_page=100");
    galleri = await galleriObj.json();
    console.log(galleri);
    let show;
    let vars;
    let url;
    let kat;
    galleri.forEach(function (billede, index) {
        let clone = template.cloneNode(true).content;
        //					modalClick(index);
        clone.querySelector(".itemImg").dataset.item_id = billede.id;
        //		getThumb(billede.acf.billede);
        clone.querySelector(".itemImg").setAttribute("data-src", getThumb(billede.acf.billede));
        clone.querySelector(".itemImg").onclick = modalClick;
        let descrip = billede.content.rendered.replace(/<(?:.|\n)*?>/gm, '');
        //                clone.querySelector(".itemDescription").textContent = cap(descrip);
        //                console.log("niiiiib", descrip);
        kat = billede.acf.kategori;
        //                console.log("kategories", kat);
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
    if (show == null || show == "none") {
        console.log("no show");
    }
    else if (show !== null) {
        console.log("show", show);
        modalURL(show);
    }
    loadFilter(filterList);
    var myLazyLoad = new LazyLoad;
}
//       ************************************************************************************************************* MODAL URL
function modalURL(show) {
    let obj = galleri.find(function (element) {
        return element.id == show;
    });
    console.log(obj);
    document.querySelector("#modalDescription").textContent = obj.content.rendered.replace(/<(?:.|\n)*?>/gm, '');
    document.querySelector("#modalImage").setAttribute("src", obj.acf.billede);
    document.querySelector("#modalWindow").style.visibility = "visible";
    document.querySelector("#modalClose").style.visibility = "visible";
    document.querySelector("nav").style.visibility = "hidden";
    document.querySelector("footer").style.display = "none";
}
//       ************************************************************************************************************* MODAL CLICK
function modalClick(index) {
    document.querySelector("nav").style.visibility = "hidden";
    document.querySelector("footer").style.display = "none";
    console.log("index", index);
    let item_id = index.currentTarget.dataset.item_id;
    window.history.pushState(null, null, "?show=" + item_id);
    let obj = galleri.find(function (element) {
        return element.id == item_id
    });
    console.log(obj);
    document.querySelector("#modalDescription").textContent = obj.content.rendered.replace(/<(?:.|\n)*?>/gm, '');
    document.querySelector("#modalImage").style.backgroundImage = "url(" + obj.acf.billede + ")";
    document.querySelector("#modalWindow").style.visibility = "visible";
    document.querySelector("#modalClose").style.visibility = "visible";
    console.log(index);
}
//       ************************************************************************************************************* CLOSE EVENT HANDLER
document.querySelector("#modalClose").addEventListener("click", function closeModal() {
    console.log("closed modal..");
    window.history.replaceState(null, null, "?show=" + "none");
    document.querySelector("#modalWindow").style.visibility = "hidden"
    document.querySelector("#modalClose").style.visibility = "hidden";
    document.querySelector("nav").style.visibility = "visible";
    document.querySelector("footer").style.display = "grid";
});
//       ************************************************************************************************************* LOAD FILTER
function loadFilter() {
    let template = document.querySelector("#filterTemplate");
    let parent = document.querySelector("#filterContainer");
    console.log(filterList);
    filterList.forEach(function (filter) {
        let clone = template.cloneNode(true).content;
        clone.querySelector(".filterRow").setAttribute("id", filter);
        clone.querySelector(".filterItem").textContent = filter;
        clone.querySelector(".filterItem").setAttribute("id", "H" + filter);
        clone.querySelector(".filterLink").setAttribute("href", "galleri.html" + "?sort=" + filter);
        parent.appendChild(clone);
    });
    // check if desktop
    if (sort !== null && desktop == false) {
        document.querySelector("#" + sort).appendChild(document.getElementById("itemSection"));
    }
    else if (sort == null && desktop == false) {
        document.querySelector("#itemSection").style.display = "none";
    }
    if (desktop == true) {
        let fil = document.querySelector("#filterContainer");
    }
    if (sort !== null) {
        document.querySelector("#H" + sort).classList.add("selected");
    }
}
// takes string as input, capitalize character at index 0, first letter, and concatenates with the slice of string, starting at index 1.
function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
//       ************************************************************************************************************* IF DESKTOP
function ifDesktop() {
    console.log(window.innerWidth);
    if (window.innerWidth <= 1024) {
        //                console.log("FALSE");
        return false;
    }
    else {
        //                console.log("TRUE");
        return true;
    }
}
//       ************************************************************************************************************* GET THUMB
function getThumb(filename) {
    let ext = filename.split('.').pop();
    let rest = filename.split('.' + ext).shift();
    return rest + "-300x300." + ext;
}
