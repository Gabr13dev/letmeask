import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Loading } from "../components/Loading";
import { Question } from "../components/Question";

import { Link, useHistory, useParams } from "react-router-dom";
import HyperModal from "react-hyper-modal";
import "../styles/modal.scss";

import { useRoom } from "../hooks/useRoom";

import letMeAskLogo from "../assets/images/logo.svg";
import emptyQuestionsImg from "../assets/images/empty-questions.svg";
//import deleteImg from "../assets/images/delete.svg";

import "../styles/Room.scss";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

type ParamsURL = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory();
  const user = useAuth();
  const params = useParams<ParamsURL>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);
  const [isModalDeleteOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalTerminateOpen, setIsTerminateModalOpen] = useState(false);
  const [toDeleteQuestion, setToDeleteQuestion] = useState("");

  function openDeleteModal(idQuestion: string) {
    setToDeleteQuestion(idQuestion);
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  function openTerminateModal() {
    setIsTerminateModalOpen(true);
  }

  function closeTerminateModal() {
    setIsTerminateModalOpen(false);
  }

  async function handleTerminateRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push(`/`);
  }

  async function handleDeleteQuestion() {
    await database
      .ref(`rooms/${roomId}/questions/${toDeleteQuestion}`)
      .remove();
    setIsDeleteModalOpen(false);
  }

  return (
    <div id="page-room">
      {title && questions && user ? <></> : <Loading />}
      <header>
        <div className="content">
          <Link to="/">
            <img src={letMeAskLogo} alt="Letmeask" />
          </Link>
          <div>
            <div>
              <RoomCode code={roomId} />
            </div>
            <Button isOutlined onClick={openTerminateModal}>
              Encerrar a sala
            </Button>
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
        </div>
        <div className="question-list">
          {questions.length > 0 ? (
            questions.map((question) => {
              return (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  id={question.id}
                >
                  <button onClick={() => openDeleteModal(question.id)}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 5.99988H5H21"
                        stroke="#737380"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z"
                        stroke="#737380"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </Question>
              );
            })
          ) : (
            <div className="empty-state">
              <img src={emptyQuestionsImg} alt="Mensagens" />
              <span>Nenhuma pergunta por aqui...</span>
              <p>
                Envie o código desta sala para seus amigos e comece a responder
                perguntas!
              </p>
            </div>
          )}
        </div>
      </main>
      <HyperModal isOpen={isModalDeleteOpen} requestClose={closeDeleteModal}>
        <div className="modal-content">
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 5.99988H5H21"
              stroke="#E73F5D"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z"
              stroke="#E73F5D"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1>Excluir pergunta</h1>
          <span>Tem certeza que você deseja excluir esta pergunta?</span>
          <div className="controllers">
            <button className="cancel" onClick={closeDeleteModal}></button>
            <button
              style={{ backgroundColor: "#E73F5D", color: "white" }}
              onClick={handleDeleteQuestion}
            >
              Sim, excluir
            </button>
          </div>
        </div>
      </HyperModal>

      <HyperModal
        isOpen={isModalTerminateOpen}
        requestClose={closeTerminateModal}
      >
        <div className="modal-content">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M29.66 18.3398L18.34 29.6598"
              stroke="#E73F5D"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M29.66 29.6598L18.34 18.3398"
              stroke="#E73F5D"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M24 42V42C14.058 42 6 33.942 6 24V24C6 14.058 14.058 6 24 6V6C33.942 6 42 14.058 42 24V24C42 33.942 33.942 42 24 42Z"
              stroke="#E73F5D"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <h1>Encerrar Sala</h1>
          <span>Tem certeza que você deseja encerrar esta sala?</span>
          <div className="controllers">
            <button className="cancel" onClick={closeTerminateModal}></button>
            <button
              style={{ backgroundColor: "#E73F5D", color: "white" }}
              onClick={handleTerminateRoom}
            >
              Sim, encerrar
            </button>
          </div>
        </div>
      </HyperModal>
    </div>
  );
}
