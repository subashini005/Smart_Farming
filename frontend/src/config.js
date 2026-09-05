const nodeApiBase = import.meta.env.VITE_NODE_API_URL || (
	import.meta.env.DEV
		? "https://shiny-space-disco-jjq4vr79997vfp7p7-5000.app.github.dev"
		: "https://smart-farming-node.onrender.com"
);
const pythonApiBase = import.meta.env.VITE_PYTHON_API_URL || (
	import.meta.env.DEV
		? "https://shiny-space-disco-jjq4vr79997vfp7p7-8001.app.github.dev"
		: "https://smart-farming-python.onrender.com"
);

export { nodeApiBase, pythonApiBase };
