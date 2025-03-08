import React, { useState } from 'react';
import ScoreForm from './ScoreForm';
import Leaderboard from './Leaderboard';

export default function Dashboard() {
    const [round, setRound] = useState(null);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
                <h1 className="text-3xl font-bold text-indigo-800 mb-6 text-center">Welcome Judge</h1>
                
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Select Round</h2>
                    <div className="flex flex-wrap gap-3 justify-center mb-4">
                        {[1, 2, 3, 4].map(num => (
                            <button 
                                key={num} 
                                onClick={() => {
                                    setRound(num);
                                    setShowLeaderboard(false);
                                }}
                                className={`px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
                                    round === num 
                                        ? 'bg-indigo-700 shadow-md transform scale-105' 
                                        : 'bg-indigo-500 hover:bg-indigo-600 hover:shadow-md'
                                }`}
                            >
                                Round {num}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex justify-center">
                        <button 
                            onClick={() => {
                                setShowLeaderboard(true);
                                setRound(null);
                            }}
                            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                                showLeaderboard 
                                    ? 'bg-amber-500 text-white shadow-md transform scale-105' 
                                    : 'bg-amber-400 text-white hover:bg-amber-500 hover:shadow-md'
                            }`}
                        >
                            🏆 View Leaderboard
                        </button>
                    </div>
                </div>
                
                <div className="mt-6">
                    {round && <ScoreForm round={round} />}
                    {showLeaderboard && <Leaderboard />}
                </div>
            </div>
        </div>
    );
}