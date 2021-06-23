import { AuthContext } from '../contexts/AuthContext';
import { useContext } from "react";

export function useAuth(){
    const ctx = useContext(AuthContext);
    return ctx;
}