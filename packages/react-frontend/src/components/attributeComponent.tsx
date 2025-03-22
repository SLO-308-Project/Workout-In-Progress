import "../temp.css"

export default function Attribute(props)
{
    function deleteAttribute(): void
    {
        props.handleDelete(props.name);
    }

    return (
        <div className="component">
            <div>Name: {props.name}</div>
            <div>Unit: {props.unit}</div>
            <div>
                <button onClick={deleteAttribute}>-</button>
            </div>
        </div>
    );
}
