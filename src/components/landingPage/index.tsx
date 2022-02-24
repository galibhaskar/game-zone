import { HowToReg, Login } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import "./styles.scss";

export const LandingPage = () => {
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
        <Stack
            direction={"row"}
            spacing={2}
            className={`landingPageActionContainer`}
        >
            <Link to="/register">
                <Button
                    variant="outlined"
                    startIcon={<HowToReg />}
                >
                    {`Add Member`}
                </Button>
            </Link>
            <Link to="/login">
                <Button
                    variant="contained"
                    endIcon={<Login />}
                >
                    {`Login`}
                </Button>
            </Link>
        </Stack>
    </Stack>;
}