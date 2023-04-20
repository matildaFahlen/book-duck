let showFavorites = () => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let profilePage = document.querySelector(".profile-page");

    favorites.forEach(book => {
        let bookDiv = document.createElement("div");
        let { title, author, pages, published, cover } = book.attributes;
        bookDiv.innerHTML = `<div class="book-text">
        <h3>${title}</h3>
        <p>${author.firstName} ${author.lastName}</p>
        <p>Antal sidor: ${pages}</p>
        <p>Publicerad: ${published}</p>
        </div>
        <div class="book-image">
        <img src="http://localhost:1337${cover.data.attributes.url}" height="100" />
        </div>
        `;
        profilePage.append(bookDiv);
        bookDiv.classList.add("book-div");
    });
}
showFavorites();

let showUser = () => {
    if (sessionStorage.getItem("token")) {
      document.querySelector("#profileLi").style.display = "flex";
      document.querySelector("#homeLink").style.display = "flex";
      let user = sessionStorage.getItem('user');
      let loginLogout = document.querySelector(".login-logout");
      let currentUser = document.createElement("span");
      currentUser.id = "currentUser";
      currentUser.innerHTML = `${user}`;
      loginLogout.appendChild(currentUser);
    }
}
showUser();

let onPageLoad = () => {
    let signOutBtn = document.querySelector("#signOutBtn");
    let loginHeaderBtn = document.querySelector("#loginHeaderBtn")
    if (sessionStorage.getItem("token")) {
        signOutBtn.style.display = "flex";
        loginHeaderBtn.style.display = "none";
    } 
    else {
        signOutBtn.style.display = "none";
        loginHeaderBtn.style.display = "block";
    }
};
onPageLoad();

let removeUser = () => {
    let currentUser = document.querySelector("#currentUser");
    currentUser.innerHTML = "";
    document.querySelector("#profileLi").style.display = "none";
    document.querySelector("#homeLink").style.display = "none";
  }

let signOut = () => {
    if (sessionStorage.getItem("token")) {
        sessionStorage.clear();
        localStorage.clear();
        onPageLoad();
        removeUser();
        clearCheckboxes();
        clearSelectedOption();
    }
}
document.querySelector("#signOutBtn").addEventListener("click", signOut);

function clearCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
      checkbox.checked = false;
    });
}

function clearSelectedOption() {
    const selectElements = document.querySelectorAll('.rate-dd');
    selectElements.forEach(function(selectElement) {
      selectElement.selectedIndex = -1;
    });
}