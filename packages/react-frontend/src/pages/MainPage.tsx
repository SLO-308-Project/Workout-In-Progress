import {Routes, Route} from "react-router-dom";
import MachinePage from "./MachinePage";

const MainPage = () => {
    return (
        <Routes>
            <Route path="/Machine" element={<MachinePage />}></Route>
        </Routes>
    );
};

export default MainPage;