import "./App.css";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ToastBar, Toaster, toast } from "react-hot-toast";
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
			<Toaster>
				{(t) => (
					<ToastBar toast={t} style={{ backgroundColor: "var(--green-400)" }}>
						{({ message }) => (
							<>
								{message}
								{t.type !== "loading" && (
									<button
										type={"button"}
										className={"x-button"}
										onClick={() => toast.dismiss(t.id)}
									>
										×
									</button>
								)}
							</>
						)}
					</ToastBar>
				)}
			</Toaster>
			<div className={"background"} />

			{loadingUser ? <span className="text">Loading user…</span> : null}
			{!loadingUser && !user ? <Welcome /> : null}
			{!loadingUser && user ? <Garden user={user} /> : null}
		</main>
	);
}

export default App;
