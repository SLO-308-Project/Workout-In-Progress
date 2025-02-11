import machineServices from "./machineServices2";

test("Test adding a machine", () =>
    {
        let target = false;
        machineServices.addMachine(
            {
                name: "bench press",
                muscle: "arms"
            }
        )
        .then(() => 
            {
                target = true;
                expect(true).toBe(target);
            })
        .catch(() => 
            {
                target = false;
                expect(true).toBe(target);
            }
        );
    });

test("Test getting a machine", () =>
    {
        const machine = machineServices.getMachines("bench press","arms");

        expect(machine).toBe(
            {
                name: "bench press", 
                muscle: "arms"
            }
        );
    });