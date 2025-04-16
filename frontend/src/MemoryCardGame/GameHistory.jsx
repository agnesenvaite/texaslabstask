import axios from 'axios';
import {useEffect, useState} from 'react';
import './GameHistory.css'
import {useNavigate} from 'react-router-dom';

export const GameHistory = () => {
	const [historyData, setHistoryData] = useState(null);
	const [error, setError] = useState(null);
	const navigate = useNavigate()
	const [page, setPage] = useState(1);
	const [perPage] = useState(20);
	const [totalPages, setTotalPages] = useState(0);

	const handleBackClick = () => {
		navigate(-1);
	};

	useEffect(() => {
		const userID = localStorage.getItem("userID");
		if (!userID) {
			console.error("Error: userID is missing.");
			setError("User ID is missing");
			return;
		}

		const fetchHistoryData = async () => {
			try {
				const response = await axios.get("http://localhost:5000/api/memory/save", {
					headers: { "Content-Type": "application/json" },
					params: { userID, page, perPage }, // ✅ axios uses `params` for query strings
				})
				console.log("Game history retrieved successfully", response.data);
				setHistoryData(response.data.data);
				setTotalPages(Math.ceil(response.data.total / perPage));
				setError(null)
			} catch (err) {
				console.error("Error fetching game data:", err.response?.data || err.message);
				setError(err.response?.data || err.message);
			}
		};

		fetchHistoryData();
	}, [page, perPage]);

	if (error) return <div>Error: {error}</div>;
	if (!historyData) return <div>Loading...</div>;


	return (
		<div>
			<h2>Game History</h2>
		<div className="game">
			{historyData.length === 0 ? (<div>User haven&#39;t played any games</div>): (
			<table cellPadding="10" cellSpacing="0">
				<thead>
				<tr>
					<th>#</th>
					<th>Game Date</th>
					<th>Difficulty</th>
					<th>Failed</th>
					<th>Completed</th>
					<th>Time Taken (s)</th>
				</tr>
				</thead>
				<tbody>
				{historyData.map((game, index) => (
					<tr key={game._id || index}>
						<td>{page > 1 ? index + 1 + ((page - 1) *perPage) : index + 1}</td>
						<td>{new Date(game.gameDate).toLocaleString()}</td>
						<td>{game.difficulty}</td>
						<td>{game.failed}</td>
						<td>{game.completed}</td>
						<td>{game.timeTaken}</td>
					</tr>
				))}
				</tbody>
			</table>
				)}
		</div>
			<div className="buttons">
				{totalPages > 1 && (
					<div>
						<button
							onClick={() => setPage((p) => Math.max(p - 1, 1))}
							disabled={page === 1}
						>
							Previous
						</button>
						<span> Page {page} of {totalPages} </span>
						<button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
							Next
						</button>
					</div>
				)}
			</div>
			<div className="back-button">
				<button onClick={handleBackClick}>
					Back
				</button>
			</div>
		</div>
	);
}
