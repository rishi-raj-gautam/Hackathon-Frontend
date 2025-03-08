import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Leaderboard() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://hackathon-judging-backend.vercel.app/api/scores/leaderboard');
                setTeams(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
                setError('Failed to load leaderboard data');
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <button 
                    className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4">
                <h2 className="text-2xl font-bold text-white text-center">🏆 Hackathon Leaderboard 🏆</h2>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {teams.length > 0 ? (
                            teams.map((team, index) => (
                                <tr key={team.teamID} className={index < 3 ? "bg-amber-50" : ""}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {index === 0 && <span className="text-2xl mr-2">🥇</span>}
                                            {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                                            {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                                            <span className={`font-semibold ${index < 3 ? "text-amber-700" : "text-gray-900"}`}>
                                                {index + 1}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{team.teamName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">{team.totalScore || 0}</div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                    No scores available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}