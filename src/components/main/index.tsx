import "./styles.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from '../header';
import { Leaderboard } from '../leaderboard';
import { Login } from '../login';
import { PageNotFound } from '../notFound';
import { Registration } from '../registration';
import { Homepage } from '../homepage';
import { EventsCatalogue } from '../eventsCatalogue';
import { Event } from '../event';

export const Main = () => {
    return <div className="mainContainer">
        <BrowserRouter>
            <Header />
            <Routes>
                <Route
                    index
                    element={<Homepage />}
                />
                <Route
                    path="/register"
                    element={<Registration />}
                />
                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route
                    path="/events"
                    element={<EventsCatalogue />}
                />
                <Route
                    path="/events/:id"
                    element={<Event />}
                />
                <Route
                    path="/events/:id/leaderboard"
                    element={<Leaderboard />}
                />
                <Route path="/*"
                    element={<PageNotFound />}
                />
            </Routes>
        </BrowserRouter>
    </div>;
}