import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TeamSelect({ setSelectedTeam, submittedTeams = new Set(), round }) {
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedTeams, setSelectedTeams] = useState('');


    useEffect(() => {
        const fetchTeams = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Access Denied. No token provided');
                return;
            }
            
            try {
                setLoading(true);
                const response = await axios.get('https://hackathon-judging-backend.vercel.app/api/teams', {
                    headers: { Authorization: token },
                });
                setTeams(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch teams');
                setLoading(false);
            }
        };
        
        fetchTeams();
    }, []);

    const handleTeamChange = (e) => {
        setSelectedTeam(e.target.value);
        setSelectedTeams(e.target.value);
    };

    if (loading) {
        return (
            <div className="flex items-center space-x-2 text-gray-500 py-2">
                <div className="w-5 h-5 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                <span>Loading teams...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
                <p className="text-red-700">{error}</p>
            </div>
        );
    }

    const remainingTeamsCount = teams.length - submittedTeams.size;

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Team
            </label>
            <select 
                onChange={handleTeamChange} 
                value={selectedTeams ||''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
                <option value="">-- Select a team --</option>
                {teams.map((team) => (
                    <option 
                        key={team.teamID} 
                        value={team.teamID}
                        disabled={submittedTeams.has(team.teamID)}
                        className={submittedTeams.has(team.teamID) ? "text-gray-400" : ""}
                    >
                        {team.teamName} {submittedTeams.has(team.teamID) ? '(Already scored)' : ''}
                    </option>
                ))}
            </select>
            
            {submittedTeams.size > 0 && remainingTeamsCount > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-indigo-600">{remainingTeamsCount}</span> teams remaining to be scored for Round {round}
                </p>
            )}
            
            {submittedTeams.size > 0 && remainingTeamsCount === 0 && (
                <p className="mt-2 text-sm text-green-600 font-medium">
                    You've scored all teams for this round! 🎉
                </p>
            )}
        </div>
    );
}