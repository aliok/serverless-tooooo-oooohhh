/**
 * State management for in-memory function storage
 */

// In-memory function storage
let functions = [
    {
        id: 'example-function',
        name: 'example-function',
        namespace: 'default',
        image: 'registry.example.com/functions/example-function:latest',
        containerPort: 8080,
        scalingMetric: 'concurrency',
        metricConfig: {
            minReplicaCount: 0,
            maxReplicaCount: 10,
            targetValue: 100
        },
        networkingMethod: 'gateway',
        networkingConfig: {
            method: 'gateway',
            gatewayName: 'default-gateway',
            hostname: 'example-function.example.com',
            path: '/'
        },
        createdAt: new Date().toISOString()
    }
];

// Current function being edited (null for create mode)
let currentEditingFunction = null;

/**
 * Get all functions
 */
function getFunctions() {
    return functions;
}

/**
 * Get function by ID
 */
function getFunction(id) {
    return functions.find(f => f.id === id);
}

/**
 * Add or update function
 */
function saveFunction(functionData) {
    if (functionData.id) {
        // Update existing
        const index = functions.findIndex(f => f.id === functionData.id);
        if (index !== -1) {
            functions[index] = {
                ...functionData,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // Create new
        const newFunction = {
            ...functionData,
            id: functionData.name, // Use name as ID for simplicity
            createdAt: new Date().toISOString()
        };
        functions.push(newFunction);
    }
}

/**
 * Delete function by ID
 */
function deleteFunction(id) {
    functions = functions.filter(f => f.id !== id);
}

/**
 * Set current editing function
 */
function setCurrentEditingFunction(functionData) {
    currentEditingFunction = functionData;
}

/**
 * Get current editing function
 */
function getCurrentEditingFunction() {
    return currentEditingFunction;
}

/**
 * Clear current editing function
 */
function clearCurrentEditingFunction() {
    currentEditingFunction = null;
}
