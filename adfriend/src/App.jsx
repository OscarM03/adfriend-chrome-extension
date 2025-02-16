import { useEffect, useState } from "react";
import CustomizationPanel from "./components/CustomizationPanel";
import RemindersContainer from "./components/RemindersContainer";
// import QuotesContainer from "./components/QuotesContainer";

const App = () => {
    const [selectedOption, setSelectedOption] = useState();
    const [customizeOption, setCustomizeOption] = useState("colors");
    const [bgColor, setBgColor] = useState("#000000");
    const [textColor, setTextColor] = useState("#ffffff");

    const options = [
        { label: "Motivational Quote", value: "motivational", description: "Get a motivational quote to help you move on with your day." },
        { label: "Bible Verses", value: "bible", description: "Get a bible verse to help brighten your day." },
        { label: "Quran Verses", value: "quran", description: "Get a quran verse to help brighten your day." },
    ];

    useEffect(() => {
        chrome.storage.sync.get(["selectedOption", "savedQuotes", "bgColor", "textColor"], (result) => {
            if (result.selectedOption?.option) {
                setSelectedOption(result.selectedOption.option);
            }
            if (result.selectedOption?.customize) {
                setCustomizeOption(result.selectedOption.customize);
            }
            if (result.bgColor) setBgColor(result.bgColor);
            if (result.textColor) setTextColor(result.textColor);
        });
    }, []);



    const handleOptionChange = (value) => {
        // setSelectedOption((prev) => {
        //     let updatedOptions;

        //     if (prev.includes(value)) {
        //         updatedOptions = prev.filter((option) => option !== value);
        //     } else if (prev.length < 2) {
        //         updatedOptions = [...prev, value];
        //     } else {
        //         return prev;
        //     }
            // }
            setSelectedOption(value);

            chrome.storage.sync.set({
                selectedOption: {
                    option: value,
                    customize: customizeOption
                }
            });

        //     return updatedOptions;
        // });
    };


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
        chrome.storage.sync.set({
            selectedOption: {
                option: selectedOption,
                customize: value
            }
        });
    };


    return (
        <section>
            <header className="py-2 mx-8">
                <h1 className="text-2xl font-bold">AdFriend</h1>
            </header>
            <div className="h-auto flex justify-center items-center mx-8 py-10">
                <div>
                    <h2 className="text-2xl font-bold">Choose the option you want to replace Ads and Colors</h2>
                    <CustomizationPanel bgColor={bgColor} textColor={textColor} handleColorChange={handleColorChange} customizeOption={customizeOption} handleCustomizeChange={handleCustomizeChange} />
                    {options.map((option) => (
                        <div key={option.value} className="border-2 rounded-md py-1 px-2 mt-6">
                            <input
                                type="radio"
                                checked={selectedOption === option.value}
                                onChange={() => handleOptionChange(option.value)}
                            />
                            <label className="ml-2 font-bold text-xl">{option.label}</label>
                            <p className="text-sm text-gray-500 font-bold">{option.description}</p>
                        </div>
                    ))}
                    {/* <QuotesContainer
                        selectedOption={selectedOption}
                        handleOptionChange={handleOptionChange}
                    /> */}

                    <RemindersContainer />
                </div>
            </div >
        </section >
    );
}

export default App;
