
import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import firebase from "firebase/compat/app";
import { databaseRef } from "../config/firebaseSetup";
import * as React from "react";
import { IEvent } from "../concerns/IEvent";
import moment from "moment";

export const AuthProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<firebase.User | null>(null);
    const [eventsData, setEventsData] = useState<IEvent[]>([]);

    const getEvents = React.useCallback(() => {
        const eventsRef = databaseRef.collection("events");
        eventsRef.get()
            .then((snapshot: any) => {
                let newState: IEvent[] = [];
                snapshot.forEach((doc: any) => {
                    let item = doc.data();
                    newState.push({
                        id: doc.id,
                        title: item.title,
                        status: item.status,
                        date: moment(item.dateTime.toDate()).format('DD MMM, YYYY'),
                        organizer: item.organizer
                    });
                });
                setEventsData(newState);
            });
    }, []);

    const initializeContext = React.useCallback(async () => {
        getEvents();
    }, [getEvents]);

    React.useEffect(() => {
        initializeContext();
    }, [initializeContext]);


    const getCookie = React.useCallback((cname: string) => {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }, []);

    React.useEffect(() => {
        let _authCookie = getCookie("user");
        console.log(_authCookie);
        if (_authCookie)
            setUser(JSON.parse(_authCookie));
    }, [getCookie]);

    return <AuthContext.Provider value={{
        loggedInUserProfile: user,
        events: eventsData,
        setUser: setUser,
        setEvents: setEventsData,
        isUserAdmin: user && (user.displayName === "admin" ||
            user.email === "suryabhaskar.g@technovert.com") ? true : false
    }}>
        {children}
    </AuthContext.Provider>;
};