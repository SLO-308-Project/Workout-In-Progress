import { View, Text, Pressable } from 'react-native';
import { useState, useEffect } from 'react';

import { Machine } from '@/types/machine';
import { Session } from '@/types/session';
import { Workout } from '@/types/workout';

import WorkoutComponent from '@/components/currSession/workoutComponent';
import WorkoutForm from '@/components/currSession/workoutForm';

import {
  fetchGetWorkouts,
  fetchPostWorkout,
  fetchDeleteWorkout,
} from '@/fetchers/workoutFetchers';

import { fetchGetMachine } from '@/fetchers/machineFetchers';

import {
  fetchStartSessions,
  fetchEndSession,
  fetchCurrentSession,
  fetchGetSessions,
} from "@/fetchers/currentSessionFetchers";

const clockSpeed = 200;

export default function CurrentSessionPage() {
  const [sessions, setSessions] = useState<Session | null>(null);
  const [sessionNum, setSessionNum] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // State for the users currently selected machine

  const [machines, setMachines] = useState<Machine[]>([]);
  useEffect(() => {
    getMachines();
    getCurrentSession();
    getSessionNumber();
  }, []);

  // Helper function for date formatting
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  // Helper function for duration formatting
  // Converts database time which is stored in seconds to hours and minutes
  function formatDuration(milliseconds: number): string {
    const hours = Math.floor(milliseconds / 3600 / 1000);
    const minutes = Math.floor((milliseconds / 60 / 1000) % 60);
    const second = Math.floor((milliseconds / 1000) % 60);
    return `${hours}h ${minutes}m ${second}s`;
  }

  // Getting workouts is triggered whenever the current session is updated
  useEffect(() => {
    if (sessions !== null) {
      getWorkouts(sessions);
      const interval = setInterval(() => {
        setTime((time) => time + clockSpeed / 1000);
      }, clockSpeed);

      return () => clearInterval(interval);
    }
  }, [sessions]);

  function startSession(): void {
    if (sessions !== null) {
      return;
    }
    fetchStartSessions()
      .then((res) => {
        if (res.status === 201) {
          return res.json();
        }
        else {
          console.log("Nothing Found");
        }
      })
      .then((json: Session) => {
        setSessions(json);
        setSessionNum(sessionNum! + 1);
      })
      .catch((err: unknown) => {
        console.log("Error starting session: ", err);
      });
  }

  function endSession(): void {
    if (sessions === null) {
      return;
    }
    fetchEndSession(sessions._id)
      .then((res) => {
        if (res.status === 201) {
          setSessions(null);
        }
        else {
          console.log("No session found");
        }
      })
      .catch((err: unknown) => {
        console.log("Error ending session: ", err);
      });
  }

  function getMachines(): void {
    fetchGetMachine()
      .then((res: Response) => res.json())
      .then((json) => {
        setMachines(json);
      })
      .catch((error: unknown) => console.log(error));
  }

  /*
   * Dispatches the request to get the current session, sets the current session.
   * */
  function getCurrentSession(): void {
    fetchCurrentSession()
      .then((res) => {
        if (res.status === 200) {
          console.log("200");
          return res.json();
        }
        else if (res.status === 204) {
          console.log("204");
          return null;
          //throw new Error("Got a 204 from fetch");
        }
      })
      .then((json: Session[]) => {
        if (json === null) {
          console.log("No values");
          throw new Error("No current session?");
        }
        else {
          setSessions(json[0]);
        }
      })
      .catch((err: unknown) => {
        console.log("Error getting current session: ", err);
        throw new Error(`Error getting current session: ${err}`);
      });
  }

  function getSessionNumber(): void {
    fetchGetSessions()
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        else {
          throw new Error("No sessions found");
        }
      })
      .then((json: Session[]) => {
        console.log(`session number: ${json.length}`);
        setSessionNum(json.length);
      })
      .catch((err: unknown) => {
        console.log("Error getting session number ", err);
      });
  }

  function getWorkouts(session: Session): void {
    fetchGetWorkouts(session._id)
      .then((res) => {
        if (res.status === 201) {
          return res.json();
        }
        else {
          throw new Error("Failed to get workouts");
        }
      })
      .then((json) => {
        setWorkouts(json);
      });
  }

  function addWorkout(machineId: string): void {
    if (sessions === null) {
      throw new Error("Could not get session. Session does not exist.");
    }
    console.log(`trying to add a workout. sessions=${sessions} machineId=${machineId}`);
    if (sessions && machineId) {
      fetchPostWorkout(sessions._id, machineId)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          else {
            throw new Error();
          }
        })
        .then((res_data: Session) => {
          console.log(`RES_DATA: ${res_data._id}`);
          console.log(`MachineId: ${machineId}`);
          console.log(`SessionId: ${sessions._id}`);
          setWorkouts(res_data.workout);
        })
        .catch((error: unknown) => console.log(error));
    }
  }

  function removeWorkout(workoutId: string): void {
    if (sessions && workoutId) {
      fetchDeleteWorkout(sessions._id, workoutId)
        .then((res) => {
          if (res.ok) {
            const new_workouts = workouts.filter(
              (workout) => workout._id !== workoutId,
            );
            setWorkouts(new_workouts);
          }
          else {
            throw new Error();
          }
        })
        .catch((error: unknown) => console.log(error));
    }
  }

  const machineIdToName = (machineId: string) => {
    if (machines) {
      return machines.filter((machine) => machine._id === machineId)[0]
        .name;
    }
  };

  const listWorkouts = workouts.map((workout: Workout, idx: number) => (
    <View>
      <WorkoutComponent
        key={idx}
        workoutId={workout._id}
        machineId={workout.machineId}
        machineName={machineIdToName(workout.machineId)}
        handleDelete={removeWorkout}
      />
    </View>
  ));

  function sessionData() {
    if (sessions === null) {
      return (
        <Text>No Active Session.</Text>
      )
    }
    return (
      <View>
        <Text>Session: {sessionNum}</Text>
        <Text>Start Date: {formatDate(sessions.date)}</Text>
        <Text>Duration:{formatDuration((Date.now() - new Date(sessions.date).getTime()))}</Text>
      </View>

    )
  }

  return (
    <View>
      {sessionData()}
      <Pressable onPress={startSession}><Text>Start Session</Text></Pressable>
      {sessions && (
        <Pressable onPress={endSession}><Text>End</Text></Pressable>
      )}
      {sessions && listWorkouts}
      {sessions && (
        <WorkoutForm handleSubmit={addWorkout} machineOptions={machines} />
      )}

    </View>
  )
}
