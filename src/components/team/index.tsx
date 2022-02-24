import { Star, StarBorder } from '@mui/icons-material';
import { Avatar, Chip, Divider, List, ListItem, ListItemAvatar, ListItemText, Stack } from '@mui/material';
import React from 'react';
import { IRegistration } from '../../concerns/IRegistration';
import { AuthContext } from '../../context/AuthContext';
import "./styles.scss";
import winnerImage from '../../images/winner.png';

interface ITeamComponentProps {
    teamList: IRegistration[];
    title: string;
    score: number;
    isWinner: boolean;
}

export const TeamComponent = (props: ITeamComponentProps) => {
    const authcontext = React.useContext(AuthContext);
    const isUserTeam = props.teamList.filter(_member =>
        _member.userID === authcontext.loggedInUserProfile?.uid).length ? true : false;

    return <Stack className={`teamNewComponentContainer`}>
        <h1 className={`titleLabel`}>
            {props.title}
        </h1>
        <Chip
            label={isUserTeam ? `Your team` : `Opponent Team`}
        />
        <h4 className={`countLabel`}>
            {`score : ${props.score}`}
        </h4>
        <Divider />
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {
                props.teamList.map((_participant: IRegistration) => {
                    return <React.Fragment key={`participant_${_participant.id}`}>
                        <ListItem style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ListItemAvatar>
                                <Avatar>
                                    {`${_participant.userName.charAt(0)}`}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                style={
                                    {
                                        maxWidth: 180,
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden'
                                    }}
                                primary={_participant.userName}
                                secondary={_participant.userEmail}
                            />
                            {
                                _participant.isSelected ?
                                    <Star /> : <StarBorder />
                            }
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                })
            }
        </List>
        {
            props.isWinner && <img
                src={winnerImage}
                className={`winnerImageContainer`}
            />
        }
    </Stack>;
}