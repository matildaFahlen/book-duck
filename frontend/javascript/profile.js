let getFavorites = async () => {
    let response = await fetch(`http://localhost:1337/api/users/${sessionStorage.getItem("userId")}?populate=*`);
    let data = await response.json();
    let favoriteBooks = [];
    data.books.forEach((book) => {
      favoriteBooks.push(book.id);
      localStorage.setItem("favoriteBooksId", favoriteBooks);
    })
    saveFavoriteBooks(favoriteBooks);   
}

let saveFavoriteBooks = async (books) => {
    let response = await fetch("http://localhost:1337/api/books?populate=*");
    let data = await response.json();
    let favoriteBooks = data.data.filter((book) => books.includes(book.id));
    localStorage.setItem("favoriteBooks", JSON.stringify(favoriteBooks));
    showFavorites();
  };  

let showFavorites = () => {
    let profilePage = document.querySelector(".profile-page");
    profilePage.innerHTML = "";
    let favorites = JSON.parse(localStorage.getItem('favoriteBooks')) || [];

    favorites.forEach((book) => {
        let bookDiv = document.createElement("div");
        let removeFavoriteBtn = document.createElement("button");
        removeFavoriteBtn.innerText = "Delete";
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
        bookDiv.prepend(removeFavoriteBtn);
        bookDiv.classList.add("book-div");
        removeFavoriteBtn.classList.add("remove-btn");

        removeFavoriteBtn.addEventListener("click", (event) => {
            removeFavoriteBook(book.id);
        });
        
    });
}
getFavorites();

let addFavoriteBooks = async (favoriteBooks) => {
    let response = await fetch(`http://localhost:1337/api/users/${sessionStorage.getItem("userId")}`, {
       //config
       method: "PUT",
       body: JSON.stringify({
          books: favoriteBooks,
       }),
       headers: {
         "Content-Type": "application/json",
         "Authorization": `Bearer ${sessionStorage.getItem("token")}`
       },
     });
     let data = await response.json();
     console.log(favoriteBooks);
  }

let removeFavoriteBook = async (bookId) => {
    let response = await fetch(`http://localhost:1337/api/users/${sessionStorage.getItem("userId")}?populate=*`);
    let data = await response.json();
    let favoriteBooks = [];
    data.books.forEach((book) => {
      favoriteBooks.push(book.id);
    })

    let value = bookId;
    let index = favoriteBooks.indexOf(value);
    favoriteBooks.splice(index, 1);
    addFavoriteBooks(favoriteBooks);  
    getFavorites();
    console.log(`du har avmarkerat (i DOM:en) bok med id: ${bookId}`);
  }

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