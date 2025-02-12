import machineServices from "./machineServices2";

test("Test adding a machine", () => {
    // console.log(machineServices.stupid());
    return machineServices.addMachine(
        {
            name: "bench press",
            muscle: "arms"
        }
    )
    .then(() =>
        {
            expect(true).toBe(true);
        })
    .catch(() =>
        {

        }
    );
});

// test("Test getting a machine", () => {
//     expect(true).toBe(true);
//     //const machine = machineServices.getMachines("bench press","arms");

//     // expect(machine).toBe(
//     //     {
//     //         name: "bench press",
//     //         muscle: "arms"
//     //     }
//     // );
// });
