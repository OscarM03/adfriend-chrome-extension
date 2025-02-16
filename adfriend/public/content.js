const adSelectors = [
    '.adsbygoogle',          // Google AdSense
    '[id^="div-gpt-ad"]',    // Google Ad Manager (DFP)
    '.trc_rbox',             // Taboola
    '.OUTBRAIN',             // Outbrain
    '.media_net_ad',         // Media.net
    '.amzn-ad',              // Amazon Ads
    'iframe[src*="ads"]',    // Generic iframe-based ads
    'iframe[src*="doubleclick"]', // Google DoubleClick
    'iframe[src*="adservice"]' // Google Ad service
];

const fetchData = () => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "fetchData" }, (response) => {
            if (response?.success) {
                resolve(response);
            } else {
                reject(response?.error || "Failed to fetch data");
            }
        });
    });
};



const replaceAds = async () => {
    try {
        const fetchedData = await fetchData(); 
        console.log('AdFriend: Using Fetched Data', fetchedData);

        chrome.storage.sync.get(["bgColor", "textColor", "reminders", "selectedOption"], (data) => {
            const { bgColor, textColor, reminders, selectedOption } = data;



            let selectedList;
            if (selectedOption.option === "bible") {
                selectedList = fetchedData.bibleVerses;
            } else if (selectedOption.option === "motivational") {
                selectedList = fetchedData.quotes;
            } else if (selectedOption.option === "quran") {
                selectedList = fetchedData.quranVerses;
            } else {
                selectedList = fetchedData.quotes;
            }


            document.querySelectorAll(adSelectors.join(', ')).forEach((ad, index) => {
                const adContainer = ad.getBoundingClientRect();
                const width = adContainer.width;
                const height = adContainer.height;

                const adReplacement = document.createElement('div');
                adReplacement.style.width = width + "px";
                adReplacement.style.height = height + "px";
                adReplacement.style.display = "flex";
                adReplacement.style.alignItems = "center";
                adReplacement.style.justifyContent = "center";
                adReplacement.style.color = textColor;
                adReplacement.style.textAlign = "center";
                adReplacement.style.padding = "10px";
                adReplacement.style.fontSize = "14px";
                adReplacement.style.fontWeight = "bold";
                adReplacement.style.maxWidth = "100%";
                adReplacement.style.maxHeight = "100%";
                adReplacement.style.overflow = "hidden";
                adReplacement.style.backgroundColor = bgColor;

                let currentIndex = index % selectedList.length;

                const updateContent = () => {
                    const now = new Date();
                    const currentTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

                    if (reminders && Array.isArray(reminders)) {
                        const dueReminder = reminders.find(reminder => reminder.time === currentTime);
                        if (dueReminder) {
                            adReplacement.textContent = `REMINDER: ${dueReminder.text}`;
                            setTimeout(updateContent, 30000);
                            return;
                        }
                    }


                    if (selectedList.length > 0) {
                        const item = selectedList[currentIndex];
                        adReplacement.textContent = item;
                        currentIndex = (currentIndex + 1) % selectedList.length;
                    }
                };

                updateContent();
                setInterval(updateContent, 30000);

                ad.replaceWith(adReplacement);
            });
        });
    } catch (error) {
        console.error("AdFriend: Error replacing ads", error);
    }
};

replaceAds();
console.log('AdFriend: Ads replaced');

const observer = new MutationObserver(() => {
    setTimeout(() => replaceAds(), 500);
});

observer.observe(document.body, { childList: true, subtree: true });