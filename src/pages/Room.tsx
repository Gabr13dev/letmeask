import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Loading } from "../components/Loading";
import { Question } from "../components/Question";

import { Link, useHistory, useParams } from "react-router-dom";

import { useRoom } from "../hooks/useRoom";

import letMeAskLogo from "../assets/images/logo.svg";
import loadingIcon from "../assets/images/spinner.svg";
import emptyQuestionsImg from "../assets/images/empty-questions.svg";

import "../styles/Room.scss";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import { FormEvent } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserHeader } from "../components/UserHeader";

type ParamsURL = {
  id: string;
};

export function Room() {
  const history = useHistory();
  const { user } = useAuth();
  const [newQuestion, setNewQuestion] = useState("");
  const [buttonSendQuestionContent, setButtonSendQuestionContent] = useState(
    <>Enviar pergunta</>
  );
  const params = useParams<ParamsURL>();
  const roomId = params.id;
  const { title, questions, author } = useRoom(roomId);

  async function handleLikeQuestion(
    questionId: string,
    likeId: string | undefined
  ) {
      if (likeId) {
        await database
          .ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
          .remove();
        toast("Like removido!");
      } else {
        await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
          authorId: user?.id,
        });
        toast("Você deu like na pergunta!");
      }
  }

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();
    if (newQuestion.trim() === "") {
      toast("Campo vazio!");
      return;
    } else {
      if (!user) {
        toast("É necessario que você faça Login!");
        return;
      } else {
        setButtonSendQuestionContent(
          <>
            <img src={loadingIcon} alt="Loading Icon" />
          </>
        );
        const question = {
          content: newQuestion,
          author: {
            name: user.name,
            avatar: user.avatar,
          },
          isHighlighted: false,
          isAnswered: false,
        };

        const ref = await database
          .ref(`rooms/${roomId}/questions`)
          .push(question);

        const lastQuestion: string = ref.key ? ref.key : "";
        const LastQuestionElem = document.getElementById(lastQuestion);
        LastQuestionElem?.scrollIntoView({
          behavior: "smooth",
        });

        LastQuestionElem?.classList.add("new");
        toast("Pergunta adicionada!");
        setNewQuestion("");
        setButtonSendQuestionContent(<>Enviar pergunta</>);
      }
    }
  }

  function handleAdmin() {
    history.push(`/admin/rooms/${roomId}`)
  }

  function handleLogin() {
    localStorage.setItem("roomId", roomId);
    history.push(`/`);
  }

  return (
    <div id="page-room">
      {title && questions ? <></> : <Loading />}
      <header>
        <div className="content">
          <Link to="/">
            <img src={letMeAskLogo} alt="Letmeask" />
          </Link>
          <div>
            <div>
              <RoomCode code={roomId} />
            </div>
            {author === user?.id && (<Button onClick={handleAdmin}> Administrar Sala</Button>)}
            <UserHeader />
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>{title}</h1>
          <span>
            {questions.length > 0
              ? questions.length > 1
                ? `${questions.length} perguntas`
                : `${questions.length} pergunta`
              : "Seja o primeiro a perguntar"}
          </span>
          {author === user?.id && (<span>Esta sala é sua</span>)}
        </div>
        {author !== user?.id && (<form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user?.avatar} alt={user?.name} />
                <span>{user?.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta , <button onClick={handleLogin}>faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>
              {buttonSendQuestionContent}
            </Button>
          </div>
        </form>)}

        <div className="question-list">
          {questions.length > 0 ? (
            questions.map((question) => {
              return (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  id={question.id}
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                >
                  {!question.isAnswered && user ? (
                    <button
                      className={`like-button ${question.likeId && "liked"}`}
                      type="button"
                      aria-label="Marcar como gostei"
                      onClick={() =>
                        handleLikeQuestion(question.id, question.likeId)
                      }
                    >
                      {question.likeCount > 0 && (
                        <span>{question.likeCount}</span>
                      )}
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                          stroke="#737380"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>) : (<></>)}
                </Question>
              );
            })
          ) : (
            <div className="empty-state">
              <img src={emptyQuestionsImg} alt="Mensagens" />
              <span>Nenhuma pergunta por aqui...</span>
              <p>
                Faça o seu login e seja a primeira pessoa a fazer uma pergunta!
              </p>
            </div>
          )}
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
