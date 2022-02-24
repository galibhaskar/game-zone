import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import * as React from 'react';
import { databaseRef } from '../../../config/firebaseSetup';
import "./styles.scss";
import defaultImage from '../../../images/ChaiBreak.jpg';
import { IRegistration } from '../../../concerns/IRegistration';
import { IEvent } from '../../../concerns/IEvent';
import { AuthContext } from '../../../context/AuthContext';
import { TeamType } from '../../../concerns/TeamType';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../loader';
import firebase from 'firebase/compat/app';
import { EventStatus } from '../../../concerns/EventStatus';

export const EventCard = (props: IEvent) => {
    const authcontext = React.useContext(AuthContext);
    const navigation = useNavigate();
    const [isloading, setLoading] = React.useState<boolean>(false);
    const [isUserRegistered, updateUserRegistrationStatus] = React.useState<boolean>(false);

    const addRegistration = React.useCallback(() => {
        setLoading(true);
        let loggedInUser = authcontext.loggedInUserProfile ?
            authcontext.loggedInUserProfile : null;

        let _eventRegistration: IRegistration = {
            eventID: props.id,
            team: TeamType.Undecided,
            timestamp: firebase.firestore.Timestamp.now(),
            userID: loggedInUser ? loggedInUser.uid : '',
            userName: loggedInUser && loggedInUser.displayName ? loggedInUser.displayName : '',
            userEmail: loggedInUser && loggedInUser.email ? loggedInUser.email : '',
            isSelected: false
        }
        databaseRef.collection("registrations")
            .add(_eventRegistration)
            .then((response) => {
                console.log(response);
                navigation(`/events/${props.id}`);
            }).catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [authcontext, props, navigation]);

    React.useEffect(() => {
        setLoading(true);
        databaseRef.collection("registrations")
            .where("userID", "==", authcontext.loggedInUserProfile?.uid)
            .get()
            .then((snapshot) => {
                setLoading(false);
                updateUserRegistrationStatus(snapshot.docs.length ? true : false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [authcontext]);

    return <Stack className={`eventCardContainer`}>
        <Card sx={{
            display: 'flex',
            borderTopRightRadius: 20,
            justifyContent: 'center',
        }}>
            <CardMedia
                component="img"
                sx={{ width: '30%' }}
                image={defaultImage}
                alt="default image"
            />
            <Box sx={{
                display: 'flex', flexDirection: 'column', flex: 1,
                padding: `10px 0`, borderTopRightRadius: `20px`
            }}>
                <CardContent sx={{ flex: '1 0 auto' }} className={`cardContentWrapper`}>
                    {/* <div className='label'>
                        {props.status}
                    </div> */}
                    <Typography className={`title`} component="div" variant="h3">
                        {props.title}
                    </Typography>
                    <Typography className={`organizer`} component="div" variant="h5">
                        {`Organizer : ${props.organizer}`}
                    </Typography>
                    <Typography className={`date`} variant="subtitle1" color="text.secondary" component="div">
                        {`Date : ${props.date}`}
                    </Typography>
                </CardContent>
            </Box>
            <Box sx={{
                display: 'flex', flexDirection: 'column',
                padding: `30px`, justifyContent: 'space-evenly',
                alignItems: 'center'
            }}>
                <Button
                    variant="contained"
                    onClick={addRegistration}
                    disabled={
                        isloading ||
                        isUserRegistered ||
                        props.status === EventStatus.Completed
                    }
                >
                    {`Join Event`}
                </Button>
                <Button
                    variant="contained"
                    onClick={() => props.status === EventStatus.Completed ?
                        navigation(`/events/${props.id}/leaderboard`) : navigation(`/events/${props.id}`)}
                    disabled={isloading}
                >
                    {`View Event`}
                </Button>
            </Box>
        </Card>
        {
            isloading && <Loader />
        }
    </Stack >;
}