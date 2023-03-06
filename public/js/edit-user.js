"use strict";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editProfile = (access_token) => {
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const passwordRepeat = document.getElementById("passwordRepeat");
  const avatar = document.getElementById("avatar");

  if (
    firstName.value !== "" &&
    lastName.value !== "" &&
    email.value !== "" &&
    password.value !== "" &&
    passwordRepeat.value !== ""
  ) {
    if (password.value !== passwordRepeat.value) {
      alert("Пароли не совпадают!");
    } else {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + access_token);

      const formdata = new FormData();
      formdata.append("firstName", firstName.value);
      formdata.append("lastName", lastName.value);
      formdata.append("email", email.value);
      formdata.append("password", password.value);
      formdata.append("role", "user");
      if (avatar.files[0]) {
        formdata.append(
          "avatar",
          avatar.files[0],
          "http://localhost:3000/user-static/" + avatar.value,
        );
      }

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      fetch("http://localhost:3000/profile/edit", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const data = JSON.parse(result);
          if (data && data?.statusCode !== 401) {
            const raw = JSON.stringify({
              username: email.value,
              password: password.value,
            });
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            const requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
              redirect: "follow",
            };
            fetch("http://localhost:3000/auth/login", requestOptions)
              .then((response) => response.text())
              .then((result) => {
                const data = JSON.parse(result);
                if (data?.access_token) {
                  const myHeaders = new Headers();
                  myHeaders.append(
                    "Authorization",
                    "Bearer " + data.access_token,
                  );
                  const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow",
                  };
                  fetch("http://localhost:3000/auth/user", requestOptions)
                    .then((response) => response.text())
                    .then(() => {
                      alert("Вы успешно отредактировали свой профиль");
                      window.location.reload();
                    })
                    .catch((error) => console.log("error", error));
                }
              })
              .catch((error) => console.log("error", error));
          } else {
            alert(
              "При сохранении профиля пользователя возникли следующие ошибки: " +
                data.message,
            );
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  } else {
    alert("В форме профиля все поля обязательны для заполнения!");
  }
};
