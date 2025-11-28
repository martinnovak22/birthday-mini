import bouquet from "../assets/bouquet.png";
import { signInWithGoogle } from "../utils/firebase.js";

export const Welcome = () => {
	return (
		<div className={"screen"}>
			<img src={bouquet} alt={"bouquet"} className={"image"} />
			<h1 className={"title"}>Welcome to your own little garden</h1>
			<span className={"text"}>Login with Google to proceed</span>
			<button className={"button"} onClick={signInWithGoogle} type={"button"}>
				Login
			</button>
		</div>
	);
};
