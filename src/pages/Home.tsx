import { Link, useHistory } from "react-router-dom";

import { database } from "../services/firebase";

import illustrationImg from "../assets/images/illustration.svg";
import logoimg from "../assets/images/logo.svg";
import googleIcon from "../assets/images/google-icon.svg";
import loginIcon from "../assets/images/log-in.svg";
import loadingIcon from '../assets/images/spinner.svg';

import { useAuth } from "../hooks/useAuth";

import { Button } from "../components/Button";
import { UserCard } from "../components/UserCard";

import "../styles/auth.scss";
import { FormEvent, useState } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [roomCode, setRoomCode] = useState("");
  const [contentButtonJoin, setContentButtonJoin] = useState(<><img src={loginIcon} alt="Join room Icon" /> Entrar na sala</>);

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    if (localStorage.getItem("roomId") === null) {
      history.push("/rooms/new");
    } else {
      localStorage.removeItem("roomId");
      history.push(`/rooms/${localStorage.getItem("roomId")}`);
    }
  }

  async function handleJoinRoom(event: FormEvent) {
    setContentButtonJoin(<><img src={loadingIcon} alt="Loading Icon" /></>)
    event.preventDefault();

    if (roomCode.trim() === "") {
      setContentButtonJoin(<><img src={loginIcon} alt="Join room Icon" /> Entrar na sala</>);
      toast("Campo vazio!");
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      toast("Sala não encontrada!");
    } else {
      if (roomRef.val().endedAt) {
        toast("A sala foi encerrada!");
        setContentButtonJoin(<><img src={loginIcon} alt="Join room Icon" /> Entrar na sala</>);
        return;
      } else {
        history.push(`/rooms/${roomCode}`);
      }
    }
    setContentButtonJoin(<><img src={loginIcon} alt="Join room Icon" /> Entrar na sala</>);
  }

  function navigateToCreateRoom() {
    history.push("/rooms/new");
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Illustração de perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire duvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoimg} alt="Letmeask Logo" />
          {!user ? (
            <button className="create-room" onClick={handleCreateRoom}>
              <img src={googleIcon} alt="Google Icon" />
              Crie sua sala com o Google
            </button>
          ) : (
            <>
              <UserCard user={user} logout={signOut} />{" "}
              <Button onClick={navigateToCreateRoom} style={{ marginTop: '2rem' }}>Quero criar uma sala</Button>{" "}
            </>
          )}
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o codigo da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              {contentButtonJoin}
            </Button>
          </form>
          <p>
            Não sabe em qual sala entrar? <Link to="/rooms/list">Ver salas</Link>
          </p>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
