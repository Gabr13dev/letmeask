import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import { UserHeader } from '../components/UserHeader'

import { Link, useHistory } from "react-router-dom";

import letMeAskLogo from "../assets/images/logo.svg";
import loadingIcon from "../assets/images/spinner.svg";

import "../styles/Room.scss";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useListRooms } from "../hooks/useListRooms";

import { database } from "../services/firebase";

export function ListRooms() {
    const { user } = useAuth();
    const { rooms } = useListRooms();

    console.log(rooms);
    return (
        <div id="page-room">
            {rooms ? (<></>) : (<Loading />)}
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
        </div>
    )
}