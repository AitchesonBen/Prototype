import React, { useState } from 'react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timesOfDay = ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

const Main = () => {
    const [activities, setActivities] = useState([]); // List of all activities
    const [timetable, setTimetable] = useState({}); // Stores selected activities for each cell
    const [showActivitySelector, setShowActivitySelector] = useState(null); // Track which cell to assign activity
    const [newActivity, setNewActivity] = useState({ name: '', hours: '' });

    // Handle input changes for creating new activities
    const handleActivityChange = (e) => {
        const { name, value } = e.target;
        setNewActivity((prev) => ({ ...prev, [name]: value }));
    };

    // Save new activity to activities list
    const handleAddActivity = (e) => {
        e.preventDefault();
        setActivities((prev) => [...prev, newActivity]);
        setNewActivity({ name: '', hours: '' }); // Reset input fields
    };

    // Open activity selector for a specific cell
    const handleSelectActivity = (day, time) => {
        setShowActivitySelector({ day, time });
    };

    // Assign selected activity to the timetable cell
    const handleAssignActivity = (activity) => {
        const { day, time } = showActivitySelector;
        setTimetable((prev) => ({
            ...prev,
            [`${day}-${time}`]: activity.name,
        }));
        setShowActivitySelector(null); // Close activity selector
    };

    const getAssignedActivity = (day, time) => timetable[`${day}-${time}`] || 'Select Activity';

    return (
        <div className="timetable-container">
            <h1>Create Activity</h1>
            <form onSubmit={handleAddActivity} className="activity-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Activity Name"
                    value={newActivity.name}
                    onChange={handleActivityChange}
                    required
                />
                <input
                    type="number"
                    name="hours"
                    placeholder="Hours"
                    value={newActivity.hours}
                    onChange={handleActivityChange}
                    step="0.5"
                    min="0"
                    required
                />
                <button type="submit">Add Activity</button>
            </form>

            <h2>Weekly Timetable</h2>
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
                            <td className="time-column">{time}</td>
                            {daysOfWeek.map((day) => (
                                <td key={`${day}-${time}`}>
                                    <button
                                        onClick={() => handleSelectActivity(day, time)}
                                        className="select-button"
                                    >
                                        {getAssignedActivity(day, time)}
                                    </button>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Activity Selector Popup */}
            {showActivitySelector && (
                <div className="activity-selector">
                    <h3>Select an Activity</h3>
                    <ul>
                        {activities.map((activity, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => handleAssignActivity(activity)}
                                >
                                    {activity.name} ({activity.hours} hrs)
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setShowActivitySelector(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Main;
