let addToy = false;
document.addEventListener("DOMContentLoaded", () => {
  const toyCollectionDiv = document.querySelector("#toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  

  // Hide & Seek for the form
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch all toys and render them
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
        toys.forEach(renderToy);
      });
  }

  // Create a toy card and append it to the DOM
  function renderToy(toy) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;
    cardDiv.appendChild(h2);

    const img = document.createElement("img");
    img.src = toy.image;
    img.className = "toy-avatar";
    cardDiv.appendChild(img);

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;
    cardDiv.appendChild(p);

    const likeBtn = document.createElement("button");
    likeBtn.className = "like-btn";
    likeBtn.id = toy.id;
    likeBtn.textContent = "Like ❤️";
    likeBtn.addEventListener("click", () => increaseLikes(toy));
    cardDiv.appendChild(likeBtn);

    toyCollectionDiv.appendChild(cardDiv);
  }

  // Increase likes when the like button is clicked
  function increaseLikes(toy) {
    const newLikes = toy.likes + 1;
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
      .then(response => response.json())
      .then(updatedToy => {
        // Update the DOM with the new like count
        const toyCard = document.getElementById(toy.id).parentElement;
        const likesP = toyCard.querySelector("p");
        likesP.textContent = `${updatedToy.likes} Likes`;
      });
  }

  // Add a new toy via POST request
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const image = event.target.image.value;

    const newToy = {
      name,
      image,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(createdToy => {
        // Render the new toy without reloading the page
        renderToy(createdToy);
        toyForm.reset(); // Reset the form inputs
        toyFormContainer.style.display = "none"; // Hide the form
        addToy = false; // Toggle off the button
      });
  });

  // Initial call to fetch toys when page loads
  fetchToys();
});
