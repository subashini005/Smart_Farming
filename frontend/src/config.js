const nodeApiBase = import.meta.env.VITE_NODE_API_URL || "http://localhost:5000";
const pythonApiBase = import.meta.env.VITE_PYTHON_API_URL || "http://localhost:8001";

export { nodeApiBase, pythonApiBase };
