import "./App.css";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Garden } from "./components/Garden.jsx";
import { Welcome } from "./components/Welcome.jsx";
import { auth } from "./utils/firebase.js";

function App() {
	const [user, setUser] = useState(null);
	const [loadingUser, setLoadingUser] = useState(true);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (u) => {
			setUser(u);
			setLoadingUser(false);
		});
		return () => unsub();
	}, []);

	return (
		<main className="app">
			<Toaster />

			{loadingUser && <span className="text">Loading user…</span>}

			{!loadingUser && !user && <Welcome />}

			{!loadingUser && user && <Garden user={user} />}
		</main>
	);
}

export default App;
