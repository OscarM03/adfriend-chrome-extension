import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const RemindersContainer = ({ selectedOption, handleOptionChange }) => {

    const [editingIndex, setEditingIndex] = useState(null);
    const [reminders, setReminders] = useState([]);
    const [customInput, setCustomInput] = useState("");
    const [customTime, setCustomTime] = useState("");

    useEffect(() => {
        chrome.storage.sync.get(["reminders"], (result) => {
            setReminders(result.reminders || []);
        });
    }, []);

    const handleSaveReminder = () => {
        if (!customInput.trim() || !customTime.trim()) return;

        setReminders((prevReminders) => {
            const reminderObject = { text: customInput, time: customTime };

            const updatedReminders = editingIndex !== null
                ? prevReminders.map((r, i) => (i === editingIndex ? reminderObject : r))
                : [...prevReminders, reminderObject];

            chrome.storage.sync.set({ reminders: updatedReminders });
            return updatedReminders;
        });

        setCustomInput("");
        setCustomTime("");
        setEditingIndex(null);

    };

    const handleDelete = (index) => {
        const updatedList = reminders.filter((_, i) => i !== index);
        setReminders(updatedList);
        chrome.storage.sync.set({ reminders: updatedList });
    };

    const handleEdit = (index) => {
        setCustomInput(reminders[index].text);
        setCustomTime(reminders[index].time);

        setEditingIndex(index);
    }

    return (
        <div className="border-2 rounded-md py-1 px-2 mt-6">
            <input
                type="checkbox"
                checked={selectedOption.includes("reminders")}
                onChange={() => handleOptionChange("reminders")}
            />
            <label className="ml-2 font-bold text-xl">Set Reminders</label>
            <p className="text-sm text-gray-500 font-bold">Set your reminders to help you get through the day</p>

            {selectedOption.includes("reminders") && (
                <div className="mt-4">
                    <input
                        type="text"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Enter your reminder"
                        className="border-2 rounded-md px-2 py-1 w-full mt-2"
                    />
                    <input
                        type="time"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="border-2 rounded-md px-2 py-1 w-full mt-2"
                    />
                    <button className="mt-2 border px-4 py-1 rounded-md bg-black text-white font-bold" onClick={handleSaveReminder}>
                        Save
                    </button>

                    <ul>
                        {reminders.map((item, index) => (
                            <li key={index} className="rounded-md py-1 px-2 mt-1 flex justify-between items-center group">
                                <span className="text-gray-500 font-medium text-sm">
                                    {`${item.text} - ${item.time}`}
                                </span>
                                <div className="hidden group-hover:flex">
                                    <button className="border px-2 py-1 rounded-md bg-blue-500 text-white font-bold" onClick={() => handleEdit(index)}>
                                        Edit
                                    </button>
                                    <button className="border px-2 py-1 rounded-md bg-red-500 text-white font-bold ml-2" onClick={() => handleDelete(index)}>
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

RemindersContainer.propTypes = {
    selectedOption: PropTypes.string.isRequired,
    customInput: PropTypes.string.isRequired,
    setCustomInput: PropTypes.func.isRequired,
    customTime: PropTypes.string.isRequired,
    setCustomTime: PropTypes.func.isRequired,
    savedReminders: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string.isRequired,
            time: PropTypes.string.isRequired
        })
    ).isRequired,

    handleSaveInputs: PropTypes.func.isRequired,
    handleOptionChange: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired
};

export default RemindersContainer
