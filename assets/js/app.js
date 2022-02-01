window.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".navbar-toggle-menu");
  const navbarRight = document.querySelector(".navbar-right");
  const form = document.querySelector(".form");
  const formMessenger = document.querySelector(".form-messenger");
  const formInput = document.querySelector(".form-input");
  const formSubmit = document.querySelector(".form-button");
  const linkList = document.querySelector(".link-list");
  let linkItem;
  let urlShorted;

  toggle.addEventListener("click", function () {
    navbarRight.classList.toggle("show");
  });
  //check value input if '' => messenge error
  formSubmit.addEventListener("click", function () {
    let formInputValue = formInput.value.trim();
    if (formInputValue == "") {
      getMessenger("error", "Please add a link");
    } else {
      getMessenger("success", "Getting url shorten...");
      createURLshorten(formInputValue);
    }
  });

  async function createURLshorten(key) {
    key = key.includes("https://") ? key : `https://${key}`;
    try {
      let result = await axios.get(`https://api.shrtco.de/v2/shorten?url=${key}`);
      urlShorted = result.data.result.short_link;
      formMessenger.style.display = "none";
      linkList.innerHTML += `
      <div class="link-item">
        <a href="${key}" class="link-name">${key}</a>
        <div class="link-action">
          <a href="https://${urlShorted}" class="link-shorter">${urlShorted}</a>
          <button class="link-btn btn btn-primary">Copy</button>
        </div>
      </div>`;
      formInput.value = "";
      linkItem = Array.from(document.querySelectorAll(".link-item"));
      addEventCopyForButton();
    } catch (err) {
      getMessenger("error", `${key} isn't valid`);
    }
  }

  function addEventCopyForButton() {
    if (linkItem) {
      for (let i = 0; i < linkItem.length; i++) {
        const element = linkItem[i];
        let button = element.querySelector(".link-btn");
        button.addEventListener("click", function (e) {
          let linkAction = button.parentElement;
          let linkShorter = linkAction.querySelector(".link-shorter");
          let linkShorterValue = linkShorter.textContent.trim();
          copyToClickBoard(linkShorterValue, button);
        });
      }
    }
  }

  function getMessenger(type, messContent) {
    if (type == "success") {
      form.classList.remove("error");
    } else {
      form.classList.remove("success");
    }
    formMessenger.textContent = messContent;
    form.classList.add(type);
    formMessenger.style.display = "block";
  }

  function copyToClickBoard(content, btn) {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        btn.textContent = "Copied!";
        btn.style.backgroundColor = "#3a3053";
      })
      .catch((err) => {
        console.log("Something went wrong", err);
      });
  }
});
