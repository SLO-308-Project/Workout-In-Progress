import {Routes, Route} from "react-router-dom";
import MachinePage from "./MachinePage";
import CurrentPage from "./Current";
import SessionPage from "./SessionPage";

const MainPage = () =>
{
    return (
        <main className="py-10 h-screen ">
        <Routes>
            <Route path="/Machine" element={<MachinePage />}></Route>
            <Route path="/Current" element={<CurrentPage />}></Route>
            <Route path="/Sessions" element={<SessionPage />}></Route>
        </Routes>
        <h1 className="font-bold text-center text-3xl">Hello</h1>
        </main>
    );
};

export default MainPage;
