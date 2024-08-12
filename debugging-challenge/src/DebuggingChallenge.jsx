import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Make sure this CSS file is included in your project

const DebuggingChallenge = () => {
    const [challenge, setChallenge] = useState('');
    const [answer, setAnswer] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        const fetchNewChallenge = async () => {
            try {
                const response = await axios.post(
                    'https://api.openai.com/v1/chat/completions',
                    {
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are an assistant that generates coding challenges.'
                            },
                            {
                                role: 'user',
                                content: 'Provide a debugging challenge of the day with broken code and a hidden answer. The user has to find where the error is.'
                            }
                        ],
                        max_tokens: 300,
                        temperature: 0.7, // Optional: Controls randomness in the output
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                        },
                    }
                );

                console.log('Response:', response.data);
                const data = response.data.choices[0].message.content.split('Answer:');
                setChallenge(data[0].trim());
                setAnswer(data[1].trim());
                setShowAnswer(false);

                localStorage.setItem('challenge', data[0].trim());
                localStorage.setItem('answer', data[1].trim());
                localStorage.setItem('challengeDate', new Date().toDateString());
            } catch (error) {
                console.error('Error fetching challenge:', error);
            }
        };

        const storedDate = localStorage.getItem('challengeDate');
        if (storedDate !== new Date().toDateString()) {
            fetchNewChallenge();
        } else {
            setChallenge(localStorage.getItem('challenge'));
            setAnswer(localStorage.getItem('answer'));
        }

        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        const timeUntilMidnight = midnight.getTime() - new Date().getTime();

        const timer = setTimeout(() => {
            fetchNewChallenge();
        }, timeUntilMidnight);

        return () => clearTimeout(timer);

    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Debugging Challenge of the Day</h1>
            {challenge && (
                <div className="code-container">
                    <pre>
                        <code>{challenge}</code>
                    </pre>
                    <button onClick={() => setShowAnswer(!showAnswer)}>
                        {showAnswer ? 'Hide' : 'Show'} Answer
                    </button>
                    {showAnswer && (
                        <div className="code-container">
                            <pre>
                                <code>{answer}</code>
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DebuggingChallenge;
