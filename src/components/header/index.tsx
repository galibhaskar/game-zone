import { EmojiEvents, Logout, Settings } from '@mui/icons-material';
import { Avatar, Button, Divider, ListItemIcon, Menu, MenuItem, Stack } from '@mui/material';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebaseSetup';
import { AuthContext } from '../../context/AuthContext';
import "./styles.scss";

export const Header = () => {
    const authContext = React.useContext(AuthContext);
    const user = authContext.loggedInUserProfile;
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    let [isLoading, setLoading] = React.useState<boolean>(false);
    const navigation = useNavigate();

    const handleClick = React.useCallback((event: any) => {
        if (!anchorEl)
            setAnchorEl(event.currentTarget);
        else
            handleClose();
    }, [anchorEl]);

    const handleClose = React.useCallback(() => {
        setAnchorEl(null);
    }, []);

    const delete_cookie = React.useCallback((name: string) => {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }, []);

    const logout = React.useCallback(() => {
        delete_cookie("user");
        auth.signOut();
        if (authContext.setUser)
            authContext.setUser(null);
    }, [authContext, delete_cookie]);

    const open = Boolean(anchorEl);

    return <div className="headerContainer">
        <h1
            className='headerText'
            onClick={() => navigation("/")}
        >
            {`Technovert Game Zone`}
        </h1>
        {
            user ? (
                <div className='profileContainer'>
                    <div className='displayNameLabel'>
                        {user.displayName}
                    </div>
                    {
                        user.photoURL ? <Avatar
                            alt="Remy Sharp"
                            src={user.photoURL}
                            onClick={handleClick}
                        /> : <Avatar onClick={handleClick}>
                            {user.displayName?.charAt(0)}
                        </Avatar>
                    }
                    <Menu
                        anchorEl={anchorEl}
                        className={`menuContainer`}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        {/* <Link to="/leaderboard">
                            <MenuItem>
                                <ListItemIcon>
                                    <Leaderboard fontSize="small" />
                                </ListItemIcon>
                                Leaderboard
                            </MenuItem>
                        </Link> */}
                        <Link to="/events">
                            <MenuItem>
                                <ListItemIcon>
                                    <EmojiEvents fontSize="small" />
                                </ListItemIcon>
                                Events
                            </MenuItem>
                        </Link>
                        <Divider />
                        <MenuItem disabled>
                            <Avatar /> Profile
                        </MenuItem>
                        <MenuItem disabled>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Settings
                        </MenuItem>
                        <Link to="/login">
                            <MenuItem onClick={logout}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Link>
                    </Menu>
                </div>
            ) : <Stack flexDirection={'row'} gap={2} style={{ color: 'white' }}>
                <Button
                    variant="outlined"
                    style={{
                        maxWidth: 200,
                        margin: '10px auto',
                        padding: 10,
                        color: 'white',
                        borderColor: 'white'
                    }}
                    onClick={() => navigation("/login")}
                >
                    {`Login`}
                </Button>
                <Button
                    variant="outlined"
                    style={{
                        maxWidth: 200,
                        margin: '10px auto',
                        padding: 10,
                        color: 'white',
                        borderColor: 'white'
                    }}
                    onClick={() => navigation("/register")}
                >
                    {`Register`}
                </Button>
            </Stack>
        }
    </div >;
}