import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { database } from '../services/firebase'

type FirebaseRooms = Record<string, {
    title: string;
    authorId: string;
    /*questions: Record<string, {
        key: string;
    }>;*/
}>

type RoomsType = {
    id: string;
    title: string;
    authorId: string;
    //questionsCount: number;
}

export function useListRooms(){
    const [rooms, setRooms] = useState<RoomsType[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const roomRef = database.ref(`rooms`);
        
        roomRef.on('value', rooms => {
            console.log(rooms.val())
            const databaseRoom = rooms.val();
            const fireBaseRooms: FirebaseRooms = databaseRoom.rooms ?? {};
            const parsedRooms = Object.entries(fireBaseRooms).map(([key, value]) => {
                return {
                    id: key,
                    authorId: value.authorId,
                    title: value.title,
                    //questionsCount: Object.values(value.questions ?? {}).length,
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