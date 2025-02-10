import PropTypes from "prop-types";

const CustomizationPanel = ({ customizeOption, handleCustomizeChange, bgColor, textColor, handleColorChange }) => {
    return (
        <div className="mt-4 flex gap-4">
            <div className="border-2 rounded-md py-1 px-2 mt-4 border-gray-500">
                <input
                    type="radio"
                    name="customize"
                    checked={customizeOption === "colors"}
                    onChange={() => handleCustomizeChange("colors")}
                />
                <label className="ml-2 font-bold text-lg">Background and text color</label>
                <div className="flex items-center justify-center gap-4">
                    <div className="mt-4">
                        <label className="font-bold text-sm">Background Color</label>
                        <input type="color" value={bgColor} onChange={(e) => handleColorChange("bg", e.target.value)} className="ml-2" />
                    </div>
                    <div className="mt-4">
                        <label className="font-bold text-sm">Text Color</label>
                        <input type="color" value={textColor} onChange={(e) => handleColorChange("text", e.target.value)} className="ml-2" />
                    </div>
                </div>
            </div>
            <div className="border-2 rounded-md py-1 px-2 mt-4 border-gray-500">
                <input type="radio" name="customize" checked={customizeOption === "images"} onChange={() => handleCustomizeChange("images")} />
                <label className="ml-2 font-bold text-lg">Random Images</label>
                <p className="text-sm text-gray-500 font-bold">Choose random images as the background</p>
            </div>
        </div>
    );
};

CustomizationPanel.propTypes = {
    customizeOption: PropTypes.string.isRequired,
    handleCustomizeChange: PropTypes.func.isRequired,
    bgColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
    handleColorChange: PropTypes.func.isRequired
};

export default CustomizationPanel;
