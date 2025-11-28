import { useEffect, useRef } from "react";
import { ToastBar, Toaster, toast } from "react-hot-toast";

export const DURATION = 3000;

const ToastContent = ({ t, message }) => {
	const timeoutRef = useRef(null);

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		if ((t.type === "success" || t.type === "error") && t.visible) {
			timeoutRef.current = setTimeout(() => toast.dismiss(t.id), DURATION);
		} else if (t.data?.onClose && t.visible) {
			timeoutRef.current = setTimeout(() => {
				t.data.onClose();
				toast.dismiss(t.id);
			}, DURATION);
		}
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [t.id, t.type, t.visible, t.data]);

	const handleClose = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		if (t.data?.onClose) {
			t.data.onClose();
		}
		toast.dismiss(t.id);
	};

	return (
		<>
			{message}
			{!["success", "error", "loading"].includes(t.type) && (
				<button type={"button"} className={"x-button"} onClick={handleClose}>
					×
				</button>
			)}
		</>
	);
};

export const ToastProvider = () => {
	return (
		<Toaster>
			{(t) => (
				<ToastBar
					toast={t}
					className="toast-bar-custom"
				>
					{({ message }) => <ToastContent t={t} message={message} />}
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
		type={"button"}
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
		type={"button"}
		className={`button toast-flower-button ${className}`}
		onClick={onClick}
		{...props}
	>
		<span className={"toast-flower"}>{children}</span>
	</button>
);
