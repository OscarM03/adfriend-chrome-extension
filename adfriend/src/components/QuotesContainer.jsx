import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const QuotesContainer = ({ selectedOption, handleOptionChange }) => {
    const [editingIndex, setEditingIndex] = useState(null);
    const [quotes, setQuotes] = useState([]);
    const [customQuote, setCustomQuote] = useState("");

    useEffect(() => {
        chrome.storage.sync.get(["quotes"], (result) => {
            setQuotes(result.quotes || []);
        });
    }, []);

    const handleSaveQuote = () => {
        if (!customQuote.trim()) return;

        setQuotes((prevQuotes) => {
            const updatedQuotes = editingIndex !== null
                ? prevQuotes.map((q, i) => (i === editingIndex ? customQuote : q))
                : [...prevQuotes, customQuote];

            chrome.storage.sync.set({ quotes: updatedQuotes });
            return updatedQuotes;
        });

        setCustomQuote("");
        setEditingIndex(null);
    };

    const handleDelete = (index) => {
        const updatedQuotes = quotes.filter((_, i) => i !== index);
        setQuotes(updatedQuotes);
        chrome.storage.sync.set({ quotes: updatedQuotes });
    };

    const handleEdit = (index) => {
        setCustomQuote(quotes[index]);
        setEditingIndex(index);
    };

    return (
        <div className="border-2 rounded-md py-1 px-2 mt-6">
            <input
                type="checkbox"
                checked={selectedOption.includes("quotes")}
                onChange={() => handleOptionChange("quotes")}
            />
            <label className="ml-2 font-bold text-xl">Set Quotes</label>
            <p className="text-sm text-gray-500 font-bold">
                Store your favorite quotes to keep you inspired
            </p>

            {selectedOption.includes("quotes") && (
                <div className="mt-4">
                    <input
                        type="text"
                        value={customQuote}
                        onChange={(e) => setCustomQuote(e.target.value)}
                        placeholder="Enter a quote"
                        className="border-2 rounded-md px-2 py-1 w-full mt-2"
                    />
                    <button
                        className="mt-2 border px-4 py-1 rounded-md bg-black text-white font-bold"
                        onClick={handleSaveQuote}
                    >
                        Save
                    </button>

                    <ul>
                        {quotes.map((quote, index) => (
                            <li key={index} className="rounded-md py-1 px-2 mt-1 flex justify-between items-center group">
                                <span className="text-gray-500 font-medium text-sm">
                                    {quote}
                                </span>
                                <div className="hidden group-hover:flex">
                                    <button
                                        className="border px-2 py-1 rounded-md bg-blue-500 text-white font-bold"
                                        onClick={() => handleEdit(index)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="border px-2 py-1 rounded-md bg-red-500 text-white font-bold ml-2"
                                        onClick={() => handleDelete(index)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

QuotesContainer.propTypes = {
    selectedOption: PropTypes.string.isRequired,
    handleOptionChange: PropTypes.func.isRequired,
};

export default QuotesContainer;
