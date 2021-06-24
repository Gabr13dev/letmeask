import { Button } from "../components/Button"
import { RoomCode } from "../components/RoomCode"
import { Loading } from "../components/Loading";
import { Question } from '../components/Question'
import { Modal } from '../components/Modal';

import { Link, useParams } from "react-router-dom";

import { useRoom } from "../hooks/useRoom";

import letMeAskLogo from '../assets/images/logo.svg';
import emptyQuestionsImg from '../assets/images/empty-questions.svg'
import deleteImg from '../assets/images/delete.svg'

import '../styles/Room.scss'
import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { database } from "../services/firebase"

type ParamsURL = {
    id: string;
}

export function AdminRoom() {
    const user = useAuth();
    const params = useParams<ParamsURL>()
    const roomId = params.id;
    const { title, questions } = useRoom(roomId);

    async function handleDeleteQuestion(questionId: string){
        if(window.confirm("Deseja excluir essa pergunta?")){
            const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();

        }
    }

    return (
        <div id="page-room">
            {title && questions && user ? (<></>) : (<Loading />)}
            <header>
                <div className="content">
                    <Link to="/"><img src={letMeAskLogo} alt="Letmeask" /></Link>
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined>Encerrar a sala</Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>{title}</h1>
                    <span>{questions.length > 0 ? (questions.length > 1 ? (`${questions.length} perguntas`) : (`${questions.length} pergunta`)) : ('Seja o primeiro a perguntar')}</span>
                </div>
                {questions.length > 0 ? (questions.map(question => {
                    return (
                        <div className="question-list">
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            >
                               <button
                                type="submit"
                                onClick={() => handleDeleteQuestion(question.id)}
                               >
                                   <img src={deleteImg} alt="Delete icon" />
                               </button> 
                            </Question>
                        </div>
                    )
                })
                ) : (
                    <div className="empty-state">
                        <img src={emptyQuestionsImg} alt="Mensagens" />
                        <span>Nenhuma pergunta por aqui...</span>
                        <p>Envie o código desta sala para seus amigos e comece a responder perguntas!</p>
                    </div>
                )
                }

            </main>
        </div>
    )
}