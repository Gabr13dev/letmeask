import { Button } from "../components/Button"
import { RoomCode } from "../components/RoomCode"

import { useParams } from "react-router-dom"

import letMeAskLogo from '../assets/images/logo.svg'

import '../styles/Room.scss'
import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { database } from "../services/firebase"
import { FormEvent } from "react"

type ParamsURL = {
    id: string;
}

type FirebaseQuestions = Record<string, {
    author:{
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type Question = {
    id: String,
    author:{
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

export function Room(){
    const user = useAuth();
    const [newQuestion, setNewQuestion ] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle ] = useState('');

    const params = useParams<ParamsURL>();
    const roomId = params.id;

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const fireBaseQuestions: FirebaseQuestions = databaseRoom.questions;

            const parsedQuestions = Object.entries(fireBaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                }
            });
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })
        
    }, [roomId])

    async function handleSendQuestion(event: FormEvent){
        event.preventDefault();
        if(newQuestion.trim() === ''){
            return;
        }else{
            if(!user){
                throw new Error('Voce precisa estar logado')
            }else{
                const question = {
                    content: newQuestion,
                    author:{
                        name: user.user?.name,
                        avatar: user.user?.avatar,
                    },
                    isHighlighted: false,
                    isAwswered: false
                };

                await database.ref(`rooms/${roomId}/questions`).push(question);

                setNewQuestion('');
            }
        }
        
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={letMeAskLogo} alt="Letmeask" />
                    <div><RoomCode code={roomId} /></div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>{title}</h1>
                    <span>{questions.length > 0 ? ( questions.length > 1 ? (`${questions.length } perguntas`) : (`${questions.length } pergunta`)) : ('Seja o primeiro a perguntar')}</span>
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                    />
                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img src={user.user?.avatar} alt={user.user?.name} />
                                <span>{user.user?.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta , <button>faça seu login</button>.</span>
                        )}
                        <Button type="submit"> Enviar pergunta </Button>
                    </div>
                </form>
            </main>
        </div>
    )
}