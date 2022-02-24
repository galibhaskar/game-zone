import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, AlertTitle, Button, CircularProgress, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebaseSetup';
import { AuthContext } from '../../context/AuthContext';
import "./styles.scss";

export const Login = () => {
    let [email, setEmail] = React.useState<string>("");
    let [password, setPassword] = React.useState<string>("");
    let [passwordVisibility, setPasswordVisibility] = React.useState<boolean>(false);
    let [isLoading, setLoading] = React.useState<boolean>(false);
    let [success, setSuccessFlag] = React.useState<boolean>(false);
    let [error, setErrorMessage] = React.useState<string>();
    let authcontext = React.useContext(AuthContext);
    let navigation = useNavigate();

    React.useEffect(() => {
        let isUserLoggedIn = authcontext.loggedInUserProfile ? true : false;
        if (isUserLoggedIn)
            navigation("/");
    }, [authcontext, navigation]);

    const setCookie = React.useCallback((cname: string, cvalue: string, exdays: number) => {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }, []);

    const login = React.useCallback(() => {
        setLoading(true);
        auth.signInWithEmailAndPassword(email, password)
            .then((response) => {
                console.log('user', auth.currentUser);
                setLoading(false);
                if (authcontext.setUser) {
                    setCookie("user", JSON.stringify(auth.currentUser), 1);
                    authcontext.setUser(auth.currentUser);
                }
                console.log(authcontext);
                console.log(auth);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                setErrorMessage(err.message);
            });
    }, [email, password, authcontext, setCookie]);

    return <div className="loginContainer">
        {
            isLoading &&
            <CircularProgress />
        }
        {
            error && <Alert severity="error">
                <AlertTitle>
                    {`Error`}
                </AlertTitle>
                {error}
            </Alert>
        }
        <h1 className='loginLabel'>
            {`Participant Login`}
        </h1>

        <Stack
            flexDirection={"column"}
            gap={5}
            className={`formContainer`}
        >
            <TextField
                className='emailFieldContainer'
                label={`Enter email`}
                variant="outlined"
                value={email}
                onChange={(event: any) => {
                    setEmail(event.target.value);
                }}
            />
            <TextField
                label={`Password`}
                value={password}
                type={passwordVisibility ? 'text' : 'password'}
                onChange={(event: any) => {
                    setPassword(event.target.value);
                }}
                InputProps={{
                    endAdornment: <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setPasswordVisibility(!passwordVisibility)}
                            edge="end"
                        >
                            {passwordVisibility ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }}
            />
            <Button
                variant="contained"
                onClick={login}
                className={'loginButton'}
            >
                {`Login`}
            </Button>
        </Stack>
    </div>;
}
