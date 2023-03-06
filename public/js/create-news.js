"use strict";

const createNews = () => {
  const cover = document.getElementById("cover");
  const messError = "Все поля обязательны для заполнения!";
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  if (cover.value !== "" && title.value !== "" && description.value !== "") {
    const formdata = new FormData();
    formdata.append("title", title.value);
    formdata.append("description", description.value);
    formdata.append("authorId", 1);
    formdata.append("categoryId", 1);
    formdata.append(
      "cover",
      cover.files[0],
      "http://localhost:3000/news-static/" + cover.value,
    );
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
    const url = "http://localhost:3000/news/create";
    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        window.location.reload();
        window.location.reload();
      })
      .catch((error) => console.log("error", error));
  } else {
    alert(messError);
  }
};
document.getElementById("btnCreateNews").addEventListener("click", createNews);
