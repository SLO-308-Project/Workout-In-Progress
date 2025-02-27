import {Session} from "../types/sessionTypes";

function SessionTableHeader()
{
    return (
        <thead>
            <tr>
                <th>Date</th>
                <th>Duration</th>
                <th>Actions</th>
            </tr>
        </thead>
    );
}

function SessionTableBody(props: {
    sessionData: Session[];
    formatDate: (dateString: string) => string;
    formatDuration: (seconds: number) => string;
    deleteSession: (id: string) => void;
})
{
    const rows = props.sessionData.map((session) =>
    {
        return (
            <tr key={session._id}>
                <td>{props.formatDate(session.date)}</td>
                <td>{props.formatDuration(session.time)}</td>
                <td>
                    {props.deleteSession && (
                        <button
                            onClick={() => props.deleteSession(session._id)}
                        >
                            Delete
                        </button>
                    )}
                </td>
            </tr>
        );
    });

    return <tbody>{rows}</tbody>;
}

function SessionTable(props: {
    sessionData: Session[];
    formatDate: (dateString: string) => string;
    formatDuration: (seconds: number) => string;
    deleteSession: (id: string) => void;
})
{
    return (
        <table>
            <SessionTableHeader />
            <SessionTableBody
                sessionData={props.sessionData}
                formatDate={props.formatDate}
                formatDuration={props.formatDuration}
                deleteSession={props.deleteSession}
            />
        </table>
    );
}

export default SessionTable;
