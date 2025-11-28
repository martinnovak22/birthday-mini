import { useState } from "react";
import { toast } from "react-hot-toast";
import { useGarden } from "../hooks/useGarden.js";
import { useSwipe } from "../hooks/useSwipe.js";
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
		activePlot,
		setActivePlot,
		isAdmin,
	} = useGarden(user);

	const [menuOpen, setMenuOpen] = useState(false);
	const [adminCheatOn, setAdminCheatOn] = useState(false);

	useSwipe({
		onSwipeLeft: () => setMenuOpen(false),
	});

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
			<section className={"ground"}>
				{garden.map((plot, i) => (
					<Plot
						key={i.toString()}
						{...plot}
						onWater={() => water(i)}
						showParticles={sparkle.has(i)}
						isHighlighted={activePlot === i}
						onSeedClick={() => {
							setActivePlot(i);
							toast(
								<FlowerSelectToast
									toast={toast}
									flowers={FLOWERS}
									onSelect={(flower) => {
										setActivePlot(null);
										plant(i, flower);
									}}
								/>,
								{
									id: "flower-select-toast",
									data: {
										onClose: () => setActivePlot(null),
									},
								},
							);
						}}
						onParticlesDone={() => clearSparkle(i)}
						cheatOn={adminCheatOn}
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
				isAdmin={isAdmin}
				adminCheatOn={adminCheatOn}
				setAdminCheatOn={setAdminCheatOn}
			/>
		</>
	);
};
