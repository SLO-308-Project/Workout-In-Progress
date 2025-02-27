import {Routes, Route} from "react-router-dom";
import MachinePage from "./MachinePage";
import CurrentSessionPage from "./CurrentSessionPage";
import SessionPage from "./SessionPage";

const MainPage = () => {
    return (
        <Routes>
            <Route path="/Machine" element={<MachinePage />}></Route>
            <Route path="/CurrentSessionPage" element={<CurrentSessionPage />}></Route>
            <Route path="/Sessions" element={<SessionPage />}></Route>
        </Routes>
    );
};

export default MainPage;
