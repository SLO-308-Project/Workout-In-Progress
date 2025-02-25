import {Link} from "react-router-dom";
function CurrentPage() 
{
    return (
        <Link to="/Machine">
            <button variant="outlined">
                    Go to Machine Page
            </button>
        </Link>
    );
}

export default CurrentPage;
