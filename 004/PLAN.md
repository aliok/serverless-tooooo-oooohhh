# Implementation Plan: Event Sinks for 004 Prototype

## Overview
Add Event Sinks feature to 004/prototype that mirrors Event Sources architecture but works in the opposite direction - sending CloudEvents from the platform to external systems.

## User Requirements
1. **Dual-purpose sinks**:
   - Standalone mode: Subscribe to Brokers and send filtered events to external systems
   - Referenced mode: Used by Functions as destinations
2. **Sink types to support**:
   - HTTP/Webhook (CloudEvents to HTTP endpoints)
   - Kafka (CloudEvents to Kafka topics)
   - AWS SNS, GCP Pub/Sub, Azure Event Grid
   - Database (PostgreSQL, MongoDB)

## Architecture Pattern

Event Sinks mirror Event Sources:
- Event Sources: External → Source → Broker (bring events IN)
- Event Sinks: Broker/Function → Sink → External (send events OUT)

**Standalone Mode Flow:**
```
Broker → Trigger (filters event types) → Event Sink → External System
```

**Referenced Mode Flow:**
```
Function → Event Sink → External System
```

## Implementation Steps

### Phase 1: Data Model (state.js)

Add event sinks storage mirroring event sources pattern:

```javascript
let eventSinks = [
    {
        id: 'http-webhook-1',
        name: 'http-webhook',
        namespace: 'default',
        type: 'http',  // http, kafka, sns, pubsub, eventgrid, database
        mode: 'standalone',  // 'standalone' or 'referenced'
        broker: 'default',  // For standalone mode only
        eventTypes: ['com.example.order.created'],  // For standalone mode filtering
        config: {
            url: 'https://example.com/webhook',
            headers: { 'Content-Type': 'application/cloudevents+json' }
        },
        createdAt: '...'
    }
];
```

**CRUD Functions to Add:**
- `getEventSinks()` - get all sinks
- `getEventSink(id)` - get sink by ID
- `saveEventSink(sinkData)` - create/update sink
- `deleteEventSink(id)` - delete sink
- `setCurrentEditingEventSink(sinkData)` - set editing state
- `getCurrentEditingEventSink()` - get editing state
- `clearCurrentEditingEventSink()` - clear editing state

**Mode Field:**
- `standalone`: Sink subscribes to broker via Trigger, filters by event types
- `referenced`: Sink is available for Functions to reference as destination

### Phase 2: UI Structure (index.html)

Add three new views following event sources pattern:

**1. Event Sinks List View**
```html
<div id="eventSinksListView" class="container" style="display: none;">
    <!-- Table with columns: Name, Type, Mode, Destination, Actions -->
</div>
```

**2. Event Sink Form View**
```html
<div id="eventSinkFormView" class="container" style="display: none;">
    <!-- Common fields: name, namespace, mode -->
    <!-- Standalone mode fields: broker dropdown, event types -->
    <!-- Type-specific panels (radio buttons): -->
    <!-- - HTTP/Webhook panel -->
    <!-- - Kafka panel -->
    <!-- - AWS SNS panel -->
    <!-- - GCP Pub/Sub panel -->
    <!-- - Azure Event Grid panel -->
    <!-- - Database panel -->
    <!-- Resources preview section -->
</div>
```

**3. Event Sink Detail View**
```html
<div id="eventSinkDetailView" class="container" style="display: none;">
    <!-- Diagram: Source → Sink → External Destination -->
    <!-- Source = Broker (standalone) or Functions (referenced) -->
    <!-- Resources preview section -->
</div>
```

**Navigation Tab:**
Add "Event Sinks" tab alongside "Functions", "Brokers", "Event Sources"

### Phase 3: Form Logic (app.js)

**Key Functions to Implement:**

1. **Form Management:**
   - `showEventSinkFormView(mode)` - show create/edit form
   - `collectEventSinkFormData()` - gather form data
   - `resetEventSinkForm()` - reset to defaults
   - `loadEventSinkIntoForm(sinkData)` - populate for editing
   - `updateEventSinkResourcePreview()` - live YAML preview

2. **Mode Handling:**
```javascript
// Show/hide fields based on mode selection
eventSinkMode.addEventListener('change', function() {
    if (this.value === 'standalone') {
        standaloneModeFields.style.display = 'block';  // Show broker, event types
    } else {
        standaloneModeFields.style.display = 'none';  // Hide broker, event types
    }
});
```

3. **Type Panel Toggle:**
```javascript
// Mirror event sources pattern
eventSinkTypeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        // Hide all panels
        httpSinkPanel.classList.remove('active');
        kafkaSinkPanel.classList.remove('active');
        // ... etc

        // Show selected panel
        if (this.value === 'http') {
            httpSinkPanel.classList.add('active');
        }
        // ... etc
    });
});
```

4. **List & Detail Views:**
   - `renderEventSinksList()` - populate table
   - `showEventSinkDetailView(sinkData)` - show detail view
   - `renderEventSinkDetailView(sinkData)` - render diagram
   - Add edit/delete button handlers

### Phase 4: YAML Generation (templates.js)

**Sink Resource Generators:**

```javascript
function generateHttpSinkYAML(config) {
    return `apiVersion: sinks.knative.dev/v1alpha1
kind: HttpSink
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  url: ${config.config.url}
  headers:
    Content-Type: "application/cloudevents+json"`;
}

function generateKafkaSinkYAML(config) {
    return `apiVersion: eventing.knative.dev/v1alpha1
kind: KafkaSink
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  topic: ${config.config.topic}
  bootstrapServers:
    - ${config.config.bootstrapServers}`;
}

function generateSnsSinkYAML(config) {
    return `apiVersion: sinks.knative.dev/v1alpha1
kind: AwsSnsSink
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  topicArn: ${config.config.topicArn}
  credentials:
    secretKeyRef:
      name: ${config.config.credentialsSecret}
      key: credentials`;
}

function generatePubSubSinkYAML(config) {
    return `apiVersion: sinks.knative.dev/v1alpha1
kind: GcpPubSubSink
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  topic: ${config.config.topic}
  credentials:
    secretKeyRef:
      name: ${config.config.credentialsSecret}
      key: credentials`;
}

function generateEventGridSinkYAML(config) {
    return `apiVersion: sinks.knative.dev/v1alpha1
kind: AzureEventGridSink
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  endpoint: ${config.config.endpoint}
  key:
    secretKeyRef:
      name: ${config.config.keySecret}
      key: key`;
}

function generateDatabaseSinkYAML(config) {
    return `apiVersion: sinks.knative.dev/v1alpha1
kind: DatabaseSink
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  type: ${config.config.databaseType}
  connectionSecret: ${config.config.connectionSecret}
  table: ${config.config.table}`;
}
```

**Standalone Mode - Trigger Generator:**

```javascript
function generateSinkTriggerYAML(sinkConfig) {
    const eventTypeFilters = sinkConfig.eventTypes
        .map(type => `    - exact:\n        type: ${type}`)
        .join('\n');

    return `apiVersion: eventing.knative.dev/v1
kind: Trigger
metadata:
  name: ${sinkConfig.name}-trigger
  namespace: ${sinkConfig.namespace}
spec:
  broker: ${sinkConfig.broker}
  filter:
    attributes:
${eventTypeFilters}
  subscriber:
    ref:
      apiVersion: sinks.knative.dev/v1alpha1
      kind: ${getSinkKind(sinkConfig.type)}
      name: ${sinkConfig.name}`;
}

function getSinkKind(type) {
    const kindMap = {
        'http': 'HttpSink',
        'kafka': 'KafkaSink',
        'sns': 'AwsSnsSink',
        'pubsub': 'GcpPubSubSink',
        'eventgrid': 'AzureEventGridSink',
        'database': 'DatabaseSink'
    };
    return kindMap[type] || 'HttpSink';
}
```

**Resource Preview Logic:**

```javascript
function updateEventSinkResourcePreview() {
    const formData = collectEventSinkFormData();

    const resources = [];

    // Always add the sink resource
    resources.push({
        type: `${formData.type}Sink`,
        name: formData.name,
        yaml: generateSinkYAML(formData),
        metadata: RESOURCE_METADATA[`${formData.type}Sink`]
    });

    // For standalone mode, add Trigger
    if (formData.mode === 'standalone') {
        resources.push({
            type: 'trigger',
            name: `${formData.name}-trigger`,
            yaml: generateSinkTriggerYAML(formData),
            metadata: RESOURCE_METADATA.trigger
        });
    }

    renderResourceCards(resources, formData.name);
}
```

### Phase 5: Function Integration

**Update Function Data Model:**

```javascript
// Modify sinkMethod to support 'sink' option
{
    sinkMethod: 'sink',  // 'none', 'broker', or 'sink'
    sinkConfig: {
        method: 'sink',
        sinkName: 'http-webhook-1',
        sinkType: 'http'
    }
}
```

**Update Destinations Management View (index.html):**

```html
<div id="destinationForm">
    <label>Destination Type</label>
    <select id="destinationMethod">
        <option value="broker">Broker</option>
        <option value="sink">Event Sink</option>
    </select>

    <!-- Broker fields (existing) -->
    <div id="brokerDestinationFields">
        <select id="destinationBroker">...</select>
    </div>

    <!-- Sink fields (new) -->
    <div id="sinkDestinationFields" style="display: none;">
        <select id="destinationSink">
            <!-- Populated with sinks where mode='referenced' -->
        </select>
    </div>
</div>
```

**Update Destination Logic (app.js):**

```javascript
function populateDestinationSinkDropdown() {
    const dropdown = document.getElementById('destinationSink');
    const sinks = getEventSinks().filter(s => s.mode === 'referenced');

    dropdown.innerHTML = '<option value="">Select a sink...</option>';
    sinks.forEach(sink => {
        const option = document.createElement('option');
        option.value = sink.name;
        option.dataset.sinkType = sink.type;
        option.textContent = `${sink.name} (${sink.type})`;
        dropdown.appendChild(option);
    });
}

// Handle destination method change
destinationMethod.addEventListener('change', function() {
    if (this.value === 'broker') {
        brokerDestinationFields.style.display = 'block';
        sinkDestinationFields.style.display = 'none';
    } else if (this.value === 'sink') {
        brokerDestinationFields.style.display = 'none';
        sinkDestinationFields.style.display = 'block';
    }
});

// Handle destination save
saveDestinationBtn.addEventListener('click', function() {
    const method = destinationMethod.value;

    if (method === 'sink') {
        const sinkSelect = document.getElementById('destinationSink');
        currentDetailFunction.sinkMethod = 'sink';
        currentDetailFunction.sinkConfig = {
            method: 'sink',
            sinkName: sinkSelect.value,
            sinkType: sinkSelect.options[sinkSelect.selectedIndex].dataset.sinkType
        };
    }
    // ... existing broker logic ...

    saveFunction(currentDetailFunction);
    renderDestination(currentDetailFunction);
});
```

**Update Function YAML Generator:**

```javascript
function generateFunctionYAML(config) {
    // ... existing code ...

    let sinkYAML = '';
    if (config.sinkMethod === 'sink' && config.sinkConfig) {
        const sinkKind = getSinkKind(config.sinkConfig.sinkType);
        sinkYAML = `
    sink:
      ref:
        apiVersion: sinks.knative.dev/v1alpha1
        kind: ${sinkKind}
        name: ${config.sinkConfig.sinkName}`;
    }
    // ... rest of YAML ...
}
```

**Update Destination Display:**

```javascript
function renderDestination(functionData) {
    // ... existing code ...

    if (functionData.sinkMethod === 'sink' && functionData.sinkConfig) {
        const destCard = document.createElement('div');
        destCard.className = 'subscription-card';
        destCard.innerHTML = `
            <div class="subscription-info">
                <div class="subscription-broker">Event Sink: <strong>${functionData.sinkConfig.sinkName}</strong></div>
                <div class="subscription-type">Type: ${functionData.sinkConfig.sinkType}</div>
            </div>
            <button class="btn-danger btn-small remove-destination-btn">Remove</button>
        `;
        destinationDisplay.appendChild(destCard);
    }
}
```

### Phase 6: Detail View Diagrams

**Event Sink Detail View:**

Show different sources based on mode:

```javascript
function renderEventSinkDetailView(sinkData) {
    // Set title and type
    detailEventSinkName.textContent = sinkData.name;
    detailEventSinkType.textContent = sinkData.type;
    detailEventSinkMode.textContent = sinkData.mode;

    // Render sources based on mode
    eventSinkSourcesList.innerHTML = '';

    if (sinkData.mode === 'standalone') {
        // Show broker as source
        const sourceBox = document.createElement('div');
        sourceBox.className = 'source-box';
        sourceBox.innerHTML = `
            <div class="source-icon">📨</div>
            <div class="source-info">
                <div class="source-name">${sinkData.broker}</div>
                <div class="source-details">Broker</div>
            </div>
        `;
        eventSinkSourcesList.appendChild(sourceBox);
        eventSinkSourceTitle.textContent = 'Event Source (Broker)';
    } else {
        // Show functions that reference this sink
        const functions = getFunctions().filter(f =>
            f.sinkMethod === 'sink' && f.sinkConfig.sinkName === sinkData.name
        );
        functions.forEach(func => {
            const sourceBox = document.createElement('div');
            sourceBox.className = 'source-box';
            sourceBox.innerHTML = `
                <div class="source-icon">λ</div>
                <div class="source-info">
                    <div class="source-name">${func.name}</div>
                    <div class="source-details">Function</div>
                </div>
            `;
            eventSinkSourcesList.appendChild(sourceBox);
        });
        eventSinkSourceTitle.textContent = 'Event Sources (Functions)';
    }

    // Render external destination
    renderEventSinkExternalDestination(sinkData);
}
```

## Implementation Order

1. **Phase 1**: Data model (state.js) - foundation
2. **Phase 2**: UI structure (index.html) - views
3. **Phase 3**: Form logic (app.js) - interactivity
4. **Phase 4**: YAML generation (templates.js) - resource creation
5. **Phase 5**: Function integration - connect functions to sinks
6. **Phase 6**: Detail views - visualization

## Critical Files

- **004/prototype/state.js** - Add eventSinks array and CRUD functions
- **004/prototype/index.html** - Add Event Sinks tab, list/form/detail views
- **004/prototype/app.js** - Implement sink management and function integration
- **004/prototype/templates.js** - Add sink YAML generators

## Testing Checklist

- ✅ Create standalone HTTP sink subscribing to broker
- ✅ Create referenced Kafka sink for function destination
- ✅ Edit and delete sinks
- ✅ Toggle between standalone and referenced modes
- ✅ Function can select event sink as destination
- ✅ Detail view shows correct diagram for each mode
- ✅ YAML preview shows correct resources (Sink + Trigger for standalone, Sink only for referenced)
- ✅ All sink types generate valid YAML
