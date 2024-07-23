import { EventTask } from "../styling/components";


// --- EVENTS { id, user_id, name, description, start_time, end_time, status }
export const testEvents: EventTask[] = [
    {
        id: 1,
        user_id: 1,
        name: "Event 1",
        description: "Description 1",
        start_time: "07-24-2024",
        end_time: "07-24-2024",
        status: "status 1"
    },
    {
        id: 2,
        user_id: 1,
        name: "Event 2",
        description: "Description 2",
        start_time: "07-24-2024",
        end_time: "07-24-2024",
        status: "status 2"
    },
    {
        id: 3,
        user_id: 1,
        name: "Event 3",
        description: "Description 3",
        start_time: "07-24-2024",
        end_time: "07-24-2024",
        status: "status 3"
    },
    {
        id: 4,
        user_id: 1,
        name: "Event 4",
        description: "Description 4",
        start_time: "07-24-2024",
        end_time: "07-24-2024",
        status: "status 4"
    },
    {
        id: 5,
        user_id: 1,
        name: "Event 5",
        description: "Description 5",
        start_time: "07-24-2024",
        end_time: "07-24-2024",
        status: "status 5"
    }
];

/* --- SQL:

INSERT INTO "Events" (user_id, name, description, start_time, end_time, status)
VALUES
    (1, 'Event 1', 'Description 1', '2024-07-24', '2024-07-24', 'status 1'),
    (1, 'Event 2', 'Description 2', '2024-07-24', '2024-07-24', 'status 2'),
    (1, 'Event 3', 'Description 3', '2024-07-24', '2024-07-24', 'status 3'),
    (1, 'Event 4', 'Description 4', '2024-07-24', '2024-07-24', 'status 4'),
    (1, 'Event 5', 'Description 5', '2024-07-24', '2024-07-24', 'status 5');

*/

