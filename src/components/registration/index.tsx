import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, CircularProgress, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebaseSetup';
import { AuthContext } from '../../context/AuthContext';
import "./styles.scss";

interface IValidityState {
    name: boolean;
    email: boolean;
    password: boolean;
}

export const Registration = () => {
    let navigation = useNavigate();
    let [name, setName] = React.useState<string>("");
    let [email, setEmail] = React.useState<string>("");
    let [password, setPassword] = React.useState<string>("");
    let [confirmPassword, setConfirmPassword] = React.useState<string>("");
    let [passwordVisibility, setPasswordVisibility] = React.useState<boolean>(false);

    let [validityState, setValidityState] = React.useState<IValidityState>({
        name: true,
        email: true,
        password: true
    });
    let [isLoading, setLoading] = React.useState<boolean>(false);
    let [success, setSuccessFlag] = React.useState<boolean>(false);
    let [error, setErrorMessage] = React.useState<string>();
    let authcontext = React.useContext(AuthContext);

    React.useEffect(() => {
        let isUserLoggedIn = authcontext.loggedInUserProfile ? true : false;
        if (isUserLoggedIn)
            navigation("/");
    }, [authcontext]);

    const validateData = React.useCallback(() => {
        let validityStatus: any = {
            name: false,
            email: false,
            password: false
        };
        if (name)
            validityStatus.name = true;
        if (email)
            validityStatus.email = email.indexOf("@technovert.net") !== -1 ||
                email.indexOf("@technovert.com") !== -1 ? true : false;
        if (password && password === confirmPassword)
            validityStatus.password = true;
        return validityStatus;
    }, [name, email, password, confirmPassword]);

    const createUserAccount = React.useCallback((name: string, email: string, password: string) => {
        setLoading(true);
        auth.createUserWithEmailAndPassword(email, password)
            .then((response) => {
                const user = auth.currentUser;
                setLoading(false);
                if (authcontext.setUser)
                    authcontext.setUser(user);
                return user?.updateProfile({
                    displayName: name
                });
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                setErrorMessage(err.message);
            });
    }, []);

    const handleRegister = React.useCallback(() => {
        let _validityStatus = validateData();
        if (_validityStatus.name && _validityStatus.email) {
            createUserAccount(name, email, password);
        }
        else
            setValidityState(_validityStatus);
    }, [name, email, password, validityState, validateData, createUserAccount]);

    if (error)
        return <h3>
            {error}
        </h3>;

    return <div className="registrationContainer">
        {
            isLoading &&
            <CircularProgress />
        }
        <h1 className='registrationLabel'>
            {`Participant Registration`}
        </h1>

        <Stack
            flexDirection={"column"}
            gap={5}
            className={`formContainer`}
        >
            <TextField
                className='nameFieldContainer'
                label={`Enter name`}
                variant="outlined"
                value={name}
                onChange={(event: any) => {
                    setName(event.target.value);
                    if (!validityState.name)
                        setValidityState({
                            ...validityState,
                            name: true
                        });
                }}
                error={!validityState.name}
                helperText={validityState.name ? null : `Enter name`}
            />
            <TextField
                className='emailFieldContainer'
                label={`Enter email`}
                variant="outlined"
                value={email}
                onChange={(event: any) => {
                    setEmail(event.target.value);
                    if (!validityState.email)
                        setValidityState({
                            ...validityState,
                            email: true
                        });
                }}
                error={!validityState.email}
                helperText={validityState.email ? null : `Invalid Email`}
            />
            <TextField
                label={`Password`}
                value={password}
                type={passwordVisibility ? 'text' : 'password'}
                onChange={(event: any) => {
                    setPassword(event.target.value);
                    if (!validityState.password) {
                        setConfirmPassword('');
                        setValidityState({
                            ...validityState,
                            password: true
                        });
                    }
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
                error={!validityState.password}
                helperText={validityState.password ? null : `Passwords don't match`}
            />
            <TextField
                label={`Confirm Password`}
                type={passwordVisibility ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event: any) => {
                    setConfirmPassword(event.target.value);
                    if (!validityState.password)
                        setValidityState({
                            ...validityState,
                            password: true
                        });
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
                error={!validityState.password}
                helperText={validityState.password ? null : `Passwords don't match`}
            />
            <Button
                variant="contained"
                onClick={handleRegister}
                className={'registerButton'}
            >
                {`Register`}
            </Button>
        </Stack>
    </div>;
}

// export class RegistrationC extends React.Component<IRegistrationProps, IRegistrationState> {
//     public constructor(props: IRegistrationProps) {
//         super(props);
//         this.state = {
//             name: "",
//             email: "",
//             validityState: {
//                 name: true,
//                 email: true
//             }
//         };
//     }

//     private validateData = () => {
//         let { name, email } = this.state;
//         let validityStatus: any = {
//             name: false,
//             email: false
//         };
//         if (name)
//             validityStatus.name = true;
//         if (email)
//             validityStatus.email = email.indexOf("@technovert.net") !== -1 ||
//                 email.indexOf("@technovert.com") !== -1 ? true : false;
//         return validityStatus;
//     }

//     private handleRegister = () => {
//         ///API call
//         let _validityStatus = this.validateData();
//         if (_validityStatus.name && _validityStatus.email)
//             console.log(this.state);
//         else
//             this.setState({ validityState: _validityStatus });
//     }

//     public render() {
//         let { name, email, validityState } = this.state;

//         return <div className="registrationContainer">
//             <h1 className='registrationLabel'>
//                 {`Participant Registration`}
//             </h1>
//             <Stack flexDirection={"column"} gap={5}>
//                 <TextField
//                     className='nameFieldContainer'
//                     label={`Enter name`}
//                     variant="outlined"
//                     value={name}
//                     onChange={(event: any) => this.setState({
//                         name: event.target.value,
//                         validityState: {
//                             ...validityState,
//                             name: true
//                         }
//                     })}
//                     error={!validityState.name}
//                     helperText={!validityState.name ? `Enter name` : ''}
//                 />
//                 <TextField
//                     className='emailFieldContainer'
//                     label={`Enter email`}
//                     variant="outlined"
//                     value={email}
//                     onChange={(event: any) => {
//                         this.setState({
//                             email: event.target.value,
//                             validityState: {
//                                 ...validityState,
//                                 email: true
//                             }
//                         })
//                     }}
//                     error={!validityState.email}
//                     helperText={!validityState.email ? `Invalid Email` : null}
//                 />
//                 <Button
//                     variant="contained"
//                     onClick={this.handleRegister}
//                     className={'registerButton'}
//                 >
//                     {`Register`}
//                 </Button>
//             </Stack>
//         </div>;
//     }
// }