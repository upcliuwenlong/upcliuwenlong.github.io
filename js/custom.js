let mobile_sidebar_menus = document.getElementById("sidebar-menus");

mobile_sidebar_menus.style.borderRadius = '10px 0 0 10px'
mobile_sidebar_menus.style.width = '280px'
let menu_center_div = document.getElementsByClassName("site-data is-center")[0]
while (menu_center_div.hasChildNodes()) {
    menu_center_div.removeChild(menu_center_div.firstChild);
}
let msg =
    "<span style='font-weight:bold;font-size:20px;display:block;margin-top:-25px'>" +
    "Loong"+
    "</span>"+
    "<span style='font-weight:bold'>" +
    "因为热爱，所以坚持"+
    "</span>";
menu_center_div.insertAdjacentHTML("beforeend", msg);





