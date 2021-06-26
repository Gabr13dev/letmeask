import { useAuth } from "../../hooks/useAuth"
import { Button } from "../Button";

import googleIcon from '../../assets/images/google-icon.svg';

export function UserHeader() {
    const { user, signInWithGoogle, signOut } = useAuth();
    return (<>{
        user ? (
                <div className="profile">
                    <img src={user?.avatar} style={{ borderRadius: "50%" }} />
                </div>
        ) : (<a onClick={signInWithGoogle}>Faça login</a>)
    }</>)
}