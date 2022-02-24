import { Stack } from '@mui/material';
import * as _ from 'lodash';
import * as React from 'react';
import { TeamComponent } from '../team';
import "./styles.scss";

interface IDashboardProps {

}

interface IDashboardState {
    teamSlots: any[];
}

export class Dashboard extends React.Component<IDashboardProps, IDashboardState> {
    public constructor(props: IDashboardProps) {
        super(props);
        this.state = {
            teamSlots: [
                {
                    label: 'Team A',
                    teamList: []
                },
                {
                    label: 'Team B',
                    teamList: []
                }
            ]
        };
    }

    public render() {
        let { teamSlots } = this.state;
        let length = teamSlots.length;
        return <>
            <h2>
                {`Team Registration`}
            </h2>
            <Stack
                className='dashboardWrapper'
                flexDirection={'row'}
                gap={10}
            >
                {
                    teamSlots.map((_teamSlot: any, index: number) => {
                        return <React.Fragment key={`teamSlotWrapper${index}`}>
                            <div className='teamSlotWrapper'>
                                {/* <TeamComponent
                                    teamList={_teamSlot.teamList}
                                    title={_teamSlot.label}
                                    handleTeamUpdate={(updatedTeam: any[]) => {
                                        let _teamSlots = _.cloneDeep(this.state.teamSlots);
                                        _teamSlots[index].teamList = updatedTeam;
                                        this.setState({
                                            teamSlots: _teamSlots
                                        });
                                    }}
                                /> */}
                            </div>
                            {
                                index !== (length - 1) &&
                                <div className='verticalAxis' />
                            }
                        </React.Fragment>;
                    })
                }
            </Stack>
        </>;
    }
}