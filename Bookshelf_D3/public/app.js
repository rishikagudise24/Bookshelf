let tabTitle = document.querySelector("#tabTitle");
let header = document.querySelector("#header");
let mainContent = document.querySelector("#mainContent");

const add_book = (
  title,
  author,
  genre,
  publicationDate,
  description,
  image
) => {
  let book = {
    Title: title,
    Author: author,
    Genre: genre,
    Published_Date: publicationDate,
    Des: description,
    Image: image,
  };

  if (auth.currentUser != null) {
    // Query the user's document based on the email
    db.collection("bookshelf_USERS")
      .where("email", "==", auth.currentUser.email)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDocId = querySnapshot.docs[0].id;

          // Check if the book already exists in the user's collection
          db.collection("bookshelf_USERS")
            .doc(userDocId)
            .collection("my_books")
            .where("Title", "==", title) // Assuming "Title" is the unique identifier for a book
            .get()
            .then((querySnapshot) => {
              if (querySnapshot.empty) {
                // Book does not exist, so add it
                db.collection("bookshelf_USERS")
                  .doc(userDocId)
                  .collection("my_books")
                  .add(book)
                  .then(() => {})
                  .catch((error) => {});
              } else {
                alert("Book already exists in user's collection");
                // button.disabled = true;
              }
            })
            .catch((error) => {});
        } else {
        }
      })
      .catch((error) => {});
  }
};

//-----------------REVIEW FORM------------------------------------------
const show_reviews = () => {
  db.collection("bookshelf_reviews")
    .get()
    .then((reviewDoc) => {
      if (!reviewDoc.empty) {
        reviewDoc.forEach((review) => {
          let reviewData = review.data();
          let reviewElement = document.createElement("div");

          let name = reviewData.r_name;
          let rating = reviewData.r_rating;
          let review_content = reviewData.r_content;

          reviewElement.classList.add(
            "review",
            "box",
            "has-text-centered",
            "has-background-success-light"
          );
          reviewElement.innerHTML = `
    <strong>User:</strong> ${name} <br>
    <strong>Rating:</strong> ${rating} Stars <br>
    <strong>Review:</strong> ${review_content}
  `;
          document.querySelector("#reviews_section").appendChild(reviewElement);
        });
      }
    });
};

show_reviews();

const review_submit = () => {
  let reviewForm = document.querySelector("#reviewForm");

  reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let name = document.querySelector("#review_name").value;
    let email = document.querySelector("#review_email").value;
    let rating = document.querySelector("#review_rating").value;
    let review_content = document.querySelector("#review").value;

    let new_review = {
      r_name: name,
      r_email: email,
      r_rating: rating,
      r_content: review_content,
    };

    db.collection("bookshelf_reviews")
      .add(new_review)
      .then(() => {
        alert("new review added!");
      });

    // Create review element
    let reviewElement = document.createElement("div");
    reviewElement.classList.add(
      "review",
      "box",
      "has-text-centered",
      "has-background-success-light"
    );

    reviewElement.innerHTML = `
    <strong>User:</strong> ${name} <br>
    <strong>Rating:</strong> ${rating} Stars <br>
    <strong>Review:</strong> ${review_content}
  `;

    // add the review element underneath the form
    document.querySelector("#reviews_section").appendChild(reviewElement);

    reviewForm.reset();
  });
};

review_submit();

//--------------------------------------------------------------------------

//----------------------------------------------------------------------------

let signupbtn = document.querySelector("#signupbtn");
let signinbtn = document.querySelector("#signinbtn");

signupbtn.addEventListener("click", () => {
  // show the modal by adding the is-active class to the modal div
  // reference to the sign up model
  let smodal = document.querySelector("#smodal");

  // add the is-active to the model (function: add, class being added: is-active)
  smodal.classList.add("is-active");
});

// SIGN IN BTN
signinbtn.addEventListener("click", () => {
  // show the modal by adding the is-active class to the modal div
  // reference to the sign up model
  let smodal2 = document.querySelector("#smodal2");

  // add the is-active to the model (function: add, class being added: is-active)
  smodal2.classList.add("is-active");
});

// hide the modal (sign up)
document.querySelector("#modalbg").addEventListener("click", () => {
  // remove the is-active class from the modal
  document.querySelector("#smodal").classList.remove("is-active");
});

// hide the modal (sign in)
document.querySelector("#modalbg2").addEventListener("click", () => {
  // remove the is-active class from the modal
  document.querySelector("#smodal2").classList.remove("is-active");
});

//-----------------------------SIGN UP FORM--------------------------------------
document.querySelector("#sign_up_form").addEventListener("submit", (e) => {
  //prevent auto refresh
  e.preventDefault();

  //capture the user email and password
  let user_email = document.querySelector("#sign_email").value;
  let user_pass = document.querySelector("#sign_pass").value;

  //finish user authentication
  auth.createUserWithEmailAndPassword(user_email, user_pass).then(() => {
    //hide the modal
    document.querySelector("#smodal").classList.remove("is-active");

    //clear the form
    document.querySelector("#sign_up_form").reset();

    let new_user = {
      email: user_email,
      password: user_pass,
    };

    db.collection("bookshelf_USERS")
      .add(new_user)
      .then((docRef) => {
        alert("New user added!");
      })
      .catch((error) => {});
  });
});

//----------------------------------------------------------------------------------

//---------------------------------SIGN IN------------------------------------------

document.querySelector("#sign_in_form").addEventListener("submit", (e) => {
  e.preventDefault();

  let user_email = document.querySelector("#sign_in_email").value;
  let user_pass = document.querySelector("#sign_in_pass").value;

  auth
    .signInWithEmailAndPassword(user_email, user_pass)
    .then((user) => {
      document.querySelector("#smodal2").classList.remove("is-active");
      document.querySelector("#sign_in_form").reset();
    })
    .catch((e) => {
      alert("incorrect login!");
    });
});

//----------------------------------------------------------------------------------

// const change_auth_state = () => {
const reviewsBtn = document.querySelector("#reviewsBtn");
//onauthstatechanged
auth.onAuthStateChanged((user) => {
  if (user) {
    document.querySelector(
      "#nav_email"
    ).innerHTML = `${auth.currentUser.email}`;
    reviewsBtn.disabled = false;
    document.querySelector("#signoutbtn").classList.remove("is-hidden");

    document.querySelector("#signinbtn").classList.add("is-hidden");
    document.querySelector("#signupbtn").classList.add("is-hidden");
    document.querySelector("#bookshelfPage").classList.remove("is-hidden");
  } else {
    reviewsBtn.disabled = true;

    document.querySelector("#nav_email").innerHTML = "";

    document.querySelector("#signinbtn").classList.remove("is-hidden");
    document.querySelector("#signupbtn").classList.remove("is-hidden");

    document.querySelector("#signoutbtn").classList.add("is-hidden");
    document.querySelector("#bookshelfPage").classList.add("is-hidden");
  }
});
// };

// change_auth_state();

//----------------------------------------------------------------------------------
//---------------------------------SIGN OUT-----------------------------------------

document.querySelector("#signoutbtn").addEventListener("click", () => {
  auth.signOut().then(() => {
    window.location.href = "index.html";
    alert("user left");
  });
});

//-----------------------------------------------------------------------------------

// show Home page
document.querySelector("#homePage").addEventListener("click", () => {
  // const reviewsBtn2 = document.querySelector("#reviewsBtn");
  //onauthstatechanged
  // auth.onAuthStateChanged((user) => {
  //   if (user) {
  //     reviewsBtn.disabled = false;
  //   } else {
  //     reviewsBtn.disabled = true;
  //   }
  // });

  // if (auth.currentUser != null) {
  //   document.querySelector("#reviewsBtn").disabled = false;
  // } else {
  //   document.querySelector("#reviewsBtn").disabled = true;
  // }

  tabTitle.innerHTML = `Bookshelf | Home`;

  header.innerHTML = `Welcome to Bookshelf`;

  mainContent.innerHTML = `<div class="container is-fluid">
  <div class="columns">
    <div class="column">
      <div class="box">
        <p>
          Welcome to Bookshelf, your online platform for organizing and
          managing your book collection. With Bookshelf, you can:
        </p>

        <ul class="content">
          <li class="ml-4">
            Create a digital bookshelf to organize your books by genre,
            author, or any other custom category.
          </li>

          <li class="ml-4">
            Keep track of the books you've read, want to read, or
            currently reading.
          </li>

          <li class="ml-4">
            Discover new books through personalized recommendations based
            on your reading preferences.
          </li>

          <li class="ml-4">
            Connect with other book enthusiasts, share recommendations,
            and join discussions about your favorite books.
          </li>
        </ul>

        <p>Start building your virtual library today!</p>
      </div>
    </div>

    <div class="column">
      <figure class="image is-3by3">
        <img src="bookshelf.png" alt="bookshelf" />
      </figure>
    </div>

    <div class="column">
      <div class="box">
        <h2 class="title">Add Your Review</h2>

        <form action="#" method="POST" id="reviewForm">
          <div class="field">
            <label class="label" for="name">Name:</label>

            <div class="control">
              <input
                class="input"
                type="text"
                id="review_name"
                name="name"
                required
              />
            </div>
          </div>

          <div class="field">
            <label class="label" for="email">Email:</label>

            <div class="control">
              <input
                class="input"
                type="email"
                id="review_email"
                name="email"
                required
              />
            </div>
          </div>

          <div class="field">
            <label class="label" for="rating">Rating:</label>

            <div class="control">
              <div class="select">
                <select id="review_rating" name="rating" required>
                  <option value="5">5 Stars</option>

                  <option value="4">4 Stars</option>

                  <option value="3">3 Stars</option>

                  <option value="2">2 Stars</option>

                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label" for="review">Review:</label>

            <div class="control">
              <textarea
                class="textarea"
                id="review"
                name="review"
                rows="4"
                required
              ></textarea>
            </div>
          </div>

          <div class="field">
            <div class="control">
              <input
                id="reviewsBtn"
                class="button is-success"
                type="submit"
                value="Submit"
              />

              <input class="button" type="reset" value="Reset" />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div id="reviews_section" class="m-6"></div>
</div>`;

  // change_auth_state();
  // change_auth_state();
  const reviewsBtn = document.querySelector("#reviewsBtn");
  auth.onAuthStateChanged((user) => {
    if (user) {
      reviewsBtn.disabled = false;
    } else {
      reviewsBtn.disabled = true;
    }
  });

  show_reviews();
  review_submit();
});

// show My Bookshelf page
document.querySelector("#bookshelfPage").addEventListener("click", () => {
  tabTitle.innerHTML = `My Bookshelf`;

  header.innerHTML = `My Bookshelf`;

  mainContent.innerHTML = `
  <div class="container is-fluid">
        <!-- 2 columns -->
        <div class="columns">
          <!-- left column -->
          <div class="column is-two-thirds">
            <p class="mb-3 is-size-4 has-text-weight-bold">
              Your Current Books
            </p>
            <div id="bookshelf_cards"></div>
          </div>
          <!-- right column -->
          <div class="column is-one-third">
            <!-- Add Your Own Book Form -->
            <h2 class="has-text-centered is-size-4 mb-3 has-text-weight-bold">
              Add Your Own Book!
            </h2>
            <form id ="add_book_form" class="has-background-success p-4">
              <div class="field m-4">
                <label class="label">Title:</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    id="titleFormInpt"
                    name="title"
                    placeholder="(Required)"
                    required
                  />
                </div>
              </div>
              <div class="field m-4">
                <label class="label">Author:</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    id="authorFormInpt"
                    name="author"
                    placeholder="(Required)"
                    required
                  />
                </div>
              </div>
              <div class="field m-4">
                <label class="label">Genre:</label>
                <div class="control">
                  <div class="select">
                    <select id="genreFormInpt" name="genre" required>
                      <option disabled selected>Select genre</option>
                      <option value="Fiction">Fiction</option>
                      <option value="Non-Fiction">Non-Fiction</option>
                      <option value="Mystery">Mystery</option>
                      <option value="Romantic Comedy">Romantic Comedy</option>
                      <option value="Fantasy">Fantasy</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="field m-4">
                <label class="label">Publication Date:</label>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    id="dateFormInpt"
                    name="date"
                    placeholder="(Required)"
                    required
                  />
                </div>
              </div>
              <div class="field m-4">
                <label class="label">Description:</label>
                <div class="response">
                  <textarea
                    class="textarea"
                    id="descriptionFormInpt"
                    name="description"
                    placeholder="(Required)"
                    required
                    cols="50"
                    rows="6"
                  ></textarea>
                </div>
              </div>
              <div class="field m-4">
                <label class="label">Cover Image:</label>
                <div class="control">
                  <input
                    id="coverImageFormInpt"
                    class="input"
                    type="file"
                    placeholder="Choose file"
                    required
                    />
                </div>

                <div id="add_book_form_err_txt" class="has-text-danger-dark mt-1"></div>

              </div>
              
              

              <div class="field is-grouped ml-4">
                <div class="control">
                  <button id = "add_book_submit_btn"
                    class="button has-background-success-dark has-text-white"
                    type="submit"
                  >
                    Submit
                  </button>
                  <button
                    class="button has-background-success-dark has-text-white"
                    type="reset"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>`;
  // ------------------------
  const delete_book = (card) => {
    if (auth.currentUser != null) {
      db.collection("bookshelf_USERS")
        .where("email", "==", auth.currentUser.email)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let myBooksRef = doc.ref.collection("my_books");

            let bookTitle = card.querySelector(".title").textContent;
            myBooksRef
              .where("Title", "==", bookTitle)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  doc.ref
                    .delete()
                    .then(() => {
                      card.remove(); // Remove the card from the DOM
                    })
                    .catch((error) => {});
                });
              })
              .catch((error) => {});
          });
        })
        .catch((error) => {});
    }
  };

  //---------------------------SHOW THE CARDS--------------------------------------
  const show_bookshelf_books = () => {
    if (auth.currentUser != null) {
      db.collection("bookshelf_USERS")
        .where("email", "==", auth.currentUser.email)
        .get()
        .then((userDoc) => {
          if (!userDoc.empty) {
            userDoc.forEach((user) => {
              // Accessing the `my_books` subcollection
              user.ref
                .collection("my_books")
                .get()
                .then((booksDoc) => {
                  if (!booksDoc.empty) {
                    booksDoc.forEach((book) => {
                      let bookData = book.data();
                      let bookCard = document.createElement("div");
                      bookCard.classList.add("card");
                      bookCard.classList.add("has-background-grey-lighter");
                      bookCard.classList.add("mb-5");

                      bookCard.innerHTML = `
                      <div id="${book.id}" class="card-content">
                        <div class="media">
                        <!-- image column -->
                        <div class="image-left mr-5">
                          ${bookData.Image}
                        </div>
                        <!-- text column -->
                        <div class="text">
                            <h2 class="title is-size-4 mb-1 has-text-weight-medium">${bookData.Title}</h2>
                            <p class = "author"><span class="has-text-weight-bold">Author:</span> ${bookData.Author}</p>
                            <p class = "genre" ><span class="has-text-weight-bold">Genre:</span> ${bookData.Genre}</p>
                            <p class = "date" ><span class="has-text-weight-bold">Published Date:</span> ${bookData.Published_Date}</p>
                            <p class = "des"><span class="has-text-weight-bold">Description:</span> ${bookData.Des}</p>
                          </div>
                        </div>
                        <!-- remove book button -->
                        <div class="has-text-right">
                          <button class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold">
                            <i class="fa-solid fa-bookmark"></i>
                            Remove from My Bookshelf
                          </button>
                        </div>
                      </div>
                    `;
                      document
                        .querySelector("#bookshelf_cards")
                        .appendChild(bookCard);

                      // Add event listener to the button
                      let btn = bookCard.querySelector(".Rbtn");
                      btn.addEventListener("click", () => {
                        let card = btn.closest(".card");
                        delete_book(card);
                      });
                    });
                  }
                })
                .catch((error) => {});
            });
          }
        })
        .catch((error) => {});
    }
  };

  show_bookshelf_books();

  //--------------------------------------------------------------------------------
  //---------------------------ADD BOOK FORM----------------------------------------
  document
    .querySelector("#add_book_submit_btn")
    .addEventListener("click", (event) => {
      event.preventDefault();

      // Get the image file
      let file = document.querySelector("#coverImageFormInpt").files[0];

      if (file != null) {
        document.querySelector("#add_book_form_err_txt").innerHTML = "";

        // Create a unique image name using the current date
        let imageName = new Date().toISOString() + "_" + file.name;

        // Upload the image to Firebase Storage
        const uploadTask = ref.child(imageName).put(file);

        uploadTask.then((snapshot) => {
          // Get the download URL of the uploaded image
          snapshot.ref.getDownloadURL().then((url) => {
            // Gather data from the form fields
            let titleInpt = document.querySelector("#titleFormInpt").value;
            let authorInpt = document.querySelector("#authorFormInpt").value;
            let genreInpt = document.querySelector("#genreFormInpt").value;
            let dateInpt = document.querySelector("#dateFormInpt").value;
            let desInpt = document.querySelector("#descriptionFormInpt").value;
            let imgInpt = ` <figure class="image is-128x128"> <img src="${url}"> </figure>`;

            // Add the book to the database with the image URL
            add_book(
              titleInpt,
              authorInpt,
              genreInpt,
              dateInpt,
              desInpt,
              imgInpt
            );

            // Create a new book card element
            let bookCard = document.createElement("div");
            bookCard.classList.add("card");
            bookCard.classList.add("has-background-grey-lighter");
            bookCard.classList.add("mb-5");

            bookCard.innerHTML = `
        <div class="card-content">
          <div class="media">
            <!-- Image column -->
            <div class="media-left">
              <figure class="image is-128x128">
                <img src="${url}">
              </figure>
            </div>
            <!-- Text column -->
            <div class="media-content">
              <h2 class="title is-size-4 mb-1 has-text-weight-medium">${titleInpt}</h2>
              <p class="author"><span class="has-text-weight-bold">Author:</span> ${authorInpt}</p>
              <p class="genre"><span class="has-text-weight-bold">Genre:</span> ${genreInpt}</p>
              <p class="date"><span class="has-text-weight-bold">Publication Date:</span> ${dateInpt}</p>
              <p class="des"><span class="has-text-weight-bold">Description:</span> ${desInpt}</p>
            </div>
          </div>
          <!-- Remove book button -->
          <div class="has-text-right">
            <button class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold">
              <i class="fa-solid fa-bookmark"></i>
              Remove from My Bookshelf
            </button>
          </div>
        </div>
      `;
            // Add event listener to the button
            let btn = bookCard.querySelector(".Rbtn");
            btn.addEventListener("click", () => {
              let card = btn.closest(".card");
              delete_book(card);
            });

            // Append the new book card to the bookshelf
            document
              .querySelector("#mainContent .columns .column.is-two-thirds")
              .appendChild(bookCard);

            // Clear the form fields
            document.querySelector("#add_book_form").reset();
          });
        });
      } else {
        document.querySelector("#add_book_form_err_txt").innerHTML =
          "You must upload a cover image";
      }
    });

  //----------------------------------------------------------------------------------
});

// show Fantasy page
document.querySelector("#fantasyPage").addEventListener("click", () => {
  tabTitle.innerHTML = `Bookshelf | Fantasy`;

  header.innerHTML = `Fantasy Books`;

  mainContent.innerHTML = `
  <div class="container is-fluid">
        <!-- search bar -->
        <form id="searchbar" class="mb-6 mx-6" action="#">
          <div class="field is-grouped">
            <div class="control is-expanded">
              <input id="searchInpt" type="text" class="input" placeholder="Search" />
            </div>
            <div class="control">
              <button id="searchBtn" class="button has-background-success-dark has-text-white">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      <div class="container is-fluid">
        <!-- Book 1 -->
        <div class="card has-background-grey-lighter mb-5">
          <div class="card-content">
            <div class="media">
              <!-- image column -->
              <div class="image-left mr-5">
                <figure class="image is-128x128">
                  <img
                    src="images/f.jpeg"
                    alt="Harry Potter and The Philosopher's Stone"
                  />
                </figure>
              </div>
              <!-- text column -->
              <div class="text">
                <h2  id = "Harry Potter and The Philosopher's Stone" class="title is-size-4 mb-1 has-text-weight-medium">
                Harry Potter and The Philosopher's Stone
                </h2>

                <p class = "author">
                  <span class="has-text-weight-bold">Author: </span>J.K. Rowling
                </p>
                <p class = "genre" ><span class="has-text-weight-bold">Genre: </span>Fantasy</p>
                <p class = "date">
                  <span class="has-text-weight-bold">Publication Date: </span
                  >1997
                </p>
                <p class = "des">
                  <span class="has-text-weight-bold">Description: </span>The book is about 11 year old Harry Potter, who
                  receives a letter saying that he is invited to attend Hogwarts,
                  school of witchcraft and wizardry. He then learns that a powerful
                  wizard and his minions are after the sorcerer's stone that will
                  make this evil wizard immortal and undefeatable.
                </p>
              </div>
            </div>
            <!-- add book -->
            <div class="has-text-right" >
              <button
                class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
              >
              <i class="fa-regular fa-bookmark has-text-success-dark"></i>
              <p class="has-text-success-dark has-text-weight-semibold is-inline">
                Add to My Bookshelf
              </p>
              </button>
            </div>
          </div>
        </div>
        <!-- Book 2 -->
        <div class="card has-background-grey-lighter mb-5">
          <div class="card-content">
            <div class="media">
              <!-- image column -->
              <div class="image-left mr-5">
                <figure class="image is-128x128">
                  <img
                    src="images/f2.jpeg"
                    alt="Dance of Thieves"
                  />
                </figure>
              </div>
              <!-- text column -->
              <div class="text">
                <h2 id = "Dance of Thieves" class="title is-size-4 mb-1 has-text-weight-medium">
                Dance of Thieves
                </h2>

                <p class= "author">
                  <span class="has-text-weight-bold">Author: </span>Mary E. Pearson
                </p>
                <p class = "genre"><span class="has-text-weight-bold">Genre: </span>Fantasy</p>
                <p class = "date">
                  <span class="has-text-weight-bold">Publication Date: </span
                  >2018
                </p>
                <p class = "des">
                  <span class="has-text-weight-bold">Description: </span>A legendary street thief leading a mission,
                  determined to prove herself. A dark secret that is a threat to the
                  entire continent. When outlaw leader meets reformed thief, a
                  cat-and-mouse game of false moves ensues, bringing them intimately
                  together in a battle that may cost them their lives—and their
                  hearts.
                </p>
              </div>
            </div>
            <!-- add book -->
            <div class="has-text-right">
              <button  id = "f2"
                class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
              >
              <i class="fa-regular fa-bookmark has-text-success-dark"></i>
              <p class="has-text-success-dark has-text-weight-semibold is-inline">
                Add to My Bookshelf
              </p>
              </button>
            </div>
          </div>
        </div>
        <!-- Book 3 -->
        <div class="card has-background-grey-lighter mb-5">
          <div class="card-content">
            <div class="media">
              <!-- image column -->
              <div class="image-left mr-5">
                <figure class="image is-128x128">
                  <img src="images/f3.jpeg" alt="The Alchemist" />
                </figure>
              </div>
              <!-- text column -->
              <div class="text">
                <h2 id = "The Alchemist" class="title is-size-4 mb-1 has-text-weight-medium">
                The Alchemist
                </h2>

                <p class = "author">
                  <span class="has-text-weight-bold">Author: </span>Paulo Coelho
                </p>
                <p class = "genre"><span class="has-text-weight-bold">Genre: </span>Fantasy</p>
                <p class ="date">
                  <span class="has-text-weight-bold">Publication Date: </span
                  >2019
                </p>
                <p class = "des">
                  <span class="has-text-weight-bold">Description: </span>The Alchemist is a story of following one's dreams to
                  find one's purpose in life. The main character, Santiago, is a
                  Spanish shepherd boy who leaves behind his job and family to
                  search for his Personal Legend, a hidden treasure that he believes
                  is buried near the pyramids in Egypt.
                </p>
              </div>
            </div>
            <!-- add book -->
            <div class="has-text-right">
              <button  id  = "f3" 
                class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
              >
              <i class="fa-regular fa-bookmark has-text-success-dark"></i>
              <p class="has-text-success-dark has-text-weight-semibold is-inline">
                Add to My Bookshelf
              </p>
              </button>
            </div>
          </div>
        </div>
        <!-- Book 4 -->
        <div class="card has-background-grey-lighter mb-5">
          <div class="card-content">
            <div class="media">
              <!-- image column -->
              <div class="image-left mr-5">
                <figure class="image is-128x128">
                  <img
                    src="images/f4.jpeg"
                    alt="Fairy Tale"
                  />
                </figure>
              </div>
              <!-- text column -->
              <div class="text">
                <h2 id = "Fairy Tale" class=" title is-size-4 mb-1 has-text-weight-medium">
                Fairy Tale
                </h2>

                <p class = "author">
                  <span class="has-text-weight-bold">Author: </span>Stephen King
                </p>
                <p class = "genre"><span class="has-text-weight-bold">Genre: </span>Fantasy</p>
                <p class = "date">
                  <span class="has-text-weight-bold">Publication Date: </span
                  >2022
                </p>
                <p class = "des">
                  <span class="has-text-weight-bold">Description: </span>Fairy Tale is a dark fantasy novel by American author
                  Stephen King, published on September 6, 2022, by Scribner. The
                  novel follows Charlie Reade, a 17-year-old who inherits keys to a
                  hidden, otherworldly realm, and finds himself leading the battle
                  between forces of good and evil.
                </p>
              </div>
            </div>
            <!-- add book -->
            <div class="has-text-right">
              <button  id = "f4" 
                class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
              >
              <i class="fa-regular fa-bookmark has-text-success-dark"></i>
              <p class="has-text-success-dark has-text-weight-semibold is-inline">
                Add to My Bookshelf
              </p>
              </button>
            </div>
          </div>
        </div>
      </div>`;

  //----------------- SEARCH BAR ------------------------------------------
  let search_btn = document.querySelector("#searchBtn");
  let search_inpt = document.querySelector("#searchInpt");

  search_btn.addEventListener("click", (e) => {
    e.preventDefault();

    let val = search_inpt.value;
    let curr_genre = "Fantasy";

    db.collection("books")
      .where("title", "==", val)
      .where("genre", "==", curr_genre)
      .get()
      .then((res) => {
        let mydocs = res.docs;

        if (mydocs.length == 0) {
          alert("No book found");
          return;
        }

        mydocs.forEach((d) => {
          mainContent.innerHTML = `
          <div class="container is-fluid">
            <!-- search bar -->
            <form id="searchbar" class="mb-6 mx-6" action="#">
              <div class="field is-grouped">
                <div class="control is-expanded">
                  <input id="searchInpt" type="text" class="input" placeholder="Search" />
                </div>
                <div class="control">
                  <button id="searchBtn" class="button has-background-success-dark has-text-white">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="container is-fluid">
            <!-- Book -->
            <div class="card has-background-grey-lighter mb-5">
              <div class="card-content">
                <div class="media">
                  <!-- image column -->
                  <div class="image-left mr-5">
                  ${d.data().image}
                  </div>
                  <!-- text column -->
                  <div class="text">
                    <h2  class="title is-size-4 mb-1 has-text-weight-medium">
                    ${d.data().title}
                    </h2>

                    <p class = "author">
                      <span class="has-text-weight-bold">Author: </span>${
                        d.data().author
                      }
                    </p>
                    <p class = "genre" ><span class="has-text-weight-bold">Genre: </span>${
                      d.data().genre
                    }</p>
                    <p class = "date">
                      <span class="has-text-weight-bold">Publication Date: </span
                      >${d.data().date}
                    </p>
                    <p class = "des">
                      <span class="has-text-weight-bold">Description: </span>${
                        d.data().description
                      }
                    </p>
                  </div>
                </div>
                <!-- add book -->
                <div class="has-text-right" >
                  <button
                    class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
                  >
                  <i class="fa-regular fa-bookmark has-text-success-dark"></i>
                  <p class="has-text-success-dark has-text-weight-semibold is-inline">
                    Add to My Bookshelf
                  </p>
                  </button>
                </div>
              </div>
            </div>
          </div>`;
        });
        // disable instead of toggle buttons - fantasy page
        let btns = document.querySelectorAll(".Rbtn");

        btns.forEach((b) => {
          b.addEventListener("click", function () {
            // add to Firebase collection
            let card = b.closest(".card");
            // title
            let title = card.querySelector(".title").textContent;
            // author
            let authText = card.querySelector(".author").textContent;
            let spanTextA = card
              .querySelector(".author")
              .querySelector("span").textContent;
            let author = authText.replace(spanTextA, "");
            // genre
            let genreText = card.querySelector(".genre").textContent;
            let spanTextG = card
              .querySelector(".genre")
              .querySelector("span").textContent;
            let genre = genreText.replace(spanTextG, "");
            // date
            let dateText = card.querySelector(".date").textContent;
            let spanTextDa = card
              .querySelector(".date")
              .querySelector("span").textContent;
            let date = dateText.replace(spanTextDa, "");
            // des
            let desText = card.querySelector(".des").textContent;
            let spanTextDe = card
              .querySelector(".des")
              .querySelector("span").textContent;
            let des = desText.replace(spanTextDe, "");

            // img
            let img = card.querySelector(".image-left").innerHTML;

            // add book
            add_book(title, author, genre, date, des, img);

            // change button after clicked
            b.disabled = true;
          });
        });

        document.querySelector("#searchbar").reset();
      });
  });
  //---------------------------------------------------------------

  // disable instead of toggle buttons - fantasy page
  let btns = document.querySelectorAll(".Rbtn");

  btns.forEach((b) => {
    b.addEventListener("click", function () {
      // add to Firebase collection
      let card = b.closest(".card");
      // title
      let title = card.querySelector(".title").textContent;
      // author
      let authText = card.querySelector(".author").textContent;
      let spanTextA = card
        .querySelector(".author")
        .querySelector("span").textContent;
      let author = authText.replace(spanTextA, "");
      // genre
      let genreText = card.querySelector(".genre").textContent;
      let spanTextG = card
        .querySelector(".genre")
        .querySelector("span").textContent;
      let genre = genreText.replace(spanTextG, "");
      // date
      let dateText = card.querySelector(".date").textContent;
      let spanTextDa = card
        .querySelector(".date")
        .querySelector("span").textContent;
      let date = dateText.replace(spanTextDa, "");
      // des
      let desText = card.querySelector(".des").textContent;
      let spanTextDe = card
        .querySelector(".des")
        .querySelector("span").textContent;
      let des = desText.replace(spanTextDe, "");

      // img
      let img = card.querySelector(".image-left").innerHTML;

      // add book
      add_book(title, author, genre, date, des, img);

      // change button after clicked
      b.disabled = true;
    });
  });

  //EXTRAAAAAA

  let titles_list = [];

  if (auth.currentUser != null) {
    db.collection("bookshelf_USERS")
      .where("email", "==", auth.currentUser.email)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDocId = querySnapshot.docs[0].id;

          // Check if the book already exists in the user's collection
          db.collection("bookshelf_USERS")
            .doc(userDocId)
            .collection("my_books")
            .get()
            .then((res) => {
              let mydocs = res.docs;
              mydocs.forEach((d) => {
                titles_list.push(d.data().Title.trim());
              });

              db.collection("books")
                .where("genre", "==", "Fantasy")
                .get()
                .then((res) => {
                  let mydocs = res.docs;

                  mydocs.forEach((d) => {
                    let title = d.data().title;
                    if (titles_list.includes(title)) {
                      //disable that book card's button
                      let titleElement = document.getElementById(`${title}`);
                      if (titleElement) {
                        // Find the button within the container
                        let addButton = titleElement
                          .closest(".card")
                          .querySelector(".Rbtn");
                        if (addButton) {
                          addButton.disabled = true;
                        }
                      }
                    }
                  });
                });
            });
        }
      });
  }

  // to add books to collection - keep commented out
  // document.querySelectorAll(".title").forEach((title, index) => {
  //   // author
  //   let a1 = document.querySelectorAll(".author")[index];
  //   let a1_2 = document.querySelectorAll(".author")[index].textContent;
  //   let a2 = a1.querySelector("span").textContent;
  //   let a3 = a1_2.replace(a2, "").trim();
  //   // date
  //   let da1 = document.querySelectorAll(".date")[index];
  //   let da1_2 = document.querySelectorAll(".date")[index].textContent;
  //   let da2 = da1.querySelector("span").textContent;
  //   let da3 = da1_2.replace(da2, "").trim();
  //   // description
  //   let de1 = document.querySelectorAll(".des")[index];
  //   let de1_2 = document.querySelectorAll(".des")[index].textContent;
  //   let de2 = de1.querySelector("span").textContent;
  //   let de3 = de1_2.replace(de2, "").trim();
  //   // add
  //   let rcbooks_col = {
  //     title: title.innerHTML.trim(),
  //     author: a3,
  //     genre: "Fantasy",
  //     date: da3,
  //     description: de3,
  //     image: document.querySelectorAll(".image-left")[index].innerHTML.trim(),
  //   };
  //   db.collection("books").add(rcbooks_col);
  // });
});

// show Rom Coms page
document.querySelector("#romcomPage").addEventListener("click", () => {
  tabTitle.innerHTML = `Bookshelf | Rom Coms`;

  header.innerHTML = `Romantic Comedy Books`;

  mainContent.innerHTML = `
  <div class="container is-fluid">
        <!-- search bar -->
        <form id="searchbar" class="mb-6 mx-6" action="#">
          <div class="field is-grouped">
            <div class="control is-expanded">
              <input id="searchInpt" type="text" class="input" placeholder="Search" />
            </div>
            <div class="control">
              <button id="searchBtn" class="button has-background-success-dark has-text-white">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      <div class="container is-fluid">
        <!-- Book 1 -->
        <div class="card has-background-grey-lighter mb-5">
          <div class="card-content">
            <div class="media">
              <!-- image column -->
              <div class="image-left mr-5">
                <figure class="image is-128x128">
                  <img
                    src="images/beach read.jpg"
                    alt="Beach Read"
                  />
                </figure>
              </div>
              <!-- text column -->
              <div class="text">
                <h2 id = "Beach Read" class="title is-size-4 mb-1 has-text-weight-medium">
                    Beach Read
                </h2>

                <p class = "author">
                  <span class="has-text-weight-bold">Author: </span>Emily Henry
                </p>
                <p class = "genre"><span class="has-text-weight-bold">Genre: </span>Romantic Comedy</p>
                <p class = "date">
                  <span class="has-text-weight-bold">Publication Date: </span
                  >2020
                </p>
                <p class = "des">
                  <span class="has-text-weight-bold">Description: </span>Augustus Everett is an acclaimed author of literary
                  fiction. January Andrews writes bestselling romance. When she pens
                  a happily ever after, he kills off his entire cast. They’re polar
                  opposites. In fact, the only thing they have in common is that for
                  the next three months, they’re living in neighboring beach houses,
                  broke, and bogged down with writer’s block. Until, one hazy
                  evening, one thing leads to another and they strike a deal
                  designed to force them out of their creative ruts: Augustus will
                  spend the summer writing something happy, and January will pen the
                  next Great American Novel. She’ll take him on field trips worthy
                  of any rom-com montage, and he’ll take her to interview surviving
                  members of a backwoods death cult (obviously). Everyone will
                  finish a book and no-one will fall in love. Really.
                </p>
              </div>
            </div>
            <!-- add book -->
            <div class="has-text-right">
              <button  id = "f4" 
                class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
              >
              <i class="fa-regular fa-bookmark has-text-success-dark"></i>
              <p class="has-text-success-dark has-text-weight-semibold is-inline">
                Add to My Bookshelf
              </p>
              </button>
            </div>
          </div>
        </div>
        <!-- Book 2 -->
        <div class="card has-background-grey-lighter mb-5">
          <div class="card-content">
            <div class="media">
              <!-- image column -->
              <div class="image-left mr-5">
                <figure class="image is-128x128">
                  <img
                    src="images/the hating game.jpg"
                    alt="The Hating Game"
                  />
                </figure>
              </div>
              <!-- text column -->
              <div class="text">
                <h2 id = "The Hating Game" class="title is-size-4 mb-1 has-text-weight-medium">
                The Hating Game
                </h2>

                <p class = "author">
                  <span class="has-text-weight-bold">Author: </span>Sally Thorne
                </p>
                <p class = "genre"><span class="has-text-weight-bold">Genre: </span>Romantic Comedy</p>
                <p class = "date">
                  <span class="has-text-weight-bold">Publication Date: </span
                  >2016
                </p>
                <p class = "des">
                  <span class="has-text-weight-bold">Description: </span>Lucy Hutton and Joshua Templeman hate each other. Not
                  dislike. Not begrudgingly tolerate. Hate. And they have no problem
                  displaying their feelings through a series of ritualistic passive
                  aggressive maneuvers as they sit across from each other, executive
                  assistants to co-CEOs of a publishing company. Lucy can’t
                  understand Joshua’s joyless, uptight, meticulous approach to his
                  job. Joshua is clearly baffled by Lucy’s overly bright clothes,
                  quirkiness, and Pollyanna attitude. Now up for the same promotion,
                  their battle of wills has come to a head and Lucy refuses to back
                  down when their latest game could cost her her dream job…But the
                  tension between Lucy and Joshua has also reached its boiling
                  point, and Lucy is discovering that maybe she doesn’t hate Joshua.
                  And maybe, he doesn’t hate her either. Or maybe this is just
                  another game.
                </p>
              </div>
            </div>
            <!-- add book -->
            <div class="has-text-right">
              <button  id = "f4" 
                class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
              >
              <i class="fa-regular fa-bookmark has-text-success-dark"></i>
              <p class="has-text-success-dark has-text-weight-semibold is-inline">
                Add to My Bookshelf
              </p>
              </button>
            </div>
          </div>
        </div>
        <!-- Book 3 -->
        <div class="card has-background-grey-lighter mb-5">
          <div class="card-content">
            <div class="media">
              <!-- image column -->
              <div class="image-left mr-5">
                <figure class="image is-128x128">
                  <img src="images/red white and royal blue.jpg" alt="Red, White and Royal Blue" />
                </figure>
              </div>
              <!-- text column -->
              <div class="text">
                <h2 id = "Red, White and Royal Blue" class="title is-size-4 mb-1 has-text-weight-medium">
                Red, White and Royal Blue
                </h2>

                <p class = "author">
                  <span class="has-text-weight-bold">Author: </span>Casey McQuiston
                </p>
                <p class = "genre"><span class="has-text-weight-bold">Genre: </span>Romantic Comedy</p>
                <p class = "date">
                  <span class="has-text-weight-bold">Publication Date: </span
                  >2019
                </p>
                <p class = "des">
                  <span class="has-text-weight-bold">Description: </span>First Son Alex Claremont-Diaz is the closest thing to
                  a prince this side of the Atlantic. With his intrepid sister and
                  the Veep’s genius granddaughter, they’re the White House Trio, a
                  beautiful millennial marketing strategy for his mother, President
                  Ellen Claremont. International socialite duties do have
                  downsides—namely, when photos of a confrontation with his longtime
                  nemesis Prince Henry at a royal wedding leak to the tabloids and
                  threaten American/British relations. The plan for damage control:
                  staging a fake friendship between the First Son and the Prince. As
                  President Claremont kicks off her reelection bid, Alex finds
                  himself hurtling into a secret relationship with Henry that could
                  derail the campaign and upend two nations. What is worth the
                  sacrifice? How do you do all the good you can do? And, most
                  importantly, how will history remember you?
                </p>
              </div>
            </div>
            <!-- add book -->
            <div class="has-text-right">
              <button  id = "f4" 
                class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
              >
              <i class="fa-regular fa-bookmark has-text-success-dark"></i>
              <p class="has-text-success-dark has-text-weight-semibold is-inline">
                Add to My Bookshelf
              </p>
              </button>
            </div>
          </div>
        </div>
        <!-- Book 4 -->
        <div class="card has-background-grey-lighter mb-5">
          <div class="card-content">
            <div class="media">
              <!-- image column -->
              <div class="image-left mr-5">
                <figure class="image is-128x128">
                  <img
                    src="images/the spanish love deception.jpg"
                    alt="The Spanish Love Deception"
                  />
                </figure>
              </div>
              <!-- text column -->
              <div class="text">
                <h2 id = "The Spanish Love Deception" class="title is-size-4 mb-1 has-text-weight-medium">
                The Spanish Love Deception
                </h2>

                <p class = "author">
                  <span class="has-text-weight-bold">Author: </span>Elena Armas
                </p>
                <p class = "genre"><span class="has-text-weight-bold">Genre: </span>Romantic Comedy</p>
                <p class = "date">
                  <span class="has-text-weight-bold">Publication Date: </span
                  >2021
                </p>
                <p class = "des">
                  <span class="has-text-weight-bold">Description: </span>Catalina Martín desperately needs a date to her
                  sister’s wedding. Especially since her little white lie about her
                  American boyfriend has spiralled out of control. Now everyone she
                  knows—including her ex and his fiancée—will be there and eager to
                  meet him. She only has four weeks to find someone willing to cross
                  the Atlantic and aid in her deception. New York to Spain is no
                  short flight and her raucous family won’t be easy to fool. Enter
                  Aaron Blackford—her tall, handsome, condescending colleague—who
                  surprisingly offers to step in. She’d rather refuse; never has
                  there been a more aggravating, blood-boiling, and insufferable
                  man. But Catalina is desperate, and as the wedding draws nearer,
                  Aaron looks like her best option. And she begins to realize he
                  might not be as terrible in the real world as he is at the office.
                </p>
              </div>
            </div>
            <!-- add book -->
            <div class="has-text-right">
              <button  id = "f4" 
                class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
              >
              <i class="fa-regular fa-bookmark has-text-success-dark"></i>
              <p class="has-text-success-dark has-text-weight-semibold is-inline">
                Add to My Bookshelf
              </p>
              </button>
            </div>
          </div>
        </div>
      </div>`;

  // toggle buttons
  // let toggle = true;
  // let btns = document.querySelectorAll(".Rbtn");

  // btns.forEach((b) => {
  //   b.addEventListener("click", function () {
  //     if (toggle) {
  //       b.innerHTML = `<i class="fa-solid fa-bookmark has-text-danger-dark"></i>
  //       <p class="has-text-danger-dark has-text-weight-semibold is-inline">
  //         Remove from My Bookshelf
  //     </p>`;
  //     } else {
  //       b.innerHTML = `<i class="fa-regular fa-bookmark has-text-success-dark"></i>
  //       <p class="has-text-success-dark has-text-weight-semibold is-inline">
  //         Add to My Bookshelf
  //       </p>`;
  //     }

  //     toggle = !toggle;
  //   });
  // });

  let btns2 = document.querySelectorAll(".Rbtn");

  btns2.forEach((b) => {
    b.addEventListener("click", () => {
      let card = b.closest(".card");
      // title
      let title = card.querySelector(".title").textContent;
      // author
      let authText = card.querySelector(".author").textContent;
      let spanTextA = card
        .querySelector(".author")
        .querySelector("span").textContent;
      let author = authText.replace(spanTextA, "");
      // genre
      let genreText = card.querySelector(".genre").textContent;
      let spanTextG = card
        .querySelector(".genre")
        .querySelector("span").textContent;
      let genre = genreText.replace(spanTextG, "");
      // date
      let dateText = card.querySelector(".date").textContent;
      let spanTextDa = card
        .querySelector(".date")
        .querySelector("span").textContent;
      let date = dateText.replace(spanTextDa, "");
      // des
      let desText = card.querySelector(".des").textContent;
      let spanTextDe = card
        .querySelector(".des")
        .querySelector("span").textContent;
      let des = desText.replace(spanTextDe, "");

      // img
      let img = card.querySelector(".image-left").innerHTML;

      // add book
      add_book(title, author, genre, date, des, img);

      // change button after clicked
      b.disabled = true;
    });
  });

  //----------------- SEARCH BAR ------------------------------------------
  let search_btn = document.querySelector("#searchBtn");
  let search_inpt = document.querySelector("#searchInpt");

  search_btn.addEventListener("click", (e) => {
    e.preventDefault();

    let val = search_inpt.value;
    let curr_genre = "Romantic Comedy";

    db.collection("books")
      .where("title", "==", val)
      .where("genre", "==", curr_genre)
      .get()
      .then((res) => {
        let mydocs = res.docs;

        if (mydocs.length == 0) {
          alert("No book found");
          return;
        }

        mydocs.forEach((d) => {
          mainContent.innerHTML = `
          <div class="container is-fluid">
            <!-- search bar -->
            <form id="searchbar" class="mb-6 mx-6" action="#">
              <div class="field is-grouped">
                <div class="control is-expanded">
                  <input id="searchInpt" type="text" class="input" placeholder="Search" />
                </div>
                <div class="control">
                  <button id="searchBtn" class="button has-background-success-dark has-text-white">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="container is-fluid">
            <!-- Book -->
            <div class="card has-background-grey-lighter mb-5">
              <div class="card-content">
                <div class="media">
                  <!-- image column -->
                  <div class="image-left mr-5">
                  ${d.data().image}
                  </div>
                  <!-- text column -->
                  <div class="text">
                    <h2  class="title is-size-4 mb-1 has-text-weight-medium">
                    ${d.data().title}
                    </h2>

                    <p class = "author">
                      <span class="has-text-weight-bold">Author: </span>${
                        d.data().author
                      }
                    </p>
                    <p class = "genre" ><span class="has-text-weight-bold">Genre: </span>${
                      d.data().genre
                    }</p>
                    <p class = "date">
                      <span class="has-text-weight-bold">Publication Date: </span
                      >${d.data().date}
                    </p>
                    <p class = "des">
                      <span class="has-text-weight-bold">Description: </span>${
                        d.data().description
                      }
                    </p>
                  </div>
                </div>
                <!-- add book -->
                <div class="has-text-right" >
                  <button
                    class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
                  >
                  <i class="fa-regular fa-bookmark has-text-success-dark"></i>
                  <p class="has-text-success-dark has-text-weight-semibold is-inline">
                    Add to My Bookshelf
                  </p>
                  </button>
                </div>
              </div>
            </div>
          </div>`;
        });
        // disable instead of toggle buttons - fantasy page
        let btns = document.querySelectorAll(".Rbtn");

        btns.forEach((b) => {
          b.addEventListener("click", function () {
            // add to Firebase collection
            let card = b.closest(".card");
            // title
            let title = card.querySelector(".title").textContent;
            // author
            let authText = card.querySelector(".author").textContent;
            let spanTextA = card
              .querySelector(".author")
              .querySelector("span").textContent;
            let author = authText.replace(spanTextA, "");
            // genre
            let genreText = card.querySelector(".genre").textContent;
            let spanTextG = card
              .querySelector(".genre")
              .querySelector("span").textContent;
            let genre = genreText.replace(spanTextG, "");
            // date
            let dateText = card.querySelector(".date").textContent;
            let spanTextDa = card
              .querySelector(".date")
              .querySelector("span").textContent;
            let date = dateText.replace(spanTextDa, "");
            // des
            let desText = card.querySelector(".des").textContent;
            let spanTextDe = card
              .querySelector(".des")
              .querySelector("span").textContent;
            let des = desText.replace(spanTextDe, "");

            // img
            let img = card.querySelector(".image-left").innerHTML;

            // add book
            add_book(title, author, genre, date, des, img);

            // change button after clicked
            b.disabled = true;
          });
        });

        document.querySelector("#searchbar").reset();
      });
  });

  //EXTRAAAAAA

  let titles_list = [];

  if (auth.currentUser != null) {
    db.collection("bookshelf_USERS")
      .where("email", "==", auth.currentUser.email)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDocId = querySnapshot.docs[0].id;

          // Check if the book already exists in the user's collection
          db.collection("bookshelf_USERS")
            .doc(userDocId)
            .collection("my_books")
            .get()
            .then((res) => {
              let mydocs = res.docs;
              mydocs.forEach((d) => {
                titles_list.push(d.data().Title.trim());
              });

              db.collection("books")
                .where("genre", "==", "Romantic Comedy")
                .get()
                .then((res) => {
                  let mydocs = res.docs;

                  mydocs.forEach((d) => {
                    let title = d.data().title;
                    if (titles_list.includes(title)) {
                      //disable that book card's button
                      let titleElement = document.getElementById(`${title}`);
                      if (titleElement) {
                        // Find the button within the container
                        let addButton = titleElement
                          .closest(".card")
                          .querySelector(".Rbtn");
                        if (addButton) {
                          addButton.disabled = true;
                        }
                      }
                    }
                  });
                });
            });
        }
      });
  }

  //---------------------------------------------------------------

  // to add books to collection - keep commented out
  // document.querySelectorAll(".title").forEach((title, index) => {
  //   // author
  //   let a1 = document.querySelectorAll(".author")[index];
  //   let a1_2 = document.querySelectorAll(".author")[index].textContent;
  //   let a2 = a1.querySelector("span").textContent;
  //   let a3 = a1_2.replace(a2, "").trim();
  //   // date
  //   let da1 = document.querySelectorAll(".date")[index];
  //   let da1_2 = document.querySelectorAll(".date")[index].textContent;
  //   let da2 = da1.querySelector("span").textContent;
  //   let da3 = da1_2.replace(da2, "").trim();
  //   // description
  //   let de1 = document.querySelectorAll(".des")[index];
  //   let de1_2 = document.querySelectorAll(".des")[index].textContent;
  //   let de2 = de1.querySelector("span").textContent;
  //   let de3 = de1_2.replace(de2, "").trim();
  //   // add
  //   let rcbooks_col = {
  //     title: title.innerHTML.trim(),
  //     author: a3,
  //     genre: "Romantic Comedy",
  //     date: da3,
  //     description: de3,
  //     image: document.querySelectorAll(".image-left")[index].innerHTML.trim(),
  //   };
  //   db.collection("books").add(rcbooks_col);
  // });
});

// show Mystery page
document.querySelector("#mysteryPage").addEventListener("click", () => {
  tabTitle.innerHTML = `Bookshelf | Mystery`;

  header.innerHTML = `Mystery Books`;

  mainContent.innerHTML = `
  <div class="container is-fluid">
        <!-- search bar -->
        <form id="searchbar" class="mb-6 mx-6" action="#">
          <div class="field is-grouped">
            <div class="control is-expanded">
              <input id="searchInpt" type="text" class="input" placeholder="Search" />
            </div>
            <div class="control">
              <button id="searchBtn" class="button has-background-success-dark has-text-white">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      <div class="container is-fluid">
        <!-- Book 1 -->
        <div class="card has-background-grey-lighter mb-5">
          <div class="card-content">
            <div class="media">
              <!-- image column -->
              <div class="image-left mr-5">
                <figure class="image is-128x128">
                  <img
                    src="images/m1.jpeg"
                    alt="A Good Girl's Guide to Murder cover"
                  />
                </figure>
              </div>
              <!-- text column -->
              <div class="text">
                <h2 id = "A Good Girl's Guide to Murder" class="title is-size-4 mb-1 has-text-weight-medium">
                  A Good Girl's Guide to Murder
                </h2>

                <p class = "author">
                  <span class="has-text-weight-bold">Author: </span>Holly
                  Jackson
                </p>
                <p class = "genre"><span class="has-text-weight-bold">Genre: </span>Mystery</p>
                <p class = "date">
                  <span class="has-text-weight-bold">Publication Date: </span
                  >2019
                </p>
                <p class = "des">
                  <span class="has-text-weight-bold">Description: </span>Five
                  years ago, a tragic murder-suicide rocked the small town of
                  Little Kilton, when a schoolgirl Andie Bell was brutally
                  murdered and her boyfriend, Sal Singh, was accused before
                  seemingly taking his own life. But 17-year-old Pippa, is
                  convinced that the real killer is still out there.
                </p>
              </div>
            </div>
            <!-- add book -->
            <div class="has-text-right">
            <button  id = "f4" 
              class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
            >
            <i class="fa-regular fa-bookmark has-text-success-dark"></i>
            <p class="has-text-success-dark has-text-weight-semibold is-inline">
              Add to My Bookshelf
            </p>
            </button>
          </div>
          </div>
        </div>
        <!-- Book 2 -->
        <div class="card has-background-grey-lighter mb-5">
          <div class="card-content">
            <div class="media">
              <!-- image column -->
              <div class="image-left mr-5">
                <figure class="image is-128x128">
                  <img
                    src="images/m2.jpeg"
                    alt="Murder in Old Bombay: A Mystery cover"
                  />
                </figure>
              </div>
              <!-- text column -->
              <div class="text">
                <h2 id = "Murder in Old Bombay: A Mystery" class="title is-size-4 mb-1 has-text-weight-medium">
                  Murder in Old Bombay: A Mystery
                </h2>

                <p class = "author">
                  <span class="has-text-weight-bold">Author: </span>Nev March
                </p>
                <p class = "genre"><span class="has-text-weight-bold">Genre: </span>Mystery</p>
                <p class = "date">
                  <span class="has-text-weight-bold">Publication Date: </span
                  >2010
                </p>
                <p class = "des">
                  <span class="has-text-weight-bold">Description: </span>In
                  1892, Bombay is the center of British India. Nearby, Captain
                  Jim Agnihotri lies in Poona military hospital recovering from
                  a skirmish on the wild northern frontier, with little to do
                  but re-read the tales of his idol, Sherlock Holmes, and browse
                  the daily papers.
                </p>
              </div>
            </div>
            <!-- add book -->
            <div class="has-text-right">
              <button  id = "f4" 
                class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
              >
              <i class="fa-regular fa-bookmark has-text-success-dark"></i>
              <p class="has-text-success-dark has-text-weight-semibold is-inline">
                Add to My Bookshelf
              </p>
              </button>
            </div>
          </div>
        </div>
        <!-- Book 3 -->
        <div class="card has-background-grey-lighter mb-5">
          <div class="card-content">
            <div class="media">
              <!-- image column -->
              <div class="image-left mr-5">
                <figure class="image is-128x128">
                  <img src="images/m3.jpeg" alt="The Girl On The Train cover" />
                </figure>
              </div>
              <!-- text column -->
              <div class="text">
                <h2 id = "The Girl On The Train" class="title is-size-4 mb-1 has-text-weight-medium">
                  The Girl On The Train
                </h2>

                <p class = "author">
                  <span class="has-text-weight-bold">Author: </span>Paula
                  Hawkins
                </p>
                <p class = "genre"><span class="has-text-weight-bold">Genre: </span>Mystery</p>
                <p class = "date">
                  <span class="has-text-weight-bold">Publication Date: </span
                  >2015
                </p>
                <p class = "des">
                  <span class="has-text-weight-bold">Description: </span>The
                  Girl on the Train is a 2015 psychological thriller novel by
                  British author Paula Hawkins that gives narratives from three
                  different women about relationship troubles (caused by
                  coercive/controlling men) and, for the main protagonist,
                  alcoholism.
                </p>
              </div>
            </div>
            <!-- add book -->
            <div class="has-text-right">
              <button  id = "f4" 
                class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
              >
              <i class="fa-regular fa-bookmark has-text-success-dark"></i>
              <p class="has-text-success-dark has-text-weight-semibold is-inline">
                Add to My Bookshelf
              </p>
              </button>
            </div>
          </div>
        </div>
        <!-- Book 4 -->
        <div class="card has-background-grey-lighter mb-5">
          <div class="card-content">
            <div class="media">
              <!-- image column -->
              <div class="image-left mr-5">
                <figure class="image is-128x128">
                  <img
                    src="images/m4.jpeg"
                    alt="The Socialite's Guide to Murder cover"
                  />
                </figure>
              </div>
              <!-- text column -->
              <div class="text">
                <h2 id = "The Socialite's Guide to Murder" class="title is-size-4 mb-1 has-text-weight-medium">
                  The Socialite's Guide to Murder
                </h2>

                <p class = "author">
                  <span class="has-text-weight-bold">Author: </span>S.K Golding
                </p>
                <p class ="genre"><span class="has-text-weight-bold">Genre: </span>Mystery</p>
                <p class = "date">
                  <span class="has-text-weight-bold">Publication Date: </span
                  >2022
                </p>
                <p class = "des">
                  <span class="has-text-weight-bold">Description: </span>At a
                  party for artist Billie Bell, his newest work is stolen, and
                  Evelyn's fake boyfriend (and real best friend), movie star
                  Henry Fox, is accused of the theft. But just as Evelyn sets
                  out to prove Henry's innocence, she finds Billie Bell dead.
                  The murder weapon links the crime to the hotel's chief of
                  security.
                </p>
              </div>
            </div>
            <!-- add book -->
            <div class="has-text-right">
            <button  id = "f4" 
              class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
            >
            <i class="fa-regular fa-bookmark has-text-success-dark"></i>
            <p class="has-text-success-dark has-text-weight-semibold is-inline">
              Add to My Bookshelf
            </p>
            </button>
          </div>
          </div>
        </div>
      </div>`;

  // toggle buttons
  // let toggle = true;
  // let btns = document.querySelectorAll(".Rbtn");

  // btns.forEach((b) => {
  //   b.addEventListener("click", function () {
  //     if (toggle) {
  //       b.innerHTML = `<i class="fa-solid fa-bookmark has-text-danger-dark"></i>
  //     <p class="has-text-danger-dark has-text-weight-semibold is-inline">
  //       Remove from My Bookshelf
  //   </p>`;
  //     } else {
  //       b.innerHTML = `<i class="fa-regular fa-bookmark has-text-success-dark"></i>
  //     <p class="has-text-success-dark has-text-weight-semibold is-inline">
  //       Add to My Bookshelf
  //     </p>`;
  //     }

  //     toggle = !toggle;
  //   });
  // });

  let btns2 = document.querySelectorAll(".Rbtn");

  btns2.forEach((b) => {
    b.addEventListener("click", () => {
      let card = b.closest(".card");
      // title
      let title = card.querySelector(".title").textContent;
      // author
      let authText = card.querySelector(".author").textContent;
      let spanTextA = card
        .querySelector(".author")
        .querySelector("span").textContent;
      let author = authText.replace(spanTextA, "");
      // genre
      let genreText = card.querySelector(".genre").textContent;
      let spanTextG = card
        .querySelector(".genre")
        .querySelector("span").textContent;
      let genre = genreText.replace(spanTextG, "");
      // date
      let dateText = card.querySelector(".date").textContent;
      let spanTextDa = card
        .querySelector(".date")
        .querySelector("span").textContent;
      let date = dateText.replace(spanTextDa, "");
      // des
      let desText = card.querySelector(".des").textContent;
      let spanTextDe = card
        .querySelector(".des")
        .querySelector("span").textContent;
      let des = desText.replace(spanTextDe, "");

      // img
      let img = card.querySelector(".image-left").innerHTML;

      // add book
      add_book(title, author, genre, date, des, img);

      // change button after clicked
      b.disabled = true;
    });
  });

  //----------------- SEARCH BAR ------------------------------------------
  let search_btn = document.querySelector("#searchBtn");
  let search_inpt = document.querySelector("#searchInpt");

  search_btn.addEventListener("click", (e) => {
    e.preventDefault();

    let val = search_inpt.value;
    let curr_genre = "Mystery";

    db.collection("books")
      .where("title", "==", val)
      .where("genre", "==", curr_genre)
      .get()
      .then((res) => {
        let mydocs = res.docs;

        if (mydocs.length == 0) {
          alert("No book found");
          return;
        }

        mydocs.forEach((d) => {
          mainContent.innerHTML = `
          <div class="container is-fluid">
            <!-- search bar -->
            <form id="searchbar" class="mb-6 mx-6" action="#">
              <div class="field is-grouped">
                <div class="control is-expanded">
                  <input id="searchInpt" type="text" class="input" placeholder="Search" />
                </div>
                <div class="control">
                  <button id="searchBtn" class="button has-background-success-dark has-text-white">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="container is-fluid">
            <!-- Book -->
            <div class="card has-background-grey-lighter mb-5">
              <div class="card-content">
                <div class="media">
                  <!-- image column -->
                  <div class="image-left mr-5">
                  ${d.data().image}
                  </div>
                  <!-- text column -->
                  <div class="text">
                    <h2  class="title is-size-4 mb-1 has-text-weight-medium">
                    ${d.data().title}
                    </h2>

                    <p class = "author">
                      <span class="has-text-weight-bold">Author: </span>${
                        d.data().author
                      }
                    </p>
                    <p class = "genre" ><span class="has-text-weight-bold">Genre: </span>${
                      d.data().genre
                    }</p>
                    <p class = "date">
                      <span class="has-text-weight-bold">Publication Date: </span
                      >${d.data().date}
                    </p>
                    <p class = "des">
                      <span class="has-text-weight-bold">Description: </span>${
                        d.data().description
                      }
                    </p>
                  </div>
                </div>
                <!-- add book -->
                <div class="has-text-right" >
                  <button
                    class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
                  >
                  <i class="fa-regular fa-bookmark has-text-success-dark"></i>
                  <p class="has-text-success-dark has-text-weight-semibold is-inline">
                    Add to My Bookshelf
                  </p>
                  </button>
                </div>
              </div>
            </div>
          </div>`;
        });
        // disable instead of toggle buttons - fantasy page
        let btns = document.querySelectorAll(".Rbtn");

        btns.forEach((b) => {
          b.addEventListener("click", function () {
            // add to Firebase collection
            let card = b.closest(".card");
            // title
            let title = card.querySelector(".title").textContent;
            // author
            let authText = card.querySelector(".author").textContent;
            let spanTextA = card
              .querySelector(".author")
              .querySelector("span").textContent;
            let author = authText.replace(spanTextA, "");
            // genre
            let genreText = card.querySelector(".genre").textContent;
            let spanTextG = card
              .querySelector(".genre")
              .querySelector("span").textContent;
            let genre = genreText.replace(spanTextG, "");
            // date
            let dateText = card.querySelector(".date").textContent;
            let spanTextDa = card
              .querySelector(".date")
              .querySelector("span").textContent;
            let date = dateText.replace(spanTextDa, "");
            // des
            let desText = card.querySelector(".des").textContent;
            let spanTextDe = card
              .querySelector(".des")
              .querySelector("span").textContent;
            let des = desText.replace(spanTextDe, "");

            // img
            let img = card.querySelector(".image-left").innerHTML;

            // add book
            add_book(title, author, genre, date, des, img);

            // change button after clicked
            b.disabled = true;
          });
        });

        document.querySelector("#searchbar").reset();
      });
  });

  let titles_list = [];

  if (auth.currentUser != null) {
    db.collection("bookshelf_USERS")
      .where("email", "==", auth.currentUser.email)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDocId = querySnapshot.docs[0].id;

          // Check if the book already exists in the user's collection
          db.collection("bookshelf_USERS")
            .doc(userDocId)
            .collection("my_books")
            .get()
            .then((res) => {
              let mydocs = res.docs;
              mydocs.forEach((d) => {
                titles_list.push(d.data().Title.trim());
              });

              db.collection("books")
                .where("genre", "==", "Mystery")
                .get()
                .then((res) => {
                  let mydocs = res.docs;

                  mydocs.forEach((d) => {
                    let title = d.data().title;
                    if (titles_list.includes(title)) {
                      //disable that book card's button
                      let titleElement = document.getElementById(`${title}`);
                      if (titleElement) {
                        // Find the button within the container
                        let addButton = titleElement
                          .closest(".card")
                          .querySelector(".Rbtn");
                        if (addButton) {
                          addButton.disabled = true;
                        }
                      }
                    }
                  });
                });
            });
        }
      });
  }

  //---------------------------------------------------------------

  // to add books to collection - keep commented out
  // document.querySelectorAll(".title").forEach((title, index) => {
  //   // author
  //   let a1 = document.querySelectorAll(".author")[index];
  //   let a1_2 = document.querySelectorAll(".author")[index].textContent;
  //   let a2 = a1.querySelector("span").textContent;
  //   let a3 = a1_2.replace(a2, "").trim();
  //   // date
  //   let da1 = document.querySelectorAll(".date")[index];
  //   let da1_2 = document.querySelectorAll(".date")[index].textContent;
  //   let da2 = da1.querySelector("span").textContent;
  //   let da3 = da1_2.replace(da2, "").trim();
  //   // description
  //   let de1 = document.querySelectorAll(".des")[index];
  //   let de1_2 = document.querySelectorAll(".des")[index].textContent;
  //   let de2 = de1.querySelector("span").textContent;
  //   let de3 = de1_2.replace(de2, "").trim();
  //   // add
  //   let mbooks_col = {
  //     title: title.innerHTML.trim(),
  //     author: a3,
  //     genre: "Mystery",
  //     date: da3,
  //     description: de3,
  //     image: document.querySelectorAll(".image-left")[index].innerHTML.trim(),
  //   };
  //   db.collection("books").add(mbooks_col);
  // });
});

// show Realistic Fiction page
document.querySelector("#fictionPage").addEventListener("click", () => {
  tabTitle.innerHTML = `Bookshelf | Realistic Fiction`;

  header.innerHTML = `Realistic Fiction Books`;

  mainContent.innerHTML = `
  <div class="container is-fluid">
        <!-- search bar -->
        <form id="searchbar" class="mb-6 mx-6" action="#">
          <div class="field is-grouped">
            <div class="control is-expanded">
              <input id="searchInpt" type="text" class="input" placeholder="Search" />
            </div>
            <div class="control">
              <button id="searchBtn" class="button has-background-success-dark has-text-white">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      <div class="container is-fluid">
        <!-- Book 1 -->
        <div class="card has-background-grey-lighter mb-5">
          <div class="card-content">
            <div class="media">
              <!-- image column -->
              <div class="image-left mr-5">
                <figure class="image is-128x128">
                  <img
                    src="images/wonder.jpg"
                    alt="Wonder"
                  />
                </figure>
              </div>
              <!-- text column -->
              <div class="text">
                <h2 id = "Wonder" class="title is-size-4 mb-1 has-text-weight-medium">
                Wonder
                </h2>

                <p class = "author">
                  <span class="has-text-weight-bold">Author: </span>R.J. Palacio
                </p>
                <p class = "genre"><span class="has-text-weight-bold">Genre: </span>Fiction</p>
                <p class = "date">
                  <span class="has-text-weight-bold">Publication Date: </span
                  >2012
                </p>
                <p class ="des">
                  <span class="has-text-weight-bold">Description: </span>August Pullman was born with a facial difference
                  that, up until now, has prevented him from going to a mainstream
                  school. Starting 5th grade at Beecher Prep, he wants nothing more
                  than to be treated as an ordinary kid—but his new classmates can’t
                  get past Auggie’s extraordinary face. Wonder, begins from Auggie’s
                  point of view, but soon switches to include his classmates, his
                  sister, her boyfriend, and others.
                </p>
              </div>
            </div>
            <!-- add book -->
            <div class="has-text-right">
              <button  id = "f4" 
                class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
              >
              <i class="fa-regular fa-bookmark has-text-success-dark"></i>
              <p class="has-text-success-dark has-text-weight-semibold is-inline">
                Add to My Bookshelf
              </p>
              </button>
            </div>
          </div>
        </div>
        <!-- Book 2 -->
        <div class="card has-background-grey-lighter mb-5">
          <div class="card-content">
            <div class="media">
              <!-- image column -->
              <div class="image-left mr-5">
                <figure class="image is-128x128">
                  <img
                    src="images/the hate u give.jpg"
                    alt="The Hate U Give"
                  />
                </figure>
              </div>
              <!-- text column -->
              <div class="text">
                <h2 id = "The Hate U Give" class="title is-size-4 mb-1 has-text-weight-medium">
                The Hate U Give
                </h2>

                <p class = "author">
                  <span class="has-text-weight-bold">Author: </span>Angie Thomas
                </p>
                <p class = "genre"><span class="has-text-weight-bold">Genre: </span>Fiction</p>
                <p class = "date">
                  <span class="has-text-weight-bold">Publication Date: </span
                  >2017
                </p>
                <p class = "des">
                  <span class="has-text-weight-bold">Description: </span>Sixteen-year-old Starr Carter moves between two
                  worlds: the poor neighborhood where she lives and the fancy
                  suburban prep school she attends. The uneasy balance between these
                  worlds is shattered when Starr witnesses the fatal shooting of her
                  childhood best friend Khalil at the hands of a police officer.
                  Khalil was unarmed. Soon afterward, his death is a national
                  headline. Some are calling him a thug, maybe even a drug dealer
                  and a gangbanger. Protesters are taking to the streets in Khalil’s
                  name. Some cops and the local drug lord try to intimidate Starr
                  and her family. What everyone wants to know is: what really went
                  down that night? And the only person alive who can answer that is
                  Starr. But what Starr does—or does not—say could upend her
                  community. It could also endanger her life. Inspired by the Black
                  Lives Matter movement, this is a powerful and gripping YA novel
                  about one girl's struggle for justice.
                </p>
              </div>
            </div>
            <!-- add book -->
            <div class="has-text-right">
              <button  id = "f4" 
                class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
              >
              <i class="fa-regular fa-bookmark has-text-success-dark"></i>
              <p class="has-text-success-dark has-text-weight-semibold is-inline">
                Add to My Bookshelf
              </p>
              </button>
            </div>
          </div>
        </div>
        <!-- Book 3 -->
        <div class="card has-background-grey-lighter mb-5">
          <div class="card-content">
            <div class="media">
              <!-- image column -->
              <div class="image-left mr-5">
                <figure class="image is-128x128">
                  <img src="images/the perks of being a wallflower.jpg" alt="The Perks of Being a Wallflower" />
                </figure>
              </div>
              <!-- text column -->
              <div class="text">
                <h2 id = "The Perks of Being a Wallflower" class="title is-size-4 mb-1 has-text-weight-medium">
                The Perks of Being a Wallflower
                </h2>

                <p class = "author">
                  <span class="has-text-weight-bold">Author: </span> Stephen Chbosky
                </p>
                <p class = "genre"><span class="has-text-weight-bold">Genre: </span>Fiction</p>
                <p class = "date">
                  <span class="has-text-weight-bold">Publication Date: </span
                  >1999
                </p>
                <p class = "des">
                  <span class="has-text-weight-bold">Description: </span>This is the story of what it's like to grow up in
                  high school. More intimate than a diary, Charlie's letters are
                  singular and unique, hilarious and devastating. We may not know
                  where he lives. We may not know to whom he is writing. All we know
                  is the world he shares. Caught between trying to live his life and
                  trying to run from it puts him on a strange course through
                  uncharted territory. The world of first dates and mixed tapes,
                  family dramas and new friends. The world of sex, drugs, and The
                  Rocky Horror Picture Show, when all one requires is that the
                  perfect song on that perfect drive to feel infinite.
                </p>
              </div>
            </div>
            <!-- add book -->
            <div class="has-text-right">
              <button  id = "f4" 
                class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
              >
              <i class="fa-regular fa-bookmark has-text-success-dark"></i>
              <p class="has-text-success-dark has-text-weight-semibold is-inline">
                Add to My Bookshelf
              </p>
              </button>
            </div>
          </div>
        </div>
        <!-- Book 4 -->
        <div class="card has-background-grey-lighter mb-5">
          <div class="card-content">
            <div class="media">
              <!-- image column -->
              <div class="image-left mr-5">
                <figure class="image is-128x128">
                  <img
                    src="images/the outsiders.jpg"
                    alt="The Outsiders"
                  />
                </figure>
              </div>
              <!-- text column -->
              <div class="text">
                <h2 id = "The Outsiders" class="title is-size-4 mb-1 has-text-weight-medium">
                The Outsiders
                </h2>

                <p class = "author">
                  <span class="has-text-weight-bold">Author: </span>S.E. Hinton
                </p>
                <p class = "genre"><span class="has-text-weight-bold">Genre: </span>Fiction</p>
                <p class = "date">
                  <span class="has-text-weight-bold">Publication Date: </span
                  >2022
                </p>
                <p class ="des">
                  <span class="has-text-weight-bold">Description: </span>The Outsiders is about two weeks in the life of a
                  14-year-old boy. The novel tells the story of Ponyboy Curtis and
                  his struggles with right and wrong in a society in which he
                  believes that he is an outsider. According to Ponyboy, there are
                  two kinds of people in the world: greasers and socs. A soc (short
                  for "social") has money, can get away with just about anything,
                  and has an attitude longer than a limousine. A greaser, on the
                  other hand, always lives on the outside and needs to watch his
                  back. Ponyboy is a greaser, and he's always been proud of it, even
                  willing to rumble against a gang of socs for the sake of his
                  fellow greasers--until one terrible night when his friend Johnny
                  kills a soc. The murder gets under Ponyboy's skin, causing his
                  bifurcated world to crumble and teaching him that pain feels the
                  same whether a soc or a greaser.
                </p>
              </div>
            </div>
            <!-- add book -->
            <div class="has-text-right">
              <button  id = "f4" 
                class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
              >
              <i class="fa-regular fa-bookmark has-text-success-dark"></i>
              <p class="has-text-success-dark has-text-weight-semibold is-inline">
                Add to My Bookshelf
              </p>
              </button>
            </div>
          </div>
        </div>
      </div>`;

  // toggle buttons
  // let toggle = true;
  // let btns = document.querySelectorAll(".Rbtn");

  // btns.forEach((b) => {
  //   b.addEventListener("click", function () {
  //     if (toggle) {
  //       b.innerHTML = `<i class="fa-solid fa-bookmark has-text-danger-dark"></i>
  //     <p class="has-text-danger-dark has-text-weight-semibold is-inline">
  //       Remove from My Bookshelf
  //   </p>`;
  //     } else {
  //       b.innerHTML = `<i class="fa-regular fa-bookmark has-text-success-dark"></i>
  //     <p class="has-text-success-dark has-text-weight-semibold is-inline">
  //       Add to My Bookshelf
  //     </p>`;
  //     }

  //     toggle = !toggle;
  //   });
  // });

  let btns2 = document.querySelectorAll(".Rbtn");

  btns2.forEach((b) => {
    b.addEventListener("click", () => {
      let card = b.closest(".card");
      // title
      let title = card.querySelector(".title").textContent;
      // author
      let authText = card.querySelector(".author").textContent;
      let spanTextA = card
        .querySelector(".author")
        .querySelector("span").textContent;
      let author = authText.replace(spanTextA, "");
      // genre
      let genreText = card.querySelector(".genre").textContent;
      let spanTextG = card
        .querySelector(".genre")
        .querySelector("span").textContent;
      let genre = genreText.replace(spanTextG, "");
      // date
      let dateText = card.querySelector(".date").textContent;
      let spanTextDa = card
        .querySelector(".date")
        .querySelector("span").textContent;
      let date = dateText.replace(spanTextDa, "");
      // des
      let desText = card.querySelector(".des").textContent;
      let spanTextDe = card
        .querySelector(".des")
        .querySelector("span").textContent;
      let des = desText.replace(spanTextDe, "");

      // img
      let img = card.querySelector(".image-left").innerHTML;

      // add book
      add_book(title, author, genre, date, des, img);

      // change button after clicked
      b.disabled = true;
    });
  });

  //----------------- SEARCH BAR ------------------------------------------
  let search_btn = document.querySelector("#searchBtn");
  let search_inpt = document.querySelector("#searchInpt");

  search_btn.addEventListener("click", (e) => {
    e.preventDefault();

    let val = search_inpt.value;
    let curr_genre = "Fiction";

    db.collection("books")
      .where("title", "==", val)
      .where("genre", "==", curr_genre)
      .get()
      .then((res) => {
        let mydocs = res.docs;

        if (mydocs.length == 0) {
          alert("No book found");
          return;
        }

        mydocs.forEach((d) => {
          mainContent.innerHTML = `
          <div class="container is-fluid">
            <!-- search bar -->
            <form id="searchbar" class="mb-6 mx-6" action="#">
              <div class="field is-grouped">
                <div class="control is-expanded">
                  <input id="searchInpt" type="text" class="input" placeholder="Search" />
                </div>
                <div class="control">
                  <button id="searchBtn" class="button has-background-success-dark has-text-white">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="container is-fluid">
            <!-- Book -->
            <div class="card has-background-grey-lighter mb-5">
              <div class="card-content">
                <div class="media">
                  <!-- image column -->
                  <div class="image-left mr-5">
                  ${d.data().image}
                  </div>
                  <!-- text column -->
                  <div class="text">
                    <h2  class="title is-size-4 mb-1 has-text-weight-medium">
                    ${d.data().title}
                    </h2>

                    <p class = "author">
                      <span class="has-text-weight-bold">Author: </span>${
                        d.data().author
                      }
                    </p>
                    <p class = "genre" ><span class="has-text-weight-bold">Genre: </span>${
                      d.data().genre
                    }</p>
                    <p class = "date">
                      <span class="has-text-weight-bold">Publication Date: </span
                      >${d.data().date}
                    </p>
                    <p class = "des">
                      <span class="has-text-weight-bold">Description: </span>${
                        d.data().description
                      }
                    </p>
                  </div>
                </div>
                <!-- add book -->
                <div class="has-text-right" >
                  <button
                    class="Rbtn is-size-6 has-text-danger-dark has-text-weight-semibold"
                  >
                  <i class="fa-regular fa-bookmark has-text-success-dark"></i>
                  <p class="has-text-success-dark has-text-weight-semibold is-inline">
                    Add to My Bookshelf
                  </p>
                  </button>
                </div>
              </div>
            </div>
          </div>`;
        });
        // disable instead of toggle buttons - fantasy page
        let btns = document.querySelectorAll(".Rbtn");

        btns.forEach((b) => {
          b.addEventListener("click", function () {
            // add to Firebase collection
            let card = b.closest(".card");
            // title
            let title = card.querySelector(".title").textContent;
            // author
            let authText = card.querySelector(".author").textContent;
            let spanTextA = card
              .querySelector(".author")
              .querySelector("span").textContent;
            let author = authText.replace(spanTextA, "");
            // genre
            let genreText = card.querySelector(".genre").textContent;
            let spanTextG = card
              .querySelector(".genre")
              .querySelector("span").textContent;
            let genre = genreText.replace(spanTextG, "");
            // date
            let dateText = card.querySelector(".date").textContent;
            let spanTextDa = card
              .querySelector(".date")
              .querySelector("span").textContent;
            let date = dateText.replace(spanTextDa, "");
            // des
            let desText = card.querySelector(".des").textContent;
            let spanTextDe = card
              .querySelector(".des")
              .querySelector("span").textContent;
            let des = desText.replace(spanTextDe, "");

            // img
            let img = card.querySelector(".image-left").innerHTML;

            // add book
            add_book(title, author, genre, date, des, img);

            // change button after clicked
            b.disabled = true;
          });
        });

        document.querySelector("#searchbar").reset();
      });
  });

  let titles_list = [];

  if (auth.currentUser != null) {
    db.collection("bookshelf_USERS")
      .where("email", "==", auth.currentUser.email)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDocId = querySnapshot.docs[0].id;

          // Check if the book already exists in the user's collection
          db.collection("bookshelf_USERS")
            .doc(userDocId)
            .collection("my_books")
            .get()
            .then((res) => {
              let mydocs = res.docs;
              mydocs.forEach((d) => {
                titles_list.push(d.data().Title.trim());
              });

              db.collection("books")
                .where("genre", "==", "Fiction")
                .get()
                .then((res) => {
                  let mydocs = res.docs;

                  mydocs.forEach((d) => {
                    let title = d.data().title;
                    if (titles_list.includes(title)) {
                      //disable that book card's button
                      let titleElement = document.getElementById(`${title}`);
                      if (titleElement) {
                        // Find the button within the container
                        let addButton = titleElement
                          .closest(".card")
                          .querySelector(".Rbtn");
                        if (addButton) {
                          addButton.disabled = true;
                        }
                      }
                    }
                  });
                });
            });
        }
      });
  }

  //---------------------------------------------------------------

  // to add books to collection - keep commented out
  // document.querySelectorAll(".title").forEach((title, index) => {
  //   // author
  //   let a1 = document.querySelectorAll(".author")[index];
  //   let a1_2 = document.querySelectorAll(".author")[index].textContent;
  //   let a2 = a1.querySelector("span").textContent;
  //   let a3 = a1_2.replace(a2, "").trim();
  //   // date
  //   let da1 = document.querySelectorAll(".date")[index];
  //   let da1_2 = document.querySelectorAll(".date")[index].textContent;
  //   let da2 = da1.querySelector("span").textContent;
  //   let da3 = da1_2.replace(da2, "").trim();
  //   // description
  //   let de1 = document.querySelectorAll(".des")[index];
  //   let de1_2 = document.querySelectorAll(".des")[index].textContent;
  //   let de2 = de1.querySelector("span").textContent;
  //   let de3 = de1_2.replace(de2, "").trim();
  //   // add
  //   let rfbooks_col = {
  //     title: title.innerHTML.trim(),
  //     author: a3,
  //     genre: "Fiction",
  //     date: da3,
  //     description: de3,
  //     image: document.querySelectorAll(".image-left")[index].innerHTML.trim(),
  //   };
  //   db.collection("books").add(rfbooks_col);
  // });
});
