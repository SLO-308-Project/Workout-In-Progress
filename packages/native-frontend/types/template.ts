export interface Template
{
    _id: string;
    // name: string,
    machineIds: string[];
    workout: [
        {
            _id: string;
            machineId: string;
            sets: [
                {
                    _id: string;
                    attributeValues: string;
                },
            ];
        },
    ];
    //  Template
    //      _id
    //      name:
    //      machines:
    //          machine[]
    //      workouts:
    //          workout[]
}
