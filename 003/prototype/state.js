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
        buildMethod: 'none',
        buildConfig: {
            method: 'none'
        },
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
        eventSubscriptions: [
            {
                eventType: 'dev.knative.sources.github.event'
            }
        ],
        createdAt: new Date().toISOString()
    }
];

// In-memory event source storage
let eventSources = [
    {
        id: 'github-webhook-1',
        name: 'github-webhook',
        namespace: 'default',
        type: 'github',
        config: {
            repository: 'username/repo',
            accessTokenSecret: 'github-secret'
        },
        eventTypes: ['dev.knative.sources.github.event'],
        createdAt: new Date().toISOString()
    }
];

// Current function being edited (null for create mode)
let currentEditingFunction = null;

// Current event source being edited (null for create mode)
let currentEditingEventSource = null;

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

/**
 * Get all event sources
 */
function getEventSources() {
    return eventSources;
}

/**
 * Get event source by ID
 */
function getEventSource(id) {
    return eventSources.find(es => es.id === id);
}

/**
 * Add or update event source
 */
function saveEventSource(eventSourceData) {
    if (eventSourceData.id) {
        // Update existing
        const index = eventSources.findIndex(es => es.id === eventSourceData.id);
        if (index !== -1) {
            eventSources[index] = {
                ...eventSourceData,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // Create new
        const newEventSource = {
            ...eventSourceData,
            id: eventSourceData.name,
            createdAt: new Date().toISOString()
        };
        eventSources.push(newEventSource);
    }
}

/**
 * Delete event source by ID
 */
function deleteEventSource(id) {
    eventSources = eventSources.filter(es => es.id !== id);
}

/**
 * Set current editing event source
 */
function setCurrentEditingEventSource(eventSourceData) {
    currentEditingEventSource = eventSourceData;
}

/**
 * Get current editing event source
 */
function getCurrentEditingEventSource() {
    return currentEditingEventSource;
}

/**
 * Clear current editing event source
 */
function clearCurrentEditingEventSource() {
    currentEditingEventSource = null;
}
