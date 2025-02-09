import PropTypes from "prop-types";

const RemindersQuotesForm = ({ selectedOption, customInput, setCustomInput, savedItems, handleSave, handleEdit, handleDelete }) => {
    return (
        <div className="mt-4">
            <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={selectedOption === "reminders" ? "Enter your reminder" : "Enter your quote"}
                className="border-2 rounded-md px-2 py-1 w-full mt-2"
            />
            <button className="mt-2 border px-4 py-1 rounded-md bg-black text-white font-bold" onClick={handleSave}>
                Save
            </button>

            <ul>
                {savedItems.map((item, index) => (
                    <li key={index} className="rounded-md py-1 px-2 mt-1 flex justify-between items-center group">
                        <span className="text-gray-500 font-medium">{item}</span>
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
    );
};

RemindersQuotesForm.propTypes = {
    selectedOption: PropTypes.string.isRequired,
    customInput: PropTypes.string.isRequired,
    setCustomInput: PropTypes.func.isRequired,
    savedItems: PropTypes.array.isRequired,
    handleSave: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired
};

export default RemindersQuotesForm;
