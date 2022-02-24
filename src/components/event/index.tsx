import {
    Avatar, Box, Button, CardContent, Divider, List,
    ListItem, ListItemAvatar, ListItemText, Stack, Typography
} from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import * as React from 'react';
import { databaseRef } from '../../config/firebaseSetup';
import "./styles.scss";
import defaultImage from '../../images/ChaiBreak.jpg';
import { IRegistration } from '../../concerns/IRegistration';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { EventStatus } from '../../concerns/EventStatus';
import { Loader } from '../loader';
import { TeamType } from '../../concerns/TeamType';
import { IEvent } from '../../concerns/IEvent';

export const Event = () => {
    const authcontext = React.useContext(AuthContext);
    const [registrationsData, setRegistrationsData] = React.useState<IRegistration[]>([]);
    const { id } = useParams();
    // const selectedEvent = authcontext.events.filter(_event => _event.id === id)[0];
    const [isloading, setLoading] = React.useState<boolean>(false);
    const navigation = useNavigate();

    const [selectedEvent, setSelectedEvent] = React.useState<IEvent>();

    React.useEffect(() => {
        setSelectedEvent(authcontext.events.filter(_event => _event.id === id)[0]);
        // return () => {
        //     setSelectedEvent(undefined);
        // }
    }, [authcontext.events]);

    const getEventRegistrations = React.useCallback((eventID: string) => {
        setLoading(true);
        const registrationsRef = databaseRef.collection("registrations")
            .where("eventID", "==", eventID);
        registrationsRef.get()
            .then((snapshot: any) => {
                let newState: IRegistration[] = [];
                snapshot.forEach((doc: any) => {
                    let item = doc.data();
                    newState.push({
                        id: doc.id,
                        eventID: item.eventID,
                        team: item.team,
                        userID: item.userID,
                        timestamp: item.timestamp.toDate(),
                        userName: item.userName,
                        userEmail: item.userEmail,
                        isSelected: item.isSelected
                    });
                });
                setRegistrationsData(newState.sort());
                setLoading(false);
            });
    }, []);

    const splitTeams = React.useCallback((eventID: string) => {
        const registrationsRef = databaseRef.collection("registrations")
            .where("eventID", "==", eventID)
            .where("team", "==", TeamType.Undecided);
        registrationsRef.get()
            .then((snapshot: any) => {
                let prevSelected = TeamType.Team_B;
                let batch = databaseRef.batch();
                snapshot.forEach((doc: any) => {
                    let docRef = databaseRef.collection("registrations").doc(doc.id);
                    let _new = prevSelected === TeamType.Team_A ?
                        TeamType.Team_B : TeamType.Team_A;
                    batch.update(docRef, {
                        team: _new
                    });
                    prevSelected = _new;
                });
                batch.commit()
                    .then((response) => {
                        navigation(`/events/${eventID}/leaderboard`);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.log(err);
                        setLoading(false);
                    });
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [navigation]);

    const updateEventStatus = React.useCallback((eventID: string) => {
        setLoading(true);
        databaseRef.collection("events")
            .doc(eventID).update({ status: EventStatus.Ongoing })
            .then((snapshot: any) => {
                splitTeams(eventID);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [splitTeams]);

    React.useEffect(() => {
        if (!authcontext.loggedInUserProfile)
            navigation("/login");
        if (selectedEvent && selectedEvent.status === EventStatus.Ongoing) {
            navigation(`/events/${id}/leaderboard`);
        }
        if (id)
            getEventRegistrations(id);
    }, [id, selectedEvent, authcontext, navigation, getEventRegistrations]);

    return <Stack className={`eventContainer`}>
        {
            selectedEvent && <Stack style={{
                display: 'flex',
                flexDirection: "row",
                justifyContent: "center",
                flexWrap: "wrap"
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
                        <Typography className={`title`} component="div" variant="h3">
                            {selectedEvent.title}
                        </Typography>
                        <Typography className={`organizer`} component="div" variant="h5">
                            {`Organizer : ${selectedEvent.organizer}`}
                        </Typography>
                        <Typography className={`date`} variant="subtitle1" color="text.secondary" component="div">
                            {`Date : ${selectedEvent.date}`}
                        </Typography>
                    </CardContent>
                </Box>
                <Box sx={{
                    display: 'flex', flexDirection: 'column',
                    padding: `30px`, justifyContent: 'space-evenly',
                    alignItems: 'center'
                }}>
                    <Button
                        style={{
                            width: 400,
                            height: 200,
                            fontSize: 30
                        }}
                        variant="contained"
                        disabled={!authcontext.isUserAdmin}
                        onClick={() => id && updateEventStatus(id)}
                    >
                        {`Start Event`}
                    </Button>
                </Box>
            </Stack>
        }
        <Divider />
        <Stack style={{
            display: 'flex',
            width: '50%',
            margin: 'auto'
        }}>
            <h3>
                {`Registered Members(${registrationsData.length})`}
            </h3>
            <Button
                variant="contained"
                style={{
                    maxWidth: 100,
                    margin: 'auto',
                    padding: 10
                }}
                onClick={() => id && getEventRegistrations(id)}
                disabled={selectedEvent && selectedEvent.status === EventStatus.Completed}
            >
                {` Refresh`}
            </Button>
            {
                registrationsData.length !== 0 ? <List sx={{
                    width: '100%', maxWidth: 360,
                    bgcolor: 'background.paper', margin: `auto`
                }}>
                    {
                        registrationsData.map((_participant: IRegistration) => {
                            return <React.Fragment key={`participant_${_participant.id}`}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            {`${_participant.userName.charAt(0)}`}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={_participant.userName}
                                        secondary={_participant.userEmail}
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </React.Fragment>
                        })
                    }
                </List> :
                    <h1>{`No registrations yet`}</h1>
            }
        </Stack>
        {
            isloading && <Loader />
        }
    </Stack >;
}