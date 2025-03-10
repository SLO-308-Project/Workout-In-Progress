import {Routes, Route} from "react-router-dom";
import MachinePage from "./MachinePage";
import CurrentSessionPage from "./CurrentSessionPage";
import CurrentPage from "./Current";
import SessionPage from "./SessionPage";

const MainPage = () =>
{
    return (
        <main>
        <Routes>
            <Route path="/Machine" element={<MachinePage />}></Route>
            <Route path="/Current" element={<CurrentPage />}></Route>
            <Route path="/Sessions" element={<SessionPage />}></Route>
            <Route path="/CurrentSession" element={<CurrentSessionPage />}></Route>
        </Routes>
        </main>
    );
};

export default MainPage;
