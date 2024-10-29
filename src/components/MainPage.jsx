import { useState } from "react";
import { format, addWeeks, startOfWeek, endOfWeek } from "date-fns";
import timetableData from "../data/timetableData.json"

const Main = () => {
    const [activity, setActivity] = useState({ name: '', hours: '' });
    const [listActivity, setListActivity] = useState([]);
    const [showActivity, setShowActivity] = useState(null);
    const [timetable, setTimetable] = useState(timetableData);
    const [currentWeek, setCurrentWeek] = useState(new Date());

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timesOfDay = ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const end = endOfWeek(currentWeek, { weekStartsOn: 1 });
    const weekKey = format(start, "yyyy-MM-dd");

    const handleActivityChange = (e) => {
        const { name, value } = e.target;
        setActivity((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddActivity = (e) => {
        e.preventDefault();
        setListActivity((prev) => [...prev, activity]);
        setActivity({ name: '', hours: '' });
    };

    const handleSelectActivity = (day, time) => {
        setShowActivity({ day, time });
    };

    const handleAssignActivity = (activity) => {
        const { day, time } = showActivity;
        setTimetable((prev) => ({
            ...prev,
            [weekKey]: {
                ...prev[weekKey],
                [`${day}-${time}`]: activity.name,
            }
        }));
        setShowActivity(null);
    };

    const getAssignedActivity = (day, time) => timetable[weekKey]?.[`${day}-${time}`] || 'Select Activity';

    const handleWeekChange = (direction) => {
        setCurrentWeek((prev) => addWeeks(prev, direction));
    }

    return (
        <div className="activity-form">
            <h1>Create an activity</h1>
            <form onSubmit={handleAddActivity}>
                <label className="activity-label">Name of Activity</label>
                <input type="text" name="name" placeholder="Activity Name" value={activity.name} onChange={handleActivityChange} className="activity-input" required />
                <label className="activity-label">Length (hours)</label>
                <input type="number" name="time" placeholder="Hours" onChange={handleActivityChange} className="activity-input" min="0" step="0.5" required />
                <button type="submit">Add Activity</button>
            </form>

            <h1>Timetable</h1>
            <div>
                <button onClick={() => handleWeekChange(-1)}>Previous Week</button>
                <span>
                    {format(start, "dd MMM")} - {format(end, "dd MMM yyyy")}
                </span>
                <button onClick={() => handleWeekChange(1)}>Next Week</button>
            </div>
            <table className="timetable">
                <thead>
                    <tr>
                        <th>Time/Day</th>
                        {daysOfWeek.map((day) => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {timesOfDay.map((time) => (
                        <tr key={time}>
                            <td>{time}</td>
                            {daysOfWeek.map((day) => (
                                <td key={`${day}-${time}`}>
                                    <button onClick={() => handleSelectActivity(day, time)}>
                                        {getAssignedActivity(day, time)}
                                    </button>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {showActivity && (
                <div className="activity-selector">
                    <h2>Select Activity</h2>
                    <ul>
                        {listActivity.map((activity, i) => (
                            <li key={i}>
                                <button onClick={() => handleAssignActivity(activity)}>
                                    {activity.name} ({activity.hours} hrs)
                                </button>
                                <label>Recurring?</label>
                                <input type="checkbox"/>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setShowActivity(null)}>Cancel</button>
                </div>
            )}
        </div>
    )
};

export default Main;