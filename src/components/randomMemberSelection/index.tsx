import { GetApp, Star, StarBorder } from '@mui/icons-material';
import { Button, Checkbox, Divider, ListItemText, MenuItem, OutlinedInput, Select, Stack } from '@mui/material';
import _ from 'lodash';
import * as React from 'react';
import { IRegistration } from '../../concerns/IRegistration';
import { TeamType } from '../../concerns/TeamType';
import { databaseRef } from '../../config/firebaseSetup';
import { Loader } from '../loader';
import "./styles.scss";

export const RandomMemberSelection = (props: {
    team1: IRegistration[],
    team2: IRegistration[],
    handleDataRefresh: () => void;
    setCurrentTurnDetails: (payload: any) => void;
}) => {
    let [peopleCount, setCount] = React.useState<number>(0);
    let [team, setTeam] = React.useState<TeamType>();
    let [selectedPeople, setSelectedPeople] = React.useState<IRegistration[]>([]);
    let [highlightedPeople, highlightPeople] = React.useState<string[]>([]);
    let [nonSelectedOnly, setNonSelectedOnly] = React.useState<boolean>(true);
    const [isloading, setLoading] = React.useState<boolean>(false);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const getPeople = React.useCallback(() => {
        let _selectedTeam = [];
        if (team === TeamType.Team_A) {
            let _team1 = nonSelectedOnly ? (
                _.cloneDeep(props.team1)
                    .filter(_person => _person.isSelected === false)
            ) : (_.cloneDeep(props.team1));
            for (let i = 0; i < peopleCount && _team1.length; i++) {
                let index = Math.floor(Math.random() * _team1.length);
                _selectedTeam.push(_team1[index]);
                _team1.splice(index, 1);
            }
        }
        else {
            let _team2 = nonSelectedOnly ? (
                _.cloneDeep(props.team2)
                    .filter(_person => _person.isSelected === false)
            ) : (_.cloneDeep(props.team2));
            for (let i = 0; i < peopleCount && _team2.length; i++) {
                let index = Math.floor(Math.random() * _team2.length);
                _selectedTeam.push(_team2[index]);
                _team2.splice(index, 1);
            }
        }
        setSelectedPeople(_selectedTeam);
    }, [peopleCount, team, props, nonSelectedOnly]);

    const updateHighlightedUsersToDB = React.useCallback(() => {
        setLoading(true);
        let batch = databaseRef.batch();
        highlightedPeople.map((_registrationID) => {
            let docRef = databaseRef.collection("registrations")
                .doc(_registrationID);
            batch.update(docRef, { isSelected: true });
            return null;
        });
        batch.commit()
            .then((res) => {
                setLoading(false);
                props.setCurrentTurnDetails({
                    participants: resolveUserName(highlightedPeople),
                    team: team,
                });
                props.handleDataRefresh();
            }).catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [highlightedPeople, props]);

    const resolveUserName = React.useCallback((selectedIDs: string[]) => {
        let selectedUsernames: string[] = [];
        selectedPeople.filter(_value => {
            if (_value.id && selectedIDs.lastIndexOf(_value.id) !== -1) {
                selectedUsernames.push(_value.userName);
                return true;
            }
            return false;
        });
        return selectedUsernames;
    }, [selectedPeople]);

    return <Stack className={`randomMemberSelectionContainer`}>
        <Stack className={`formContainer`}>
            <Select
                value={peopleCount}
                label="Count"
                onChange={(event: any) => setCount(event.target.value)}
            >
                {
                    [1, 2, 3, 4, 5].map(_option => {
                        return <MenuItem
                            key={`option_${_option}`}
                            value={_option}
                        >
                            {_option}
                        </MenuItem>;
                    })
                }
            </Select>
            <Select
                value={team}
                label="Team"
                onChange={(event: any) => setTeam(event.target.value)}
            >
                {
                    Object.keys(TeamType).map(_option => {
                        return <MenuItem
                            key={`teamtype_${_option}`}
                            value={_option}
                        >
                            {_option}
                        </MenuItem>;
                    })
                }
            </Select>
            <Stack flexDirection={"row"} style={{ alignItems: 'center' }}>
                <Checkbox
                    onChange={(event: any) => {
                        setNonSelectedOnly(event.target.checked);
                    }}
                    checked={nonSelectedOnly}
                />
                <ListItemText primary={`Non Selected People Only`} />
            </Stack>
            <Button
                variant="outlined"
                startIcon={<GetApp />}
                onClick={getPeople}
            >
                {`get people`}
            </Button>
        </Stack>
        {
            selectedPeople.length !== 0 && <>
                <Select
                    className='multiSelectDropdown'
                    multiple
                    value={highlightedPeople}
                    onChange={(event: any) => {
                        let _value = event.target.value;
                        highlightPeople(typeof _value === "string" ? _value.split(",") : _value)
                    }}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => resolveUserName(selected).join(", ")}
                    MenuProps={MenuProps}
                >
                    {
                        selectedPeople.map((_registration) => (
                            <MenuItem key={_registration.id} value={_registration.id}>
                                <Checkbox
                                    checked={
                                        _registration.id ?
                                            highlightedPeople.indexOf(_registration.id) > -1 : false
                                    }
                                />
                                <ListItemText primary={_registration.userName} />
                                {
                                    _registration.isSelected ?
                                        <Star /> : <StarBorder />
                                }
                            </MenuItem>
                        ))
                    }
                </Select>
                <Button
                    variant="outlined"
                    style={{ maxWidth: 'fit-content', margin: '10px auto' }}
                    onClick={updateHighlightedUsersToDB}
                >
                    {`select`}
                </Button>
                <Divider />
            </>
        }
        {
            isloading && <Loader />
        }
    </Stack >;
}