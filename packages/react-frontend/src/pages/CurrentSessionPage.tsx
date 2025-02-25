import {useState, useEffect} from "react";
import CurrentSessionTable from "../components/currentSessionTable";
import CurrentSessionStartButton from "../components/currentSessionEnd";
import CurrentSessionEndButton from "../components/currentSessionStart";

function CurrentSessionPage() {
    // const [workout, setWorkout] = useState([
    //     {
    //         workout: "1",
    //         machine: "Benchpress",
    //         repeat: [
    //             {
    //                 weight: 135,
    //                 reps: 10,
    //             }
    //         ]
    //     },
    // ]);

    // function removeWorkout() {
    //     return;
    // }

    const [times, setTime] = useState([
        {
            time: 0,
            deltaTime: 0
        }
    ])

    function setTimeField() {
        const update = [{
            time: Date.now(),
            deltaTime: 0
        }];
        setTime(update);
    }

    function getTime() {
        return times[0].time;
    }

    function setDeltaTime() {
        const update = [{
            time: getTime(),
            deltaTime: Date.now() - getTime()
        }];
        setTime(update);
    }

    return <div className="container">
        <CurrentSessionStartButton 
            setTime={setTimeField}
            timeData={times}
        />

        {/* <CurrentSessionTable
                workoutData={workout}
                removeWorkout={removeWorkout}
        /> */}
        <CurrentSessionEndButton setDeltaTime={setDeltaTime}/>
    </div>
}

export default CurrentSessionPage;