import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeamSelect from './TeamSelect';

export default function ScoreForm({ round }) {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [scores, setScores] = useState({
        originality: '',
        feasibility: '',
        problemSolutionFit: '',
        impact: '',
        technicalC: '',
        progress: '',
        uiuxD: '',
        collaborationP: '',
        functionality: '',
        scalability: '',
        uiuxP: '',
        creativity: '',
    });
    const [submittedTeams, setSubmittedTeams] = useState(new Set());

    useEffect(() => {
        // Fetch teams that this judge has already submitted for in this round
        const fetchSubmittedTeams = async () => {
            const token = localStorage.getItem('token');
            try {
                setLoading(true);
                const response = await axios.get('https://hackathon-judging-backend.vercel.app/api/scores/submitted-rounds', {
                    headers: { Authorization: token },
                });

                // Filter for just the current round and extract teamIDs
                const teamsForThisRound = response.data
                    .filter(item => item.round === round)
                    .map(item => item.teamID);

                setSubmittedTeams(new Set(teamsForThisRound));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching submitted teams:', err);
                setLoading(false);
            }
        };

        if (round) {
            fetchSubmittedTeams();
        }

        // Reset form when round changes
        setSelectedTeam(null);
        setScores({
            originality: '',
            feasibility: '',
            problemSolutionFit: '',
            impact: '',
            technicalC: '',
            progress: '',
            uiuxD: '',
            collaborationP: '',
            functionality: '',
            scalability: '',
            uiuxP: '',
            creativity: '',
        });

        setError('');
        setSuccess(false);
    }, [round]);

    // Modified validation function that only checks relevant fields per round
    const validateScores = () => {
        let relevantFields = [];
        
        if (round === 1) {
            relevantFields = ['originality', 'feasibility', 'problemSolutionFit', 'impact'];
        } else if (round === 2) {
            relevantFields = ['technicalC', 'progress', 'uiuxD', 'collaborationP'];
        } else if (round === 3) {
            relevantFields = ['functionality', 'scalability', 'uiuxP', 'creativity'];
        }
        
        // Check if all relevant fields have values
        const missingFields = relevantFields.filter(field => !scores[field]);
        if (missingFields.length > 0) {
            return 'Please enter all scores';
        }
        
        // Check if all relevant fields have valid values
        const invalidFields = relevantFields.filter(field => {
            const numScore = Number(scores[field]);
            return isNaN(numScore);
        });
        if (invalidFields.length > 0) {
            return 'All scores must be valid numbers';
        }
        
        return null;
    };

    const handleSubmit = async () => {
        if (!selectedTeam) {
            setError('Please select a team');
            return;
        }

        if (submittedTeams.has(selectedTeam)) {
            setError('You have already submitted scores for this team in this round');
            return;
        }

        const validationError = validateScores();
        if (validationError) {
            setError(validationError);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Access Denied. No token provided');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess(false);
            
            // Only send the relevant scores for the current round
            let scoreData = { teamID: selectedTeam, round };
            
            if (round === 1) {
                scoreData = {
                    ...scoreData,
                    originality: scores.originality,
                    feasibility: scores.feasibility,
                    problemSolutionFit: scores.problemSolutionFit,
                    impact: scores.impact
                };
            } else if (round === 2) {
                scoreData = {
                    ...scoreData,
                    technicalC: scores.technicalC,
                    progress: scores.progress,
                    uiuxD: scores.uiuxD,
                    collaborationP: scores.collaborationP
                };
            } else if (round === 3) {
                scoreData = {
                    ...scoreData,
                    functionality: scores.functionality,
                    scalability: scores.scalability,
                    uiuxP: scores.uiuxP,
                    creativity: scores.creativity
                };
            }

            await axios.post(
                'https://hackathon-judging-backend.vercel.app/api/scores/submit-score',
                scoreData,
                { headers: { Authorization: token } }
            );

            // Add this team to the set of submitted teams
            setSubmittedTeams(new Set([...submittedTeams, selectedTeam]));

            // Clear form
            setSelectedTeam(null);
            setScores({
                originality: '',
                feasibility: '',
                problemSolutionFit: '',
                impact: '',
                technicalC: '',
                progress: '',
                uiuxD: '',
                collaborationP: '',
                functionality: '',
                scalability: '',
                uiuxP: '',
                creativity: '',
            });

            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit scores. Please try again.');
            console.error('Error submitting scores:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4">
                <h3 className="text-xl font-bold text-white text-center">
                    Enter Scores for Round {round}
                </h3>
            </div>

            <div className="p-6">
                {loading && (
                    <div className="flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <p className="text-green-700 flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Scores submitted successfully!
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <div className="mb-6">
                    <TeamSelect
                        setSelectedTeam={setSelectedTeam}
                        submittedTeams={submittedTeams}
                        round={round}
                        selectedTeam={selectedTeam}
                    />
                </div>
                
                {round === 1 && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Originality & Innovation (0-25)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="25"
                            step="0.1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Score for Originality & Innovation"
                            value={scores.originality}
                            onChange={(e) => setScores({ ...scores, originality: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Feasibility (0-25)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="25"
                            step="0.1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Score for feasibility"
                            value={scores.feasibility}
                            onChange={(e) => setScores({ ...scores, feasibility: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Problem-Solution Fit (0-30)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="30"
                            step="0.1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Score for problem-solution fit"
                            value={scores.problemSolutionFit}
                            onChange={(e) => setScores({ ...scores, problemSolutionFit: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Impact (0-20)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Score for impact"
                            value={scores.impact}
                            onChange={(e) => setScores({ ...scores, impact: e.target.value })}
                        />
                    </div>
                </div>}

                {round === 2 && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Technical Complexity (0-30)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="30"
                            step="0.1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Score for technical Complexity"
                            value={scores.technicalC}
                            onChange={(e) => setScores({ ...scores, technicalC: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Progress (0-25)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="25"
                            step="0.1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Score for Progress"
                            value={scores.progress}
                            onChange={(e) => setScores({ ...scores, progress: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            UI/UX & Design (0-20)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Score for UI/UX & Design"
                            value={scores.uiuxD}
                            onChange={(e) => setScores({ ...scores, uiuxD: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Collaboration & Problem Solving (0-25)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="25"
                            step="0.1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Score for Collaboration & Problem Solving"
                            value={scores.collaborationP}
                            onChange={(e) => setScores({ ...scores, collaborationP: e.target.value })}
                        />
                    </div>
                </div>}

                {round === 3 && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Functionality & Execution (0-35)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="35"
                            step="0.1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Score for Functionality & Execution"
                            value={scores.functionality}
                            onChange={(e) => setScores({ ...scores, functionality: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Scalability & Future Potential (0-20)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Score for Scalability & Future Potential"
                            value={scores.scalability}
                            onChange={(e) => setScores({ ...scores, scalability: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            UI/UX & Presentation (0-15)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="15"
                            step="0.1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Score for UI/UX & Presentation"
                            value={scores.uiuxP}
                            onChange={(e) => setScores({ ...scores, uiuxP: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Creativity & Innovation (0-30)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="30"
                            step="0.1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Score for Creativity & Innovation"
                            value={scores.creativity}
                            onChange={(e) => setScores({ ...scores, creativity: e.target.value })}
                        />
                    </div>
                </div>}

                <div className="flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Scores'}
                    </button>
                </div>
            </div>
        </div>
    );
}