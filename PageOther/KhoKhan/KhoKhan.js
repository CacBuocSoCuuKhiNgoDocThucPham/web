document.addEventListener("click", function(event) {
    if (event.target.classList.contains('btnExample')) {
        let parent = event.target.closest(".col-auto");
        if (parent) {
            let bodyEx = parent.querySelector(".body-Example");
            if (bodyEx) {
                let link = parent.querySelector(".btnExample");
                if (bodyEx.style.display === "none" || bodyEx.style.display === "") {
                    bodyEx.style.display = "block";
                    link.style.textDecoration = "underline";
                } else {
                    bodyEx.style.display = "none";
                    link.style.textDecoration = "none";
                }
            }
        }
    }
    else {
        let bodyEx = document.querySelectorAll(".body-Example");
        let link = document.querySelectorAll(".btnExample");
        for(let i = 0 ;i < bodyEx.length; i++) {
            if(bodyEx[i].style.display == "block") {
                bodyEx[i].style.display = "none";
                link[i].style.textDecoration = "none";
            }
        }
    }
});
