/**
 * State management for in-memory function storage
 */

// In-memory function storage
let functions = [
    {
        id: 'reading-normalizer',
        name: 'reading-normalizer',
        namespace: 'default',
        image: 'registry.example.com/functions/reading-normalizer:latest',
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
        networkingMethod: 'none',
        networkingConfig: {
            method: 'none'
        },
        eventSubscriptions: [
            {
                broker: 'default',
                eventType: 'com.example.meter.reading.received',
                replyEventType: 'com.example.meter.reading.normalized'
            }
        ],
        createdAt: new Date().toISOString()
    },
    {
        id: 'anomaly-detector',
        name: 'anomaly-detector',
        namespace: 'default',
        image: 'registry.example.com/functions/anomaly-detector:latest',
        containerPort: 8080,
        buildMethod: 'none',
        buildConfig: {
            method: 'none'
        },
        scalingMetric: 'concurrency',
        metricConfig: {
            minReplicaCount: 0,
            maxReplicaCount: 5,
            targetValue: 50
        },
        networkingMethod: 'none',
        networkingConfig: {
            method: 'none'
        },
        eventSubscriptions: [
            {
                broker: 'default',
                eventType: 'com.example.meter.reading.normalized',
                replyEventType: 'com.example.meter.anomaly.evaluated'
            }
        ],
        createdAt: new Date().toISOString()
    }
];

// In-memory broker storage
let brokers = [
    {
        id: 'default-broker',
        name: 'default',
        namespace: 'default',
        deliveryConfig: {
            retry: 3,
            backoffPolicy: 'exponential',
            backoffDelay: '1s'
        },
        createdAt: new Date().toISOString()
    }
];

// In-memory event source storage
let eventSources = [
    {
        id: 'mqtt-meter-source-1',
        name: 'mqtt-meter-source',
        namespace: 'default',
        type: 'mqtt',
        sinkMethod: 'broker',
        sinkConfig: {
            method: 'broker',
            broker: 'default'
        },
        config: {
            brokerURL: 'tcp://mqtt-broker.iot.svc.cluster.local:1883',
            topic: 'smart-meters/#',
            clientID: 'meter-source-consumer'
        },
        eventTypes: ['com.example.meter.reading.received'],
        createdAt: new Date().toISOString()
    }
];

// Current function being edited (null for create mode)
let currentEditingFunction = null;

// Current broker being edited (null for create mode)
let currentEditingBroker = null;

// Current event source being edited (null for create mode)
let currentEditingEventSource = null;

// In-memory event sink storage
let eventSinks = [
    {
        id: 'timeseries-db-1',
        name: 'timeseries-db',
        namespace: 'default',
        type: 'database',
        config: {
            databaseType: 'postgresql',
            connectionSecret: 'timeseries-db-credentials',
            table: 'meter_anomalies'
        },
        eventSubscriptions: [
            {
                broker: 'default',
                eventType: 'com.example.meter.anomaly.evaluated'
            }
        ],
        createdAt: new Date().toISOString()
    }
];

// Current event sink being edited (null for create mode)
let currentEditingEventSink = null;

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
            eventSubscriptions: functionData.eventSubscriptions || [], // Initialize empty subscriptions if not provided
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
 * Get all brokers
 */
function getBrokers() {
    return brokers;
}

/**
 * Get broker by ID
 */
function getBroker(id) {
    return brokers.find(b => b.id === id);
}

/**
 * Add or update broker
 */
function saveBroker(brokerData) {
    if (brokerData.id) {
        // Update existing
        const index = brokers.findIndex(b => b.id === brokerData.id);
        if (index !== -1) {
            brokers[index] = {
                ...brokerData,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // Create new
        const newBroker = {
            ...brokerData,
            id: `${brokerData.name}-broker`,
            createdAt: new Date().toISOString()
        };
        brokers.push(newBroker);
    }
}

/**
 * Delete broker by ID
 */
function deleteBroker(id) {
    brokers = brokers.filter(b => b.id !== id);
}

/**
 * Set current editing broker
 */
function setCurrentEditingBroker(brokerData) {
    currentEditingBroker = brokerData;
}

/**
 * Get current editing broker
 */
function getCurrentEditingBroker() {
    return currentEditingBroker;
}

/**
 * Clear current editing broker
 */
function clearCurrentEditingBroker() {
    currentEditingBroker = null;
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

/**
 * Get all event sinks
 */
function getEventSinks() {
    return eventSinks;
}

/**
 * Get event sink by ID
 */
function getEventSink(id) {
    return eventSinks.find(sink => sink.id === id);
}

/**
 * Add or update event sink
 */
function saveEventSink(sinkData) {
    if (sinkData.id) {
        // Update existing
        const index = eventSinks.findIndex(sink => sink.id === sinkData.id);
        if (index !== -1) {
            eventSinks[index] = {
                ...sinkData,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // Create new
        const newSink = {
            ...sinkData,
            id: sinkData.name,
            createdAt: new Date().toISOString()
        };
        eventSinks.push(newSink);
    }
}

/**
 * Delete event sink by ID
 */
function deleteEventSink(id) {
    eventSinks = eventSinks.filter(sink => sink.id !== id);
}

/**
 * Set current editing event sink
 */
function setCurrentEditingEventSink(sinkData) {
    currentEditingEventSink = sinkData;
}

/**
 * Get current editing event sink
 */
function getCurrentEditingEventSink() {
    return currentEditingEventSink;
}

/**
 * Clear current editing event sink
 */
function clearCurrentEditingEventSink() {
    currentEditingEventSink = null;
}
