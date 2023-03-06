"use strict";

const loginUser = () => {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  if (email.value !== "" && password.value !== "") {
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
        if (data?.access_token && data?.statusCode !== 401) {
          const myHeaders = new Headers();
          myHeaders.append("Authorization", "Bearer " + data.access_token);
          const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          };
          fetch("http://localhost:3000/auth/user", requestOptions)
            .then((response) => response.text())
            .then((result) => {
              if (result) {
                const data = JSON.parse(result);
                if (data && !data?.error) {
                  localStorage.setItem(
                    "user",
                    JSON.stringify({
                      id: data.id,
                      firstName: data.firstName,
                      lastName: data.lastName,
                      avatar: data.avatar,
                      exp: data.exp,
                    }),
                  );
                  alert("Вы успешно авторизовались!");
                  window.location.href = "http://localhost:3000";
                } else {
                  if (Array.isArray(data?.message)) {
                    let mess = "";
                    data.message.forEach((item) => {
                      mess += item + "; ";
                    });
                    alert(
                      "При авторизации пользователя возникли следующие ошибки: " +
                        mess,
                    );
                  }
                }
              } else {
                if (data && data?.error) {
                  if (Array.isArray(data?.message)) {
                    let mess = "";
                    data.message.forEach((item) => {
                      mess += item + "; ";
                    });
                    alert(
                      "При авторизации пользователя обнаружены следующие ошибки: " +
                        mess,
                    );
                  }
                }
              }
            })
            .catch((error) => console.log("error", error));
        } else {
          alert(
            "Ошибка авторизации. Введите правильный логин и пароль! " +
              data.message,
          );
        }
      })
      .catch((error) => console.log("error", error));
  } else {
    alert("В форме авторизации все поля обязательны для заполнения!");
  }
};

document.getElementById("btnLogin").addEventListener("click", loginUser);
