"use strict";

const registerUser = () => {
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
    passwordRepeat.value !== "" &&
    avatar.value !== ""
  ) {
    if (password.value !== passwordRepeat.value) {
      alert("Пароли не совпадают!");
    } else {
      const formdata = new FormData();
      formdata.append("firstName", firstName.value);
      formdata.append("lastName", lastName.value);
      formdata.append("email", email.value);
      formdata.append("password", password.value);
      formdata.append("role", "user");
      formdata.append(
        "avatar",
        avatar.files[0],
        "http://localhost:3000/user-static/" + avatar.value,
      );
      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };
      const url = "http://localhost:3000/users/create";
      fetch(url, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const data = JSON.parse(result);
          if (data && !data?.error) {
            alert(
              "Вы успешно зарегестрированы. Войдите под своим логином и паролем!",
            );
            window.location.href = "http://localhost:3000/users/login";
          } else {
            if (Array.isArray(data?.message)) {
              let mess = "";
              data.message.forEach((item) => {
                console.log(item);
                mess += item + "; ";
              });
              alert(
                "При регистрации пользователя обнаружены следующие ошибки: " +
                  mess,
              );
            }
          }
        })
        .catch((error) => console.log("error", error));
    }
  } else {
    alert("В форме регистрации все поля обязательны для заполнения!");
  }
};

document.getElementById("btnRegister").addEventListener("click", registerUser);
