import { useEffect, useState } from "react";

function App() {
    const [selectedOption, setSelectedOption] = useState("");
    const [customInput, setCustomInput] = useState("");
    const [savedQuotes, setSavedQuotes] = useState([]);
    const [savedReminders, setSavedReminders] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    const options = [
        { label: "Motivational Quote", value: "motivational", description: "Get a motivational quote to help you move on with your day." },
        { label: "Bible Verses", value: "bible", description: "Get a bible verse to help brighten your day." },
        { label: "Quran Verses", value: "quran", description: "Get a quran verse to help brighten your day." },
        { label: "Set Reminders", value: "reminders", description: "Set your reminders to help you get through the day." },
        { label: "Set Quotes", value: "quotes", description: "Set your own quotes to help you get through the day." },
    ];

    useEffect(() => {
        chrome.storage.sync.get(["selectedOption", "savedQuotes", "savedReminders"], (result) => {
            if (result.selectedOption) setSelectedOption(result.selectedOption);
            if (result.savedQuotes) setSavedQuotes(result.savedQuotes);
            if (result.savedReminders) setSavedReminders(result.savedReminders);
        });
    }, []);



    const handleOptionChange = (value) => {
        setSelectedOption(value);
        setCustomInput("");

        chrome.storage.sync.set({
            selectedOption: value
        });
    };

    const handleSaveInputs = () => {
        if (!customInput.trim()) {
            return;
        }

        let updatedList;
        if (selectedOption === "quotes") {
            updatedList = editingIndex !== null ? [...savedQuotes] : [...savedQuotes, customInput];
            if (editingIndex !== null) {
                updatedList[editingIndex] = customInput;
            }
            setSavedQuotes(updatedList);
            chrome.storage.sync.set({
                savedQuotes: updatedList
            });
        } else if (selectedOption === "reminders") {
            updatedList = editingIndex !== null ? [...savedReminders] : [...savedReminders, customInput];
            if (editingIndex !== null) {
                updatedList[editingIndex] = customInput;
            }
            setSavedReminders(updatedList);
            chrome.storage.sync.set({
                savedReminders: updatedList
            })
        }

        setCustomInput("");
        setEditingIndex(null);
    };

    const handleDelete = (index) => {
        if (selectedOption === "quotes") {
            const updatedList = savedQuotes.filter((_, i) => i !== index);
            setSavedQuotes(updatedList);
            chrome.storage.sync.set({
                savedQuotes: updatedList
            });
        }
        if (selectedOption === "reminders") {
            const updatedList = savedReminders.filter((_, i) => i !== index);
            setSavedReminders(updatedList);
            chrome.storage.sync.set({
                savedReminders: updatedList
            });
        }
    };

    const handleEdit = (index) => {
        setCustomInput(selectedOption === "quotes" ? savedQuotes[index] : savedReminders[index]);
        setEditingIndex(index);
    }

    return (
        <section>
            <header className="py-2 mx-8">
                <h1 className="text-2xl font-bold">AdFriend</h1>
            </header>
            <div className="h-screen flex justify-center items-center mx-8 pt-10">
                <div>
                    <h2 className="text-2xl font-bold">Choose the option you want to replace Ads</h2>
                    {options.map((option) => (
                        <div key={option.value} className="border-2 rounded-md py-1 px-2 mt-6">
                            <input
                                type="radio"
                                name="options"
                                checked={selectedOption === option.value}
                                onChange={() => handleOptionChange(option.value)}
                            />
                            <label className="ml-2 font-bold text-xl">{option.label}</label>
                            <p className="text-sm text-gray-500 font-bold">{option.description}</p>

                            {(selectedOption === "reminders" && option.value === "reminders") ||
                                (selectedOption === "quotes" && option.value === "quotes") ? (
                                <div>
                                    <input
                                        type="text"
                                        value={customInput}
                                        onChange={(e) => setCustomInput(e.target.value)}
                                        placeholder={option.value === "reminders" ? "Enter your reminder" : "Enter your quote"}
                                        className="border-2 rounded-md px-2 py-1 w-full mt-2"
                                    />
                                    <button className="mt-2 border px-4 py-1 rounded-md bg-black text-white font-bold"
                                        onClick={handleSaveInputs}
                                    >
                                        {editingIndex !== null ? "Update" : "Save"}
                                    </button>

                                    <ul className="">
                                        {(selectedOption === "quotes" ? savedQuotes : savedReminders).map((input, index) => (
                                            <li key={index} className="rounded-md py-1 px-2 mt-1 flex justify-between items-center group ">
                                                <span className="text-gray-500 font-medium">{input}</span>
                                                <div className="hidden group-hover:flex">
                                                    <button className="border px-2 py-1 rounded-md bg-blue-500 text-white font-bold"
                                                        onClick={() => handleEdit(index)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button className="border px-2 py-1 rounded-md bg-red-500 text-white font-bold ml-2"
                                                        onClick={() => handleDelete(index)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                        </div>

                    ))}
                </div>
            </div>
        </section>
    );
}

export default App;
