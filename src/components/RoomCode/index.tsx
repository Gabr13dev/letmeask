import copyImg from '../../assets/images/copy.svg';
import './room-code.scss'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps){
    function  copyRoomCodeToClipboard(){
        navigator.clipboard.writeText(props.code);
        toast("Codigo da sala copiado!");
    }

    return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
        <div>
            <img src={copyImg} alt="Copy room code" />
        </div>
        <span>Sala #{props.code}</span>
    </button>
    )
}