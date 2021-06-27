import { Loading } from "../components/Loading";
import { UserHeader } from "../components/UserHeader";
import { RoomCard } from "../components/RoomCard";

import { Link } from "react-router-dom";

import letMeAskLogo from "../assets/images/logo.svg";

import "../styles/Room.scss";
import { useListRooms } from "../hooks/useListRooms";

export function ListRooms() {
  const { rooms } = useListRooms();

  return (
    <div id="page-room">
      {rooms.length ? <></> : <Loading />}
      <header>
        <div className="content">
          <Link to="/">
            <img src={letMeAskLogo} alt="Letmeask" />
          </Link>
          <div>
            <UserHeader />
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Salas disponiveis</h1>
          <span>
            {rooms.length > 0
              ? rooms.length > 1
                ? `${rooms.length} salas`
                : `${rooms.length} sala`
              : "Nenhuma sala"}
          </span>
        </div>
        <div className="rooms-list">
          {rooms.map((room) => {
              return (<RoomCard
                key={room.id}
                idRoom={room.id}
                title={room.title}
                endedAt={room.endedAt}
                avatarAuthor={room.authorAvatar}
                nameAuthor={room.authorName}
                questionsCount={room.questionsCount}
              /> )
            })
          }
        </div>
      </main>
    </div>
  );
}
