// document.querySelector("form").addEventListener('submit', formsubmittion)

// let destName = null
// let destLocation = null
// function formsubmittion(e) {

//     destName = document.querySelector("#name").value;
//     destLocation = document.querySelector("#location").value;
//     let destDescription = document.querySelector("#description").value;
//     let form = document.querySelector("#form")

//     let wishCard = createWishlistCard(
//         destName,
//         destLocation,
//         destDescription
//     );
    let wishList = document.querySelector(".destinations")

    if (wishList.children.length >= 0) {
        document.querySelector(".vacation").innerHTML = "My Wishlist"
    }

//     document.querySelector(".destinations").appendChild(wishCard)

//     e.preventDefault();

//     form.reset();
// }

// // creating the actual cards for wishlist
// function createWishlistCard(name, location, description) {
//     // let card = document.createElement("div");
//     // card.setAttribute("class", "wishlistCard card col-md-3 h-100")


//     let image = document.createElement("img")
//     image.setAttribute("class", "card-img-top h-100")
//     card.appendChild(image)

//     // attributes of card ex. name, location description
//     // let cardAttributes = document.createElement("div")
//     // cardAttributes.setAttribute("class", "card-body")

//     // create h3 and add destination to card

//     // let cardHeader = document.createElement("h3")
//     // cardHeader.innerText = name
//     // cardHeader.setAttribute("class", "cardTitle card-title")
//     // cardAttributes.appendChild(cardHeader)

//     //create h4 and location to card

//     // cardLocation = document.createElement("h4")
//     // cardLocation.innerText = location
//     // cardLocation.setAttribute("class", "cardLocation card-subtitle text-muted")
//     // cardAttributes.appendChild(cardLocation)

    
//     // cardDescription = document.createElement("p")
//     // cardDescription.innerText = description
//     // cardDescription.setAttribute("class", "cardDescription card-text")
//     // cardAttributes.appendChild(cardDescription)


    

//     // let editBtn = document.createElement("button")
//     // editBtn.innerText = "Edit"
//     // editBtn.setAttribute("class", "btn btn-warning")
//     // editBtn.addEventListener('click', edit)

//     // let deleteBtn = document.createElement("button")
//     // deleteBtn.innerText = "Delete"
//     // deleteBtn.setAttribute("class", "btn btn-danger")
//     // deleteBtn.addEventListener('click', deleteCard)

//     // let buttonsection = document.createElement("div")
//     // buttonsection.setAttribute("class", "button-container")
//     // buttonsection.appendChild(editBtn)
//     // buttonsection.appendChild(deleteBtn)
//     // cardAttributes.appendChild(buttonsection)

//     card.appendChild(cardAttributes)

//     getDestinationImg(image)

//     return card;

// }

// function getDestinationImg(cardImg){

//     console.log(destName + "destination name")
//     console.log(destLocation + "destination Location")
//     fetch(`https://api.unsplash.com/search/photos/?client_id=iIztS3rev5bX3GLD4YCmq16pPVqgGkKl-WhxL7KPWGM&query=${destName,destLocation}&orientation=landscape&h=200`)
//     .then(res => res.json())
//     .then( data => {

//         console.log(data + "destination")
    
//         // default image if not is input
//         let defaultImg = "img/vaca.jpeg"

        
//         // let destinationUrl = data.results[random].urls.regular

//         if (data.results.length === 0) {
//             cardImg.src = defaultImg;
//         } else {
//             console.log(data.results.length)
//             let random = Math.floor(Math.random() * data.results.length)
//             console.log(random)
//             let destinationUrl = data.results[random].urls.raw
//             cardImg.src = destinationUrl}

// }).catch(err => {
//     console.log(`error ${err}`)
// })
// }

// edit button function 

function edit(id) {

    let newName = prompt("Please enter new destination name")
    let newLocation = prompt("Please enter new location")
    let newDescription = prompt("Please enter new description")

    fetch('/destinations',{
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify({
            _id: id,
            name: newName,
            location: newLocation,
            description: newDescription
        })
    })
    .then(response => {
        if(response.ok){return response.json()}
    })
    .then(data => {
        window.location.reload(true)
    })
}
// delete card function

function deleteBtn(id ){
fetch('destinations', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        _id: id
    })
})
.then(res => {
    if(res.ok){return res.json()}
})
.then(data => {
    window.location.reload(true)
})
}
