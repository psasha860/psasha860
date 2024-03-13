import React, { useState } from "react";
import axios from "axios";

const App = () => {
    const [concurrency, setConcurrency] = useState(10);
    const [requestsPerSecond, setRequestsPerSecond] = useState(10);
    const [responseList, setResponseList] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const startRequests = async () => {
        setIsButtonDisabled(true);

        const currentIndexList = [];

        for (let i = 1; i <= 1000; i++) {
            const currentIndex = i;
            currentIndexList.push(currentIndex);

            if (i % concurrency === 0) {
                await new Promise(resolve => setTimeout(resolve, 4000 / requestsPerSecond));
            }

            axios.post("http://localhost:3012/api", { index: currentIndex })
                .then(response => {
                    setResponseList(prevList => [...prevList, response.data]);
                })
                .catch(error => {
                    console.error(`Помилка для запиту ${currentIndex}:`, error);
                });
        }

        setIsButtonDisabled(false);
    };

    return (
        <div>
            <label>
                Ліміт паралельних запитів:
                <input
                    type="number"
                    value={concurrency}
                    onChange={(e) => setConcurrency(Math.min(100, Math.max(0, e.target.value)))}
                />
            </label>
            <label>
                Кількість запитів на секунду:
                <input
                    type="number"
                    value={requestsPerSecond}
                    onChange={(e) => setRequestsPerSecond(Math.min(100, Math.max(0, e.target.value)))}
                />
            </label>
            <button
                disabled={isButtonDisabled}
                onClick={startRequests}
            >
                Старт
            </button>

            <ul>
                {responseList.map((index, i) => (
                    <li key={i}>{`Запит ${index} виконано`}</li>
                ))}
            </ul>
        </div>
    );
};

export default App;
