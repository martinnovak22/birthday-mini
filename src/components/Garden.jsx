import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useGarden } from "../hooks/useGarden.js";
import { ErrorRefresh } from "./Error.jsx";
import { FlowerSelectToast } from "./FlowerSelectToast.jsx";
import Plot from "./Plot.jsx";
import { SideMenu } from "./SideMenu.jsx";

const FLOWERS = [
	"🌸",
	"🌺",
	"🌻",
	"🏵️",
	"🌼",
	"🪻",
	"🥀",
	"🌷",
	"🌹",
	"💮",
	"🪷",
];

export const Garden = ({ user }) => {
	const {
		garden,
		profile,
		isLoading,
		error,
		sparkle,
		water,
		plant,
		resetGarden,
		clearSparkle,
		reload,
	} = useGarden(user);

	const [menuOpen, setMenuOpen] = useState(false);
	const [now, setNow] = useState(Date.now());

	useEffect(() => {
		const id = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(id);
	}, []);

	if (isLoading) {
		return <span className="text">Loading garden…</span>;
	}

	if (error) {
		return <ErrorRefresh onClick={reload} />;
	}

	if (!garden) return null;

	return (
		<>
			<div className={"header"}>
				<button
					type={"button"}
					className={"menu-toggle"}
					onClick={() => setMenuOpen(true)}
				>
					☰
				</button>
				<h1>Cute little garden</h1>
			</div>
			<section className="ground">
				{garden.map((plot, i) => (
					<Plot
						key={i.toString()}
						{...plot}
						now={now}
						onWater={() => water(i)}
						showParticles={sparkle === i}
						onSeedClick={() =>
							toast(
								<FlowerSelectToast
									toast={toast}
									flowers={FLOWERS}
									onSelect={(flower) => plant(i, flower)}
								/>,
							)
						}
						onParticlesDone={clearSparkle}
					/>
				))}
			</section>
			<SideMenu
				isOpen={menuOpen}
				onClose={() => setMenuOpen(false)}
				user={user}
				profile={profile}
				garden={garden}
				onReset={resetGarden}
				toast={toast}
			/>
		</>
	);
};
