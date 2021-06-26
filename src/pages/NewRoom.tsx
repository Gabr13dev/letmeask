
import { Link } from 'react-router-dom'
import illustrationImg from '../assets/images/illustration.svg'
import logoimg from '../assets/images/logo.svg'
import newRoomIcon from '../assets/images/new-room.svg'
import loadingIcon from '../assets/images/spinner.svg'

import { FormEvent, useState } from 'react';

import { useHistory } from 'react-router-dom';

import { Button } from '../components/Button';

import '../styles/auth.scss';

import { useAuth } from '../hooks/useAuth';

import { database } from '../services/firebase'
import { Loading } from '../components/Loading';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function NewRoom(){
    const { user } = useAuth();
    const [ newRoom, setNewRoom ] = useState('');
    const [ contentButtonSend, setContentButtonSend ] = useState(<><img src={newRoomIcon} alt="Add icon" /> Criar sala</>);
    const history = useHistory();

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();
        if(newRoom.trim() ===  ''){
            toast("Campo vazio!");
            return;
        }else{
            setContentButtonSend(<><img src={loadingIcon} alt="Loading icon" /></>);
            const roomRef = database.ref('rooms');
            const firebaseRoom = await roomRef.push({
                title: newRoom,
                authorId: user?.id,
                authorName: user?.name,
                authorAvatar: user?.avatar,
            });

            history.push(`/rooms/${firebaseRoom.key}`)
        }
        setContentButtonSend(<><img src={newRoomIcon} alt="Add icon" /> Criar sala</>);
    }

    function ShowMessageUser(){
        return user ? (<p>{`Olá, ${user.name}`}</p>) : <></> ;
    }

    return (
        <div id="page-auth">
            { user ? (<></>) : (<Loading />) }
            <aside>
                <img src={illustrationImg} alt="Illustração de perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire duvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoimg} alt="Letmeask Logo" />
                    <h2>Criar nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <ShowMessageUser />
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => { setNewRoom(event.target.value)}}
                            value={newRoom}
                        />
                        <Button type="submit">
                           {contentButtonSend}
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
                    </p>
                </div>
            </main>
            <ToastContainer />
        </div>
    )
}