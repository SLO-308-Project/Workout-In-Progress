import { fetchGetMachine, fetchDeleteMachine, fetchPostMachine, fetchUpdateMachine } from '../services/machineServices'

function getMachine(name: string | undefined, muscle: string | undefined) {
    fetchGetMachine(name, muscle)
    .then((res) => {

    });
}
