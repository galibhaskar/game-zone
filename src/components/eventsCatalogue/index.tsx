import { Divider, Stack } from '@mui/material';
import moment from 'moment';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { EventStatus } from '../../concerns/EventStatus';
import { IEvent } from '../../concerns/IEvent';
import { databaseRef } from '../../config/firebaseSetup';
import { AuthContext } from '../../context/AuthContext';
import { Loader } from '../loader';
import { EventCard } from './eventCard';
import "./styles.scss";

interface IEventsGroup {
    completedEvents: IEvent[];
    ongoingEvents: IEvent[];
    upcomingEvents: IEvent[];
}

export const EventsCatalogue = () => {
    const authcontext = React.useContext(AuthContext);
    const navigation = useNavigate();
    const [isloading, setLoading] = React.useState<boolean>(false);
    const [storeEvents, setStoreEvents] = React.useState<IEvent[]>([]);
    const [events, setEvents] = React.useState<IEventsGroup>({
        completedEvents: [],
        ongoingEvents: [],
        upcomingEvents: []
    });

    const getEvents = React.useCallback(() => {
        const eventsRef = databaseRef.collection("events");
        eventsRef.get()
            .then((snapshot: any) => {
                let newState: IEvent[] = [];
                snapshot.forEach((doc: any) => {
                    let item = doc.data();
                    newState.push({
                        id: doc.id,
                        title: item.title,
                        status: item.status,
                        date: moment(item.dateTime.toDate()).format('DD MMM, YYYY'),
                        organizer: item.organizer
                    });
                });
                setStoreEvents(newState);
            });
    }, []);

    React.useEffect(() => {
        if (!authcontext.loggedInUserProfile) {
            navigation("/login");
        }
        let _completedEvents: IEvent[] = [];
        let _ongoingEvents: IEvent[] = [];
        let _upcomingEvents: IEvent[] = [];
        if (authcontext.setEvents)
            authcontext.setEvents(storeEvents);
        storeEvents.map((_event: IEvent) => {
            if (_event.status === EventStatus.Completed)
                _completedEvents.push(_event);
            else if (_event.status === EventStatus.Ongoing)
                _ongoingEvents.push(_event);
            else if (_event.status === EventStatus.Upcoming)
                _upcomingEvents.push(_event);
            return null;
        });

        setEvents({
            completedEvents: _completedEvents,
            ongoingEvents: _ongoingEvents,
            upcomingEvents: _upcomingEvents
        });
        setLoading(false);
    }, [authcontext, storeEvents, navigation]);

    React.useEffect(() => {
        getEvents();
    }, [getEvents]);


    return <Stack flexDirection={"column"} className={`eventsCatalogueContainer`}>
        <h3>
            {`Completed Events`}
        </h3>
        <Divider />
        {
            events.completedEvents.length ? <Stack flexDirection={"column"}>
                {
                    events.completedEvents.map((_completedEvent: IEvent) => {
                        return <EventCard
                            key={`event_${_completedEvent.id}`}
                            {..._completedEvent}
                        />;
                    })
                }
            </Stack> : <div className='noEventsLabel'>
                {`No events`}
            </div>
        }

        <Divider />
        <h3>
            {`Ongoing Events`}
        </h3>
        <Divider />
        {
            events.ongoingEvents.length ? <Stack flexDirection={"column"}>
                {
                    events.ongoingEvents.map((_ongoingEvent: IEvent) => {
                        return <EventCard
                            key={`event_${_ongoingEvent.id}`}
                            {..._ongoingEvent}
                        />;
                    })
                }
            </Stack> : <div className='noEventsLabel'>
                {`No events`}
            </div>
        }
        <Divider />
        <h3>
            {`Upcoming Events`}
        </h3>
        <Divider />
        {
            events.upcomingEvents.length ? <Stack flexDirection={"column"}>
                {
                    events.upcomingEvents.map((_upcomingEvent: IEvent) => {
                        return <EventCard
                            key={`event_${_upcomingEvent.id}`}
                            {..._upcomingEvent}
                        />;
                    })
                }
            </Stack> : <div className='noEventsLabel'>
                {`No events`}
            </div>
        }
        {
            isloading && <Loader />
        }
    </Stack>;
}