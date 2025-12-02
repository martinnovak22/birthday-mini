import "./App.css";
import { lazy, Suspense, useEffect, useState } from "react";
import { Loading } from "./components/Loading.jsx";
import { SoundProvider } from "./contexts/SoundContext.jsx";
import { ToastProvider } from "./components/Toast.jsx";

const Garden = lazy(() =>
	import("./components/Garden.jsx").then((module) => ({
		default: module.Garden,
	})),
);
const Welcome = lazy(() =>
	import("./components/Welcome.jsx").then((module) => ({
		default: module.Welcome,
	})),
);

function App() {
	const [user, setUser] = useState(null);
	const [loadingUser, setLoadingUser] = useState(true);

	const authPromise = import("./utils/firebase.js").then((m) => m.auth);
	const authStateChangedPromise = import("firebase/auth").then(
		(m) => m.onAuthStateChanged,
	);

	useEffect(() => {
		let unsub;

		Promise.all([authPromise, authStateChangedPromise]).then(
			([auth, onAuthStateChanged]) => {
				unsub = onAuthStateChanged(auth, (u) => {
					setUser(u);
					setLoadingUser(false);
				});
			},
		);

		return () => unsub?.();
	}, [authPromise, authStateChangedPromise]);

	return (
		<main className={"app"}>
			<SoundProvider>
				<ToastProvider />
				<div className={"background"} />
				{loadingUser ? <Loading title={"Loading user…"} /> : null}
				<Suspense fallback={<Loading title="Loading..." />}>
					{!loadingUser && !user ? <Welcome /> : null}
				</Suspense>

				<Suspense fallback={<Loading title="Loading..." />}>
					{!loadingUser && user ? <Garden user={user} /> : null}
				</Suspense>
			</SoundProvider>
		</main>
	);
}

export default App;
