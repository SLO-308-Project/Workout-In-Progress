import {Routes, Route} from "react-router-dom";
import MachinePage from "./MachinePage";
import CurrentPage from "./Current";

const MainPage = () => {
    return (
        <Routes>
            <Route path="/Machine" element={<MachinePage />}></Route>
            <Route path="/Current" element={<CurrentPage />}></Route>
        </Routes>
    );
};

export default MainPage;
