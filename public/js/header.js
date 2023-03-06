"use strict";

const url = window.location.pathname;
const gray = "nav-link text-secondary";
const white = "nav-link text-white";

document.querySelectorAll(".nav-link").forEach((item) => {
  if (url === "/news" || url.split("/").reverse()[0] === "detail") {
    item.outerText === "Новости"
      ? (item.classList = white)
      : (item.classList = gray);
  } else if (url === "/profile") {
    item.outerText === "Профиль"
      ? (item.classList = white)
      : (item.classList = gray);
  } else if (url === "/") {
    item.outerText === "Домашняя"
      ? (item.classList = white)
      : (item.classList = gray);
  } else if (url === "/users/login") {
    item.outerText === "Анонимный"
      ? (item.classList = white)
      : (item.classList = gray);
  } else if (url === "/users/register") {
    item.outerText === "Анонимный"
      ? (item.classList = white)
      : (item.classList = gray);
  }
});

const logOut = () => {
  const requestOptions = {
    method: "POST",
    redirect: "follow",
  };
  fetch("http://localhost:3000/auth/logout", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      if (result) window.location.replace("http://localhost:3000");
    })
    .catch((error) => console.log("error", error));
};

document.getElementById("btnLogOut")?.addEventListener("click", logOut);
