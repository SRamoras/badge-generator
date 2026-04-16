 let form = document.querySelector("#create-badge");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let name = document.querySelector("#name").value;
  let surname = document.querySelector("#surname").value;
  let phoneNumber = document.querySelector("#phone").value;
  let email = document.querySelector("#email").value;

  let cardInfo = {
    name: name,
    surname: surname,
    phone: phoneNumber,
    email: email,
  };
  postData(cardInfo);
});

async function postData(info) {
  try {
    const response = await fetch(
      "https://69de8fdad6de26e1192810df.mockapi.io/badges",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      },
    );
    let data = await response.json();
    console.log(data);
  } catch (e) {
    console.error(e.message);
  }
}
