import "./App.css";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Garden } from "./components/Garden.jsx";
import { auth, signInWithGoogle } from "./utils/firebase.js";

function App() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (u) => setUser(u));
		return () => unsub();
	}, []);

	return (
		<main className="app">
			<Toaster />
			{!user && (
				<button className="button" onClick={signInWithGoogle} type={"button"}>
					Login with Google
				</button>
			)}

			{user && <Garden />}
		</main>
	);
}

export default App;
