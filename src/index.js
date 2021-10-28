import "bootstrap/scss/bootstrap.scss";
import http from "./http";

const renderPost = (post) => {
  const { id, title, description } = post;
  const listNode = document.querySelector("#list");
  const newCard = document.createElement("div");
  newCard.className = `card mb-3 p-2 d-flex flex-row justify-content-between align-items-center`;
  newCard.innerHTML = `
    <div>
        <p><strong>${title}</strong></p>
        <p>${description}</p>
    </div>
    <div>
        <button data-id='${id}' class="btn btn-info btn-start-edit">Edit</button>
        <button data-id='${id}' class="btn btn-danger btn-remove">Remove</button>
    </div>`;
  listNode.appendChild(newCard);
};

const renderAllPosts = () => {
  // return Promise thì nó làm xong mình có thể .then để nó làm việc khác
  return http.readPosts().then((postList) => {
    postList.forEach((post) => {
      renderPost(post);
    });
  });
};
const clearForm = () => {
  document.querySelector("#title").value = "";
  document.querySelector("#description").value = "";
  document.querySelector("#list").innerHTML = "";
  return renderAllPosts();
  //skill khi dùng promise => renderAllPost return
};
const alertMsg = (msg, type = "success") => {
  const newAlert = document.createElement("div");
  newAlert.className = `alert alert-${type}`;
  newAlert.innerHTML = msg;
  document.querySelector("#notification").appendChild(newAlert);
  setTimeout(() => {
    newAlert.remove();
  }, 2000);
};
const add = (post) => {
  http
    .createPost(post)
    .then((res) => {
      return clearForm();
    })
    .then(() => {
      alertMsg("Added Post Successfully");
    });
};
const editStart = (id) => {
  http.readPost(id).then((post) => {
    document.querySelector("#title").value = post.title;
    document.querySelector("#description").value = post.description;
    document.querySelector("#btn-edit").dataset.id = post.id;
    //bật btn group
    document.querySelector("#btn-group").classList.remove("d-none");
    document.querySelector("#btn-add").classList.add("d-none");
  });
};
const editEnd = (id, post) => {
  http
    .updatePost(id, post)
    .then(() => {
      return clearForm();
    })
    .then(() => {
      alertMsg("Updated Successfully");
      document.querySelector("#btn-group").classList.remove("d-none");
      document.querySelector("#btn-add").classList.add("d-none");
    });
};
const remove = (id) => {
  http
    .deletePost(id)
    .then(() => {
      clearForm();
    })
    .then(() => {
      alertMsg("Removed Successfully");
    });
};
const initPost = () => {
  renderAllPosts();
  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    add({ title, description });
  });

  //edit
  document.querySelector("#list").addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-start-edit")) {
      editStart(event.target.dataset.id);
    }
  });
  //edit
  document.querySelector("#btn-edit").addEventListener("click", (event) => {
    event.preventDefault();
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const id = event.target.dataset.id;
    editEnd(id, { title, description });
  });
  document.querySelector("#list").addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-remove")) {
      const titlePost =
        event.target.parentElement.previousElementSibling.firstElementChild
          .firstElementChild.innerHTML;
      const isConfirmed = confirm(`Do You Want To Remove ${titlePost}`);
      if (isConfirmed) {
        remove(event.target.dataset.id);
      }
    }
  });
  document.querySelector("#btn-back").addEventListener("click", (event) => {
    event.preventDefault();
    clearForm();
    document.querySelector("#btn-group").classList.remove("d-none");
    document.querySelector("#btn-add").classList.add("d-none");
  });
};
window.addEventListener("DOMContentLoaded", initPost);
