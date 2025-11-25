import { ConfirmationToast } from "./ConfirmationToast.jsx";
import { SelectionToast } from "./SelectionToast.jsx";
import { User } from "./User.jsx";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase.js";
import makeBouquetImage from "../utils/makeBouquetImage.js";

export const SideMenu = ({
    isOpen,
    onClose,
    user,
    profile,
    garden,
    onReset,
    toast,
}) => {
    const blooms = garden ? garden.filter((p) => p.water === 5) : [];
    const hasStarted = garden ? garden.some((p) => p.water >= 0) : false;
    const allFinished = garden ? garden.every((p) => !p.finished) : true;

    return (
        <div className={`side-menu ${isOpen ? "open" : ""}`}>
            <h1>Menu</h1>
            <button type="button" className="close-btn" onClick={onClose}>
                ×
            </button>
            <User profile={profile} name={user.displayName} />
            <button
                type="button"
                className="button"
                disabled={!hasStarted}
                onClick={() => {
                    onClose();
                    toast(
                        <ConfirmationToast
                            onYes={onReset}
                            toast={toast}
                            title={"Start again"}
                            text={"Do you want to start with fresh garden?"}
                        />,
                    );
                }}
            >
                Start again
            </button>

            <button
                type="button"
                className="button"
                onClick={() => {
                    onClose();
                    toast(
                        <SelectionToast
                            toast={toast}
                            onCustomSelect={() =>
                                makeBouquetImage(blooms, {
                                    fileName: "our-bouquet.png",
                                })
                            }
                            blooms={blooms}
                        />,
                    );
                }}
                disabled={allFinished}
            >
                Download bouquet
            </button>

            <button
                type="button"
                className="button"
                onClick={() => {
                    onClose();
                    toast(
                        <ConfirmationToast
                            onYes={() => signOut(auth)}
                            toast={toast}
                            title={"Logout"}
                            text={"Do you want to logout?"}
                        />,
                    );
                }}
            >
                Logout
            </button>
        </div>
    );
};
