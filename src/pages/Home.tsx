import { useHistory } from 'react-router-dom';

import { auth, firebase } from '../services/firebase'

import illustrationImg from '../assets/images/illustration.svg';
import logoimg from '../assets/images/logo.svg';
import googleIcon from '../assets/images/google-icon.svg';
import loginIcon from '../assets/images/log-in.svg'

import { useAuth } from '../hooks/useAuth';

import { Button } from '../components/Button';
import { UserCard } from '../components/UserCard';

import '../styles/auth.scss';
import { FormEvent, ReactElement, useState } from 'react';


export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle, signOut } = useAuth();
    const [roomCode, setRoomCode ] = useState('');

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle();
        }

        history.push('/rooms/new');
    }

    function handleJoinRoom(event: FormEvent){
        event.preventDefault();

    }

    function navigateToCreateRoom() {
        history.push('/rooms/new');
    }

    function ShowButtonOrCard(){
        if (!user) {
            return (
                <button className="create-room" onClick={handleCreateRoom}>
                        <img src={googleIcon} alt="Google Icon" />
                        Crie sua sala com o Google
                    </button>
            )
        }else{
            return (<><UserCard user={user} logout={signOut} /> <Button onClick={navigateToCreateRoom}>
            Quero criar uma sala
        </Button> </>)
        }
    
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
                    <ShowButtonOrCard />
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o codigo da sala"
                            onChange={ event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            <img src={loginIcon} alt="Join room Icon" /> Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}