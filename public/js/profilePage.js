var lists = document.getElementsByClassName("lists");
console.log(lists)
// lists.forEach(item => {
//     item.addEventListener("click", () => {
//         console.log("list event")
//     })
// })
for (var i = 0; i < 7; i++) {
    if(i == 5) continue;
    lists[i].addEventListener("click", (event) => {
        // console.log(event.target.classList.contains("lists"))
        for (var i = 0; i < lists.length; i++) {
            lists[i].classList.remove("active-list")
        }
        if(event.target.classList.contains("lists")){
            event.target.classList.add("active-list")        
        }
        else{
            console.log(event.target.parentElement.classList.add("active-list"))
        }
        
        

    }, true)
}