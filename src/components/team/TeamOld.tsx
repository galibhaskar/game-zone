import * as React from 'react';
import "./styles.scss";
import Button from '@mui/material/Button';
import { IconButton, Stack, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import * as _ from 'lodash';
import { Add, Check, Clear, Edit, Save } from '@mui/icons-material';

interface ITeamComponentProps {
    title: string;
    teamList: any[];
    handleTeamUpdate: (updatedTeam: any[]) => void;
}

interface ITeamComponentState {
    selectedEditIndex: number;
    editText: string;
    teamMembers: any[];
    teamTitle: string;
    titleEdit: boolean;
}

export class TeamOldComponent extends React.Component<ITeamComponentProps, ITeamComponentState> {
    constructor(props: ITeamComponentProps) {
        super(props);
        this.state = {
            teamMembers: props.teamList.length ? props.teamList : [''],
            selectedEditIndex: props.teamList.length ? -1 : 0,
            editText: '',
            teamTitle: props.title,
            titleEdit: true
        };
    }

    private handleSave = () => {
        let { teamMembers, selectedEditIndex, editText } = this.state;
        let _teamMembers = _.cloneDeep(teamMembers);
        _teamMembers[selectedEditIndex] = editText;
        this.setState({
            teamMembers: _teamMembers,
            editText: '',
            selectedEditIndex: -1
        });
    }

    private handleEdit = (index: number, text: string) => {
        this.setState({
            selectedEditIndex: index,
            editText: text
        });
    }

    private handleDelete = (index: number) => {
        let _teamMembers = _.cloneDeep(this.state.teamMembers);
        _teamMembers.splice(index, 1);
        if (!_teamMembers.length) {
            this.setState({
                teamMembers: [''],
                selectedEditIndex: 0,
                editText: ''
            });
        }
        else
            this.setState({ teamMembers: _teamMembers });
    }

    private handleClear = () => {
        let { teamMembers, selectedEditIndex } = this.state;
        if (teamMembers[selectedEditIndex] === '')
            this.setState({ editText: '' });
        else
            this.setState({
                editText: '',
                selectedEditIndex: -1
            });
    }

    private handleAdd = () => {
        let _teamMembers = _.cloneDeep(this.state.teamMembers);
        _teamMembers.push('');
        this.setState({
            teamMembers: _teamMembers,
            selectedEditIndex: _teamMembers.length - 1
        });
    }

    public render() {
        let { teamList, handleTeamUpdate } = this.props;
        let { teamMembers, selectedEditIndex, editText, teamTitle, titleEdit } = this.state;
        return <Stack
            className="teamComponentWrapper"
            direction={"column"}
        >
            <div className='teamContentWrapper'>
                {
                    titleEdit ? <>
                        <TextField
                            className='teamComponentHeader'
                            label="Team title"
                            variant="standard"
                            value={teamTitle}
                            onKeyDown={(event: any) => {
                                if (event.keyCode === 13 && event.target.value) {
                                    this.setState({
                                        teamTitle: event.target.value,
                                        titleEdit: false
                                    });
                                }
                            }}
                            onChange={(event: any) => this.setState({ teamTitle: event.target.value })}
                        />
                    </> : <div
                        className='titleWrapper'
                        onClick={() => this.setState({ titleEdit: true })}
                    >
                        {teamTitle}
                    </div>
                }
                {
                    teamMembers.map((_teamMember: any, index: number) => {
                        return <div
                            key={`teamMemberWrapper_${index}`}
                            className='teamMemberWrapper'
                        >
                            {
                                selectedEditIndex === index ? (
                                    <Stack
                                        direction={"row"}
                                        spacing={3}
                                        className='editContainer'
                                        key={`edit_${index}`}
                                    >
                                        <TextField
                                            className='textfieldContainer'
                                            id="outlined-basic"
                                            label={`Enter name`}
                                            variant="outlined"
                                            value={editText}
                                            onKeyDown={(event: any) => {
                                                if (event.keyCode === 13 && event.target.value)
                                                    this.handleSave();
                                            }}
                                            onChange={(event: any) => this.setState({ editText: event.target.value })}
                                        />
                                        <Stack direction={"row"}                                    >
                                            <IconButton
                                                aria-label="clear"
                                                onClick={() => this.handleClear()}
                                            >
                                                <Clear />
                                            </IconButton>
                                            <IconButton
                                                aria-label="check"
                                                disabled={editText === ""}
                                                onClick={() => this.handleSave()}
                                            >
                                                <Check />
                                            </IconButton>
                                        </Stack>
                                    </Stack>
                                ) : (
                                    <Stack
                                        direction={"row"}
                                        spacing={3}
                                        className='displayContainer'
                                        key={`display_${index}`}
                                    >
                                        <div className='teamMemberLabel'>
                                            {_teamMember}
                                        </div>
                                        <Stack direction={"row"}                                    >
                                            <IconButton
                                                aria-label="edit"
                                                onClick={() => this.handleEdit(index, _teamMember)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => this.handleDelete(index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    </Stack>
                                )
                            }
                        </div>;
                    })
                }
            </div>
            <Stack
                direction={"row"}
                spacing={2}
                className={`actionButtonsContainer`}
            >
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => this.handleAdd()}
                    disabled={teamMembers[teamMembers.length - 1] === ""}
                >
                    {`Add Member`}
                </Button>
                <Button
                    variant="contained"
                    endIcon={<Save />}
                    onClick={() => handleTeamUpdate(teamMembers)}
                    disabled={
                        teamMembers[teamMembers.length - 1] === "" ||
                        JSON.stringify(teamList) === JSON.stringify(teamMembers)
                    }
                >
                    {`Save`}
                </Button>
            </Stack>
        </Stack>;
    }
}