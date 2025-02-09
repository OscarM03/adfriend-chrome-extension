import { useEffect, useState } from "react";
import CustomizationPanel from "./components/CustomizationPanel";
import RemindersQuotesForm from "./components/RemindersQuotesForm";

const App = () => {
    const [selectedOption, setSelectedOption] = useState("");
    const [customInput, setCustomInput] = useState("");
    const [savedQuotes, setSavedQuotes] = useState([]);
    const [savedReminders, setSavedReminders] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [customizeOption, setCustomizeOption] = useState("colors");
    const [bgColor, setBgColor] = useState("#000000");
    const [textColor, setTextColor] = useState("#ffffff");

    const options = [
        { label: "Motivational Quote", value: "motivational", description: "Get a motivational quote to help you move on with your day." },
        { label: "Bible Verses", value: "bible", description: "Get a bible verse to help brighten your day." },
        { label: "Quran Verses", value: "quran", description: "Get a quran verse to help brighten your day." },
        { label: "Set Reminders", value: "reminders", description: "Set your reminders to help you get through the day." },
        { label: "Set Quotes", value: "quotes", description: "Set your own quotes to help you get through the day." },
    ];

    useEffect(() => {
        chrome.storage.sync.get(["selectedOption", "savedQuotes", "savedReminders", "bgColor", "textColor"], (result) => {
            if (result.selectedOption) {
                setSelectedOption(result.selectedOption.option);
                setCustomizeOption(result.selectedOption.customize);
            }
            if (result.savedQuotes) setSavedQuotes(result.savedQuotes);
            if (result.savedReminders) setSavedReminders(result.savedReminders);
            if (result.bgColor) setBgColor(result.bgColor);
            if (result.textColor) setTextColor(result.textColor);
        });
    }, []);



    const handleOptionChange = (value) => {
        setSelectedOption(value);
        setCustomInput("");

        chrome.storage.sync.set({
            selectedOption: {
                option: value,
                customize: customizeOption
            }
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

    const handleColorChange = (type, color) => {
        if (type === "bg") {
            setBgColor(color);
            chrome.storage.sync.set({
                bgColor: color
            });
        } else {
            setTextColor(color);
            chrome.storage.sync.set({
                textColor: color
            });
        }
    }

    const handleCustomizeChange = (value) => {
        setCustomizeOption(value);
        chrome.storage.sync.get(["selectedOption"], (result) => {
            if (result.selectedOption) {
                chrome.storage.sync.set({
                    selectedOption: {
                        ...result.selectedOption,
                        customize: value
                    }
                })
            }
        })
    }

    return (
        <section>
            <header className="py-2 mx-8">
                <h1 className="text-2xl font-bold">AdFriend</h1>
            </header>
            <div className="h-auto flex justify-center items-center mx-8 py-10">
                <div>
                    <h2 className="text-2xl font-bold">Choose the option you want to replace Ads and Colors</h2>
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

                            {(selectedOption !== null) && selectedOption === option.value ? (
                                <CustomizationPanel customizeOption={customizeOption} handleCustomizeChange={handleCustomizeChange} bgColor={bgColor} textColor={textColor} handleColorChange={handleColorChange} />
                            ) : null}

                            {(selectedOption === "reminders" && option.value === "reminders") ||
                                (selectedOption === "quotes" && option.value === "quotes") ? (
                                <RemindersQuotesForm selectedOption={selectedOption} customInput={customInput} setCustomInput={setCustomInput} savedItems={selectedOption === "quotes" ? savedQuotes : savedReminders} handleSave={handleSaveInputs} handleEdit={handleEdit} handleDelete={handleDelete} />
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
}

export default App;
