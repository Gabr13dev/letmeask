import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { database } from '../services/firebase';
import { RoomsType } from '../models/rooms.modal'

type FirebaseRooms = Record<string, {
    title: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    endedAt?: Date;
    questions: Record<string, {
        key: string;
    }>;
}>



export function useListRooms(){
    const [rooms, setRooms] = useState<RoomsType[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const roomRef = database.ref(`rooms`);
        roomRef.once('value', rooms => {
            const databaseRoom = rooms.val();
            const fireBaseRooms: FirebaseRooms = databaseRoom ?? {};
            const parsedRooms = Object.entries(fireBaseRooms).map(([key, value]) => {
                return {
                    id: key,
                    authorId: value.authorId,
                    title: value.title,
                    authorAvatar: value.authorAvatar,
                    authorName: value.authorName,
                    endedAt: value.endedAt,
                    questionsCount: Object.values(value.questions ?? {}).length,
                }
            });
            setRooms(parsedRooms);
        })

        return () => {
            roomRef.off('value');
        }
        
    }, [rooms, user?.id])

    return  {rooms};
}