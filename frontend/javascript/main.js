/* export const myExport = 'Hello from main.js!'; */

// Hämtar böckerna från API
let bookArr = [];
let getData = async () => {
  let response = await fetch("http://localhost:1337/api/books?populate=*");
  let data = await response.json();
  bookArr.push(...data.data);
  console.log(data.data);
};

// Skriv ut böckerna i DOM:en
let showData = async () => {
  let bookOverview = document.querySelector(".main-books");
  await getData();
  bookArr.forEach((book) => {
    let { title, author, pages, published, cover } = book.attributes;
    let bookDiv = document.createElement("div");
    let bookTextDiv = document.createElement("div");
    let selectFavorite = document.createElement("input");
    let rateSelect = document.createElement("select");
    let bookImage = document.createElement("div");
    selectFavorite.type = "checkbox";
    selectFavorite.id = "favorite";
    bookTextDiv.innerHTML = `
    <h3>${title}</h3>
    <p>${author.firstName} ${author.lastName}</p>
    <p>Antal sidor: ${pages}</p>
    <p>Publicerad: ${published}</p> Give rating: `;
    bookImage.innerHTML = `<img src="http://localhost:1337${cover.data.attributes.url}" height="100" />`;

    bookOverview.append(bookDiv);
    bookDiv.prepend(selectFavorite);
    bookDiv.append(bookTextDiv);
    bookTextDiv.append(rateSelect);
    bookDiv.append(bookImage);
    bookTextDiv.classList.add("book-text");
    bookDiv.classList.add("book-div");
    bookImage.classList.add("book-image");
    rateSelect.classList.add("rate-dd");

    const option1 = document.createElement("option");
    option1.value = "1";
    option1.text = "1";
    const option2 = document.createElement("option");
    option2.value = "2";
    option2.text = "2";
    const option3 = document.createElement("option");
    option3.value = "3";
    option3.text = "3";
    const option4 = document.createElement("option");
    option4.value = "4";
    option4.text = "4";
    const option5 = document.createElement("option");
    option5.value = "5";
    option5.text = "5";

    rateSelect.add(option1, rateSelect[0]);
    rateSelect.add(option2, rateSelect[1]);
    rateSelect.add(option3, rateSelect[2]);
    rateSelect.add(option4, rateSelect[3]);
    rateSelect.add(option5, rateSelect[4]);

    rateSelect.addEventListener("change", () => {
      if (sessionStorage.getItem("token")) {
        let selectedOption = rateSelect.options[rateSelect.selectedIndex];
        giveRating(selectedOption.value, book.id);
      }
      else {
        alert("This action requires you to log in first =)");
      }
    });
  
    // Check if this book is already a favorite
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let isFavorite = favorites.some((favorite) => favorite.id === book.id);
    selectFavorite.checked = isFavorite;

    selectFavorite.addEventListener("change", () => {
      if (selectFavorite.checked) {
        saveFavorite(book);
      } else {
        removeFavorite(book);
      }
    });
  });
};
showData();

//Visa inloggningsfält
document.querySelector(".register-user").style.display = "none";
document.querySelector(".login-page").style.display = "none";
document.querySelector("#loginHeaderBtn").addEventListener("click", () => {
    document.querySelector(".startpage-wrapper").style.display = "none";
    document.querySelector(".login-page").style.display = "flex";
});

// Loggar in utifrån det som skrivs i inputfält (måste finnas som registrerad användare)
const login = async () => {
    let username = document.querySelector("#username").value;
    let userPassword = document.querySelector("#userPassword").value;

    let response = await fetch("http://localhost:1337/api/auth/local" , {
        method: "POST",
        body: JSON.stringify({
            identifier: username,
            password: userPassword,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        let data = await response.json();
    
        sessionStorage.setItem("token", data.jwt); //Sparar nyckeln (jwt) för användaren i sessionStorage
        sessionStorage.setItem("user", data.user.username);
        sessionStorage.setItem("userId", data.user.id);
        onPageLoad();
        showUser();
      } 
      
      else {
        let errorMessage = document.createElement("h3");
        errorMessage.innerText = "Användarnamn eller lösenord är felaktigt!";
        document.querySelector(".login-wrapper").append(errorMessage);
      }
    
};
document.querySelector("#loginBtn").addEventListener("click", login);

// Kolla om någon är inloggad
let onPageLoad = () => {
    let signOutBtn = document.querySelector("#signOutBtn");
    let loginHeaderBtn = document.querySelector("#loginHeaderBtn")
    if (sessionStorage.getItem("token")) {
        document.querySelector(".startpage-wrapper").style.display = "flex";
        document.querySelector(".register-user").style.display = "none";
        document.querySelector(".login-page").style.display = "none";
        signOutBtn.style.display = "flex";
        loginHeaderBtn.style.display = "none";
    } 
    else {
        signOutBtn.style.display = "none";
        loginHeaderBtn.style.display = "block";
    }
};
onPageLoad();

// Visa vem som är inloggad samt nav-länk hem/profil
let showUser = () => {
  let user = sessionStorage.getItem('user');
  let loginLogout = document.querySelector(".login-logout");
  let currentUser = document.createElement("span");
  if (sessionStorage.getItem("token")) {
    document.querySelector("#profileLi").style.display = "flex";
    document.querySelector("#homeLink").style.display = "flex";
    currentUser.id = "currentUser";
    currentUser.innerHTML = `${user}`;
    loginLogout.appendChild(currentUser);
    console.log(user);
  }
  else {
    document.querySelector("#profileLi").style.display = "none";
    document.querySelector("#homeLink").style.display = "none";
  }
}
showUser();

let removeUser = () => {
  let currentUser = document.querySelector("#currentUser");
  currentUser.innerHTML = "";
  document.querySelector("#profileLi").style.display = "none";
  document.querySelector("#homeLink").style.display = "none";
}

//Close login-window
document.querySelector("#closeWindow").addEventListener("click", () => {
  document.querySelector(".startpage-wrapper").style.display = "flex";
  document.querySelector(".register-user").style.display = "none";
  document.querySelector(".login-page").style.display = "none";
  signOutBtn.style.display = "none";
  loginHeaderBtn.style.display = "block";
})

// Spara böcker till "att läsa lista"
function saveFavorite(book) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.some((favorite) => favorite.id === book.id) && sessionStorage.getItem("token")) {
      favorites.push(book);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }
  
  function removeFavorite(book) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let newFavorites = favorites.filter((favorite) => favorite.id !== book.id);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  }
  
  // Hantera lagringen av favoriter i localStorage (Add an event listener for the storage event)
  window.addEventListener("storage", (event) => {
    if (event.key === "favorites") {
      // Get all checkboxes with id "favorite"
      let checkboxes = document.querySelectorAll("#favorite");
  
      // Update the checked state of each checkbox based on localStorage data
      checkboxes.forEach((checkbox) => {
        let bookDiv = checkbox.closest(".book-div");
        let bookId = bookDiv.dataset.bookId;
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        let isFavorite = favorites.some((favorite) => favorite.id === bookId);
        checkbox.checked = isFavorite;
      });
    }
  });

// Registrera nya användare
let registerUser = async () => {
    let newUsername = document.querySelector("#newUsername").value;
    let newUserPassword = document.querySelector("#newUserPassword").value;
    let newEmail = document.querySelector("#newEmail").value;

    let response = await fetch("http://localhost:1337/api/auth/local/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: newUsername,
            password: newUserPassword,
            email: newEmail,
        }), 
    });
    console.log(response);
    document.querySelector(".register-user").style.display = "none";
    document.querySelector(".login-wrapper").style.display = "flex";
};

// Göm input för registrering av användare tills klick
document.querySelector("#addUserBtn").addEventListener("click", () => {
    document.querySelector(".login-wrapper").style.display = "none";
    document.querySelector(".register-user").style.display = "flex";
});
document.querySelector("#registerBtn").addEventListener("click", registerUser);

// Logga ut
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

let giveRating = async (value, bookId) => {
    let response = await fetch("http://localhost:1337/api/ratings?populate=*", {
     //config
     method: "POST",
     body: JSON.stringify({
       data: {
         rate: value,
         book: bookId, 
         users_permissions_user: sessionStorage.getItem("userId"),
       },
     }),
     headers: {
       "Content-Type": "application/json",
     },
   });
   let data = await response.json();
   console.log(response, data);
};

function clearSelectedOption() {
  const selectElements = document.querySelectorAll('.rate-dd');
  selectElements.forEach(function(selectElement) {
    selectElement.selectedIndex = -1;
  });
}

function clearCheckboxes() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = false;
  });
}