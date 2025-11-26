import { ToastBar, Toaster, toast } from "react-hot-toast";

export const DURATION = 3000;

export const ToastProvider = () => {
	return (
		<Toaster>
			{(t) => (
				<ToastBar
					toast={t}
					style={{ backgroundColor: "var(--green-400)", padding: "10px 0" }}
				>
					{({ message }) => {
						if ((t.type === "success" || t.type === "error") && t.visible) {
							setTimeout(() => toast.dismiss(t.id), DURATION);
						}
						return (
							<>
								{message}
								{!["success", "error", "loading"].includes(t.type) && (
									<button
										type="button"
										className="x-button"
										onClick={() => toast.dismiss(t.id)}
									>
										×
									</button>
								)}
							</>
						);
					}}
				</ToastBar>
			)}
		</Toaster>
	);
};

export const Toast = ({ children, className = "" }) => {
	return <div className={`toast ${className}`}>{children}</div>;
};

Toast.Title = ({ children, className = "" }) => (
	<span className={`toast-title ${className}`}>{children}</span>
);

Toast.Text = ({ children, className = "" }) => (
	<span className={`toast-text ${className}`}>{children}</span>
);

Toast.Actions = ({ children, className = "" }) => (
	<div className={`toast-button-wrapper ${className}`}>{children}</div>
);

Toast.Button = ({ children, onClick, className = "", ...props }) => (
	<button
		type="button"
		className={`button ${className}`}
		onClick={onClick}
		{...props}
	>
		{children}
	</button>
);

Toast.Flowers = ({ children, className = "" }) => (
	<div className={`toast-flowers ${className}`}>{children}</div>
);

Toast.FlowerButton = ({ children, onClick, className = "", ...props }) => (
	<button
		type="button"
		className={`button toast-flower-button ${className}`}
		onClick={onClick}
		{...props}
	>
		<span className="toast-flower">{children}</span>
	</button>
);
