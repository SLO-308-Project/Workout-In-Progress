import {Routes, Route} from "react-router-dom";
import MachinePage from "./MachinePage";
import CurrentPage from "./Current";
import SessionPage from "./SessionPage";

const MainPage = () => {
    return (
        <Routes>
            <Route path="/Machine" element={<MachinePage />}></Route>
            <Route path="/Current" element={<CurrentPage />}></Route>
            <Route path="/Sessions" element={<SessionPage />}></Route>
        </Routes>
    );
};

export default MainPage;
