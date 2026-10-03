const nodeApiBase = import.meta.env.VITE_NODE_API_URL || (
	import.meta.env.DEV
		? "http://localhost:5000"
		: "https://smart-farming-node.onrender.com"
);
const pythonApiBase = import.meta.env.VITE_PYTHON_API_URL || (
	import.meta.env.DEV
		? "http://localhost:8001"
		: "https://smart-farming-python.onrender.com"
);

export { nodeApiBase, pythonApiBase };
