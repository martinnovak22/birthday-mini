import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useGarden } from "../hooks/useGarden.js";
import { useSwipe } from "../hooks/useSwipe.js";
import { ErrorRefresh } from "./Error.jsx";
import { FlowerSelectToast } from "./FlowerSelectToast.jsx";
import { Loading } from "./Loading.jsx";
import { OnboardingToast } from "./OnboardingToast.jsx";
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
	const [isTurboMode, setIsTurboMode] = useState(() => {
		const saved = localStorage.getItem("isTurboMode");
		return saved === "true";
	});

	const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
		return localStorage.getItem("hasSeenOnboarding") === "true";
	});

	useEffect(() => {
		localStorage.setItem("isTurboMode", isTurboMode);
	}, [isTurboMode]);

	useEffect(() => {
		if (!hasSeenOnboarding) {
			toast(
				<OnboardingToast
					toast={{
						dismiss: () => {
							localStorage.setItem("hasSeenOnboarding", "true");
							setHasSeenOnboarding(true);
							toast.dismiss();
						},
					}}
				/>,
				{ duration: Infinity },
			);
		}
	}, [hasSeenOnboarding]);

	useSwipe({
		onSwipeLeft: () => setMenuOpen(false),
	});

	if (isLoading) {
		return <Loading title={"Loading garden…"} />;
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
						isTurboMode={isTurboMode}
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
				isTurboMode={isTurboMode}
				setIsTurboMode={setIsTurboMode}
			/>
		</>
	);
};
