const BOOKS = "DATABUKU1";
const idCompleteBooks = "completeBookshelfList";
const idIncompleteBooks = "incompleteBookshelfList";
let books = [];

document.addEventListener("click", function () {
  const isRead = document.getElementById("inputBookIsComplete").checked;
  if (isRead) {
    document.getElementById("isRead").innerText = "Selesai dibaca";
  } else {
    document.getElementById("isRead").innerText = "Belum selesai dibaca";
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const formInput = document.getElementById("inputBook");
  const formSearch = document.getElementById("searchBook");
  formInput.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();

    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
    document.getElementById("inputBookIsComplete").checked = false;
  });

  formSearch.addEventListener("submit", function (event) {
    event.preventDefault();
    const word = document.getElementById("searchBookTitle").value;
    searchBook(word);
  });

  fetchBooks();
});

function updateDataJSON() {
  if (typeof Storage !== "undefined") {
    localStorage.setItem(BOOKS, JSON.stringify(books));
  } else {
    alert("Browser does not support storage");
  }
}

function fetchBooks() {
  if (typeof Storage !== "undefined") {
    let databooks = JSON.parse(localStorage.getItem(BOOKS));
    if (databooks !== null) {
      books = databooks;
    }
    renderBooks();
  } else {
    alert("Browser does not support storage");
  }
}

function addBook() {
  const id = +new Date().getTime();
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const bookObject = createBookObject(id, title, author, year, isComplete);
  books.push(bookObject);
  console.log(books);
  const book = createBookList(id, title, author, year, isComplete);

  if (isComplete == true) {
    document.getElementById(idCompleteBooks).append(book);
  } else {
    document.getElementById(idIncompleteBooks).append(book);
  }
  updateDataJSON();
}
function createBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function searchBook(word) {
  const filter = word.toLowerCase();
  const titles = document.getElementsByTagName("h3");

  for (let i = 0; i < titles.length; i++) {
    const titlesText = titles[i].textContent || titles[i].innerText;
    if (titlesText.toLowerCase().indexOf(filter) > -1) {
      titles[i].closest(".book_item").style.display = "";
    } else {
      titles[i].closest(".book_item").style.display = "none";
    }
  }
}

function createBookList(id, title, author, year, isComplete) {
  const book = document.createElement("article");
  book.setAttribute("id", id);
  book.classList.add("book_item");

  const bookTitle = document.createElement("h3");
  bookTitle.style.maxWidth = "200px";
  bookTitle.innerText = title;

  const bookAuthor = document.createElement("p");
  bookAuthor.style.maxWidth = "200px";
  bookAuthor.innerText = "Penulis: " + author;

  const bookYear = document.createElement("p");
  bookYear.innerText = "Tahun: " + year;

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-body");
  const cardContent = document.createElement("div");
  cardContent.classList.add("card-content");

  const cardAction = addAction(isComplete, id);
  book.append(bookTitle, bookAuthor, bookYear, cardAction);
  return book;
}

function addAction(inputBookIsComplete, id) {
  const cardActions = document.createElement("div");
  cardActions.classList.add("action");
  const actionDelete = createActionDelete(id);
  const actionRead = createActionRead(id);
  const actionUndo = createActionUndo(id);

  if (inputBookIsComplete) {
    cardActions.append(actionDelete);
    cardActions.append(actionUndo);
  } else {
    cardActions.append(actionDelete);
    cardActions.append(actionRead);
  }

  return cardActions;
}

function createActionDelete(id) {
  const actionDelete = document.createElement("button");
  actionDelete.classList.add("red");
  actionDelete.innerHTML = "Hapus Buku";

  actionDelete.addEventListener("click", function () {
    let confirmDelete = confirm("do you want to delete this book?");

    if (confirmDelete) {
      const cardParent = document.getElementById(id);
      cardParent.addEventListener("eventDelete", function (event) {
        event.target.remove();
      });
      cardParent.dispatchEvent(new Event("eventDelete"));
      deleteBookFromJson(id);
      updateDataJSON();
    }
  });

  return actionDelete;
}

function createActionRead(id) {
  const action = document.createElement("button");
  action.classList.add("btn", "green");
  action.innerHTML = "Selesai Dibaca";

  action.addEventListener("click", function () {
    const cardParents = document.querySelectorAll("article");
    for (let i in books) {
      if (books[i].id == id) {
        books[i].isComplete = true;
      }
    }
    updateDataJSON();
    for (var cardParent of cardParents) {
      cardParent.remove();
    }
    renderBooks();
  });

  return action;
}

function createActionUndo(id) {
  const action = document.createElement("button");
  action.classList.add("btn", "green");
  action.innerHTML = "Belum selesai dibaca";

  action.addEventListener("click", function () {
    const cardParents = document.querySelectorAll("article");
    for (let i in books) {
      if (books[i].id == id) {
        books[i].isComplete = false;
      }
    }
    updateDataJSON();
    for (var cardParent of cardParents) {
      cardParent.remove();
    }
    renderBooks();
  });

  return action;
}

function renderBooks() {
  for (book of books) {
    const newBook = createBookList(
      book.id,
      book.title,
      book.author,
      book.year,
      book.isComplete
    );

    if (book.isComplete == true) {
      document.getElementById(idCompleteBooks).append(newBook);
    } else {
      document.getElementById(idIncompleteBooks).append(newBook);
    }
  }
}

function deleteBookFromJson(id) {
  for (let i = 0; i < books.length; i++) {
    if (books[i].id == id) {
      books.splice(i, 1);
      console.log("success deleted book");
      break;
    }
  }
}
