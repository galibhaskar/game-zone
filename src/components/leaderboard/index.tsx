import { Button, Dialog, DialogActions, DialogTitle, Divider, Stack } from '@mui/material';
import moment from 'moment';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EventStatus } from '../../concerns/EventStatus';
import { IEvent } from '../../concerns/IEvent';
import { IRegistration } from '../../concerns/IRegistration';
import { TeamType } from '../../concerns/TeamType';
import { databaseRef } from '../../config/firebaseSetup';
import { AuthContext } from '../../context/AuthContext';
import { Loader } from '../loader';
import { PointsEntry } from '../pointsEntry';
import { RandomMemberSelection } from '../randomMemberSelection';
import { TeamComponent } from '../team';
import "./styles.scss";

export const Leaderboard = () => {
    const { id } = useParams();
    let [teamList, setTeamList] = React.useState<{
        team1: IRegistration[],
        team2: IRegistration[]
    }>({
        team1: [],
        team2: []
    });
    const [teamScores, setScores] = React.useState<{
        team1: number,
        team2: number
    }>({
        team1: 0,
        team2: 0
    });
    const authcontext = React.useContext(AuthContext);
    const navigation = useNavigate();

    // const getEventByID = React.useCallback(() => {
    //     setLoading(true);
    //     databaseRef.collection("events")
    //         .doc(id).get()
    //         .then((snapshot: any) => {
    //             let value: IEvent;
    //             snapshot.forEach((doc: any) => {
    //                 let item = doc.data();
    //                 value = {
    //                     id: doc.id,
    //                     title: item.title,
    //                     status: item.status,
    //                     date: moment(item.dateTime.toDate()).format('DD MMM, YYYY'),
    //                     organizer: item.organizer
    //                 };
    //             });
    //             setCurrentEvent(value);
    //             setLoading(false);
    //         }).catch(err => {
    //             console.log(err);
    //             setLoading(false);
    //         })
    // }, [id]);

    const [currentEvent, setCurrentEvent] = React.useState<IEvent>();

    React.useEffect(() => {
        setCurrentEvent(authcontext.events.filter(_event => _event.id === id)[0]);
        // return () => {
        //     setCurrentEvent(undefined);
        //     setTeamList({
        //         team1: [],
        //         team2: []
        //     });
        //     setScores({
        //         team1: 0,
        //         team2: 0
        //     });
        // }
    }, [authcontext.events]);

    const [isloading, setLoading] = React.useState<boolean>(false);
    const [randomGeneratorValues, setRandomGeneratorValues] = React.useState<{
        participants: string[];
        team: TeamType
    }>({
        participants: [],
        team: TeamType.Undecided
    });
    const [pointsEntryDialogVisibility, setPointsEntryDialogVisibility] = React.useState<boolean>(false);
    const [endDialogVisibility, setEndDialogVisibility] = React.useState<boolean>(false);

    const getTeamScores = React.useCallback(() => {
        setLoading(true);
        const scoresRef = databaseRef.collection("scores")
            .where("eventID", "==", id);
        scoresRef.get()
            .then((snapshot: any) => {
                let _team1Score: number = 0;
                let _team2Score: number = 0
                snapshot.forEach((doc: any) => {
                    let item = doc.data();
                    if (item.team === TeamType.Team_A)
                        _team1Score += parseInt(item.score);
                    else
                        _team2Score += parseInt(item.score);
                });
                setScores({
                    team1: _team1Score,
                    team2: _team2Score
                });
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [id]);

    const getTeamsList = React.useCallback(() => {
        setLoading(true);
        const registrationsRef = databaseRef.collection("registrations")
            .where("eventID", "==", id);
        registrationsRef.get()
            .then((snapshot: any) => {
                let _team1: IRegistration[] = [];
                let _team2: IRegistration[] = [];
                snapshot.forEach((doc: any) => {
                    let item = doc.data();
                    if (item.team === TeamType.Team_A)
                        _team1.push({
                            id: doc.id,
                            eventID: item.eventID,
                            team: item.team,
                            userID: item.userID,
                            timestamp: item.timestamp.toDate(),
                            userName: item.userName,
                            userEmail: item.userEmail,
                            isSelected: item.isSelected
                        });
                    else
                        _team2.push({
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
                getTeamScores();
                setTeamList({
                    team1: _team1.sort(),
                    team2: _team2.sort()
                });
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setLoading(false);
            });;
    }, [id, getTeamScores]);

    const splitNewMembers = React.useCallback((eventID: string) => {
        setLoading(true);
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
                        getTeamsList();
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
    }, [getTeamsList]);

    const handleEventEnd = React.useCallback(() => {
        setLoading(true);
        const eventsRef = databaseRef.collection("events").doc(id);
        eventsRef.update({ status: EventStatus.Completed })
            .then(() => {
                setLoading(false);
                setEndDialogVisibility(false);
                navigation("/events");
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            })
    }, [id, getTeamsList]);

    React.useEffect(() => {
        getTeamsList();
    }, [getTeamsList]);


    React.useEffect(() => {
        if (!authcontext.loggedInUserProfile)
            navigation("/login");
    }, [navigation, authcontext]);

    return <Stack
        flexDirection={"row"}
        className={`leaderboardContainer`}
        style={{
            flexWrap: 'wrap',
        }}
    >
        {
            authcontext.isUserAdmin && <>
                <Stack
                    flexDirection={"column"}
                    style={{ width: 300 }}
                >
                    <h1>
                        {`Random People Selector`}
                    </h1>
                    <Button
                        variant="contained"
                        style={{
                            maxWidth: 200,
                            margin: 'auto',
                            padding: 10
                        }}
                        onClick={() => id && splitNewMembers(id)}
                    >
                        {` Include New Members`}
                    </Button>
                    <RandomMemberSelection
                        {...teamList}
                        handleDataRefresh={getTeamsList}
                        setCurrentTurnDetails={(payload) => setRandomGeneratorValues(payload)}
                    />
                </Stack>
                <Divider
                    orientation='vertical'
                />
            </>
        }
        <Stack flexDirection={"column"} style={{
            width: `60%`,
            height: `100%`
        }}>
            <Stack flexDirection={"row"}>
                <Button
                    variant="outlined"
                    style={{
                        maxWidth: 200,
                        margin: '10px auto',
                        padding: 10
                    }}
                    onClick={getTeamsList}
                    disabled={currentEvent && currentEvent.status === EventStatus.Completed}
                >
                    {`Refresh scores`}
                </Button>
                {
                    authcontext.isUserAdmin && <>
                        <Button
                            variant="outlined"
                            style={{
                                maxWidth: 200,
                                margin: '10px auto',
                                padding: 10
                            }}
                            onClick={() => setPointsEntryDialogVisibility(true)}
                            disabled={currentEvent && currentEvent.status === EventStatus.Completed}
                        >
                            {`Add scores`}
                        </Button>
                        <Button
                            variant="outlined"
                            style={{
                                maxWidth: 200,
                                margin: '10px auto',
                                padding: 10
                            }}
                            onClick={() => setEndDialogVisibility(true)}
                            disabled={currentEvent && currentEvent.status === EventStatus.Completed}
                        >
                            {`End Event`}
                        </Button>
                    </>
                }
            </Stack>
            <Stack
                flexDirection={"row"}
                style={{
                    justifyContent: `space-between`,
                    flexWrap: 'wrap',
                    padding: `20px 0`
                }}
            >
                <TeamComponent
                    key={`Team A`}
                    title={`Team A`}
                    teamList={teamList.team1}
                    score={teamScores.team1}
                    isWinner={
                        currentEvent && currentEvent.status === EventStatus.Completed
                            ? teamScores.team1 > teamScores.team2 : false
                    }
                />
                <Divider orientation="vertical" flexItem />
                <TeamComponent
                    key={`Team B`}
                    title={`Team B`}
                    teamList={teamList.team2}
                    score={teamScores.team2}
                    isWinner={currentEvent && currentEvent.status === EventStatus.Completed
                        ? teamScores.team1 < teamScores.team2 : false
                    }
                />
            </Stack>
        </Stack>
        {isloading && <Loader />}
        {
            pointsEntryDialogVisibility && <PointsEntry
                eventID={id ? id : ''}
                participants={randomGeneratorValues.participants}
                teamType={randomGeneratorValues.team}
                handleClose={() => {
                    getTeamScores();
                    setPointsEntryDialogVisibility(false);
                }}
            />
        }
        {
            endDialogVisibility && <Dialog
                open={true}
                onClose={() => setEndDialogVisibility(false)}
            >
                <DialogTitle>
                    {`Do you want to end this event?`}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => setEndDialogVisibility(false)}>
                        {`Cancel`}
                    </Button>
                    <Button onClick={handleEventEnd}>
                        {`End`}
                    </Button>
                </DialogActions>
            </Dialog>
        }
    </Stack >;
}