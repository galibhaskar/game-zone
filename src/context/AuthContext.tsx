import React from "react";
import { IAuthContext } from "../concerns/IAuthContext";
import firebase from "firebase/compat";

export const AuthContext = React.createContext<IAuthContext>({
    loggedInUserProfile: null,
    events: [],
    isUserAdmin: false
});