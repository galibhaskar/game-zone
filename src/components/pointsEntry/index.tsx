import { Button, Dialog, DialogActions, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { IScore } from '../../concerns/IScore';
import { TeamType } from '../../concerns/TeamType';
import { databaseRef } from '../../config/firebaseSetup';
import { AuthContext } from '../../context/AuthContext';
import { Loader } from '../loader';
import "./styles.scss";

interface IPointsEntryProps {
    teamType: TeamType;
    participants: string[];
    eventID: string;
    handleClose: () => void;
}

export const PointsEntry = (props: IPointsEntryProps) => {
    const authcontext = React.useContext(AuthContext);
    const [gameName, setGameName] = React.useState<string>();
    const [score, setScore] = React.useState<number>();
    const navigation = useNavigate();
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [success, setSuccess] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!authcontext.isUserAdmin)
            navigation("/");
    }, [authcontext, navigation]);

    const handleAdd = () => {
        setLoading(true);
        setSuccess(false);
        const scoresRef = databaseRef.collection("scores");
        let _score: IScore = {
            eventID: props.eventID,
            name: gameName ? gameName : '',
            score: score ? score : 0,
            team: props.teamType,
            participants: props.participants
        }
        scoresRef.add(_score)
            .then((res) => {
                
                props.handleClose();
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setSuccess(false);
                setLoading(false);
            });
    }

    if (!props.eventID || props.participants.length == 0 || props.teamType === TeamType.Undecided)
        return <Dialog className='pointsEntryContainer' onClose={props.handleClose} open={true}>
            <DialogTitle>
                {`select the participants to add the scores`}
            </DialogTitle>
            <DialogActions>
                <Button
                    variant="outlined"
                    onClick={props.handleClose}
                >
                    {`Close`}
                </Button>
            </DialogActions>
        </Dialog >;

    return <Dialog className='pointsEntryContainer' onClose={props.handleClose} open={true}>
        <DialogTitle>
            {`Points Entry`}
        </DialogTitle>
        <Stack style={{ width: 400, margin: 20, gap: 10 }}>
            {
                success && <label className='successMessage'>
                    {success}
                </label>
            }
            <Typography className={`title`} component="div" variant="h4">
                {`EventID:${props.eventID}`}
            </Typography>
            <Typography className={`participants`} component="div" variant="h5">
                {`Participants: ${props.participants}`}
            </Typography>
            <Typography className={`teamType`} component="div" variant="h5">
                {`team: ${props.teamType}`}
            </Typography>
            <TextField
                className='textfieldContainer'
                id="outlined-basic"
                label={`Enter game name`}
                variant="outlined"
                value={gameName}
                onChange={(event: any) => setGameName(event.target.value)}
            />
            <TextField
                className='textfieldContainer'
                id="outlined-basic"
                label={`Enter score`}
                variant="outlined"
                value={score}
                onChange={(event: any) => setScore(event.target.value)}
            />
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={handleAdd}
                    disabled={!gameName}
                >
                    {`Add Score`}
                </Button>
                <Button
                    variant="outlined"
                    onClick={props.handleClose}
                >
                    {`Close`}
                </Button>
            </DialogActions>
            {
                isLoading && <Loader />
            }
        </Stack>
    </Dialog >;
}