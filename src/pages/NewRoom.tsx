
import { Link } from 'react-router-dom'
import illustrationImg from '../assets/images/illustration.svg'
import logoimg from '../assets/images/logo.svg'
import googleIcon from '../assets/images/google-icon.svg'
import newRoomIcon from '../assets/images/new-room.svg'

import { Button } from '../components/Button';
import { UserCard } from '../components/UserCard';

import '../styles/auth.scss';

import { useAuth } from '../hooks/useAuth';

export function NewRoom(){
    const { user, signInWithGoogle, signOut } = useAuth();

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
                    <UserCard user={user} logout={signOut} />
                    <h2>Criar nova sala</h2>
                    <form>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                        />
                        <Button type="submit">
                           <img src={newRoomIcon} /> Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}