import { Button, Stack } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import "./styles.scss";

export const Homepage = () => {
    let authcontext = React.useContext(AuthContext);
    let navigation = useNavigate();

    React.useEffect(() => {
        let isUserLoggedIn = authcontext.loggedInUserProfile ? true : false;
        if (!isUserLoggedIn)
            navigation("/login");
    }, [authcontext, navigation]);

    return <Stack flexDirection={"column"}>
        <h1>
            {`Welcome technovert`}
        </h1>
        <Button
            variant="contained"
            style={{ maxWidth: 'fit-content', margin: "10px auto" }}
            onClick={() => navigation("/events")}
        >
            {`Explore Events`}
        </Button>
    </Stack>;
}