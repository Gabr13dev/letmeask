import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { database } from '../services/firebase'
import { useHistory } from "react-router-dom";

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>;
}>

type QuestionType = {
    id: string,
    author: {
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

export function useRoom(roomId: string){
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const { user } = useAuth();
    const history = useHistory();

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);
        
        roomRef.orderByChild('likeCount').on('value', room => {
            const databaseRoom = room.val();
            if(room.val() === null){
                history.push("/");
                return;
            }
            setAuthor(room.val().authorId);
            const fireBaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
            const parsedQuestions = Object.entries(fireBaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                }
            });
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })

        return () => {
            roomRef.off('value');
        }
        
    }, [roomId, user?.id])

    return  {questions, title, author};
}