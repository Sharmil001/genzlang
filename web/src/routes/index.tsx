import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return <div className="flex items-center justify-center">GenZ Lang 🚀</div>;
}
