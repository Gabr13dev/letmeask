import { Link, useHistory } from "react-router-dom";
import chat from '../../assets/images/answer.svg'

import "./RoomCard.scss";

type roomCard = {
  idRoom: string;
  title: string;
  avatarAuthor: string;
  nameAuthor: string;
  questionsCount: number;
  endedAt?: Date;
};


export function RoomCard(prop: roomCard) {
    const history = useHistory();
    function joinRoom(idRoom: string){
        history.push(`/rooms/${idRoom}`);
    }

  return (
      <div className={`card ${prop.endedAt ? 'terminate' : ''}`}>
        <div className="card__container">
          <h2 className="card__header">{prop.title}</h2>
          { prop.endedAt ? (
              <p>Encerrada</p>
          ) : (
          <button onClick={() => joinRoom(prop.idRoom)}>Entrar</button>
          )}
          <div className="card-footer">
            <img src={prop.avatarAuthor} alt={prop.nameAuthor} />
            <span>{prop.nameAuthor}</span>
            <div>
                {prop.questionsCount} <img src={chat} alt="" />
            </div>
          </div>
        </div>
      </div>
  );
}
