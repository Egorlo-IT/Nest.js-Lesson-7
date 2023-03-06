("use strict");

const e = React.createElement;
// eslint-disable-next-line @typescript-eslint/no-var-requires

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      message: "",
    };

    this.idNews = parseInt(window.location.href.split("/").reverse()[1]);

    this.token = document
      .getElementById("getComments")
      .getAttribute("data-token");

    this.userId = document
      .getElementById("getComments")
      .getAttribute("data-user-id");

    this.socketOptions = {
      query: {
        newsId: this.idNews,
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: "Bearer " + this.token,
          },
        },
      },
    };

    this.socket = io("http://localhost:3000/", this.socketOptions);
  }

  componentDidMount() {
    this.getAllComments();
    this.socket.emit("create", this.idNews.toString());
    this.socket.on("newComment", (message) => {
      const comments = this.state.comments;
      comments.push(message);
      this.setState(comments);
    });
    this.socket.on("editComment", (payload) => {
      const { comments } = payload;
      this.setState({ comments });
    });
    this.socket.on("removeComment", (payload) => {
      const { idComment } = payload;
      const comments = this.state.comments.filter((c) => c.id !== +idComment);
      this.setState({ comments });
    });
  }

  getAllComments = async () => {
    const response = await fetch(
      `http://localhost:3000/news-comments/all/news/${this.idNews}`,
      {
        method: "GET",
      },
    );
    if (response.ok) {
      const comments = await response.json();
      this.setState({ comments });
    }
  };

  onChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  sendMessage = () => {
    if (this.state.message !== "") {
      this.socket.emit("addComment", {
        idNews: this.idNews,
        message: this.state.message,
      });
    } else {
      alert("Введите текст комментария");
    }
  };

  saveEditMessage = (commentId, userId) => {
    const el = document.getElementById("editCommit" + commentId);
    if (el?.value !== "") {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      myHeaders.append("Authorization", "Bearer " + this.token);

      const urlencoded = new URLSearchParams();
      urlencoded.append("message", el.value);
      urlencoded.append("userId", userId);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };

      const url =
        "http://localhost:3000/news-comments/edit/" +
        commentId +
        "/" +
        this.idNews;

      fetch(url, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          this.socket.emit("editComment", {
            idComment: commentId,
            idNews: this.idNews,
            message: el.value,
          });

          return result ? true : false;
        })
        .catch((error) => console.log("error", error));
    } else {
      alert("Введите текст комментария");
    }
  };

  removeComment = (idComment) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + this.token);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    const url =
      "http://localhost:3000/news-comments/" + idComment + "/" + this.idNews;

    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        return result ? true : false;
      })
      .catch((error) => console.log("error", error));
  };

  render() {
    return (
      <div>
        {!!this.userId && (
          <div style={{ maxWidth: "320px" }}>
            <h5 className="text-uppercase mt-4 mb-0">Добавить комментарий:</h5>
            <div
              className="card-body"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div className="mb-2">
                <textarea
                  className="form-control text-left"
                  id="userComment"
                  rows="4"
                  cols="50"
                  placeholder="Введите текст комментария"
                  value={this.state.message}
                  name="message"
                  onChange={this.onChange}
                ></textarea>
              </div>
              <button
                onClick={this.sendMessage}
                id="btnCreateComment"
                className="btn btn-outline-dark mb-3"
              >
                Добавить
              </button>
            </div>
          </div>
        )}
        {this.state.comments?.length ? (
          <div className="card-body text-start">
            <h5 className="text-uppercase">Комментарии:</h5>
            <div className="card text-left mt-3">
              <div className="card-body">
                {this.state.comments.map((comment, index) => {
                  return (
                    <div key={comment + index} className="d-flex flex-row mb-2">
                      <form>
                        <div className="form-row align-items-center">
                          <div className="input-group mb-2">
                            <div className="col-auto">
                              <img
                                className="rounded-circle me-3 mb-2"
                                src={
                                  window.location.origin + comment.user.avatar
                                }
                                alt="avatar"
                                height="50"
                                width="50"
                              />
                            </div>
                            <div className="col-auto">
                              <p className="my-auto me-3">{comment.message}</p>
                            </div>
                            {+this.userId === +comment.user.id && (
                              <>
                                <div className="col-auto">
                                  <textarea
                                    id={"editCommit" + comment.id}
                                    className="form-control text-left"
                                    readOnly={false}
                                    name="text"
                                    value={this.text}
                                    placeholder="Редактирование комментария"
                                    onChange={this.value}
                                  />
                                </div>
                                <div className="col-auto">
                                  <button
                                    onClick={() => {
                                      this.saveEditMessage(
                                        comment.id,
                                        comment.user.id,
                                      );
                                    }}
                                    className="btn btn-outline-dark ms-2 cmy-auto"
                                    type="button"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-save"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
                                    </svg>
                                  </button>
                                </div>
                                <div className="col-auto">
                                  <button
                                    onClick={() => {
                                      this.removeComment(comment.id);
                                    }}
                                    className="btn btn-outline-dark ms-2 cmy-auto"
                                    style={{ backgroundColor: "#ff5722" }}
                                    type="button"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-trash"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                    </svg>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <h5 className="text-secondary">Для этой новости комментариев нет</h5>
        )}
      </div>
    );
  }
}

// for React 17
// const domContainer = document.querySelector("#app");
// ReactDOM.render(e(Comments), domContainer);

// for React 18
const domContainer = document.querySelector("#app");
const root = ReactDOM.createRoot(domContainer);
root.render(e(Comments));
