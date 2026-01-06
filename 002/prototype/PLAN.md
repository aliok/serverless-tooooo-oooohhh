# Fake UI Implementation Plan

## Overview
Create a simple web-based prototype UI that demonstrates the Function composition concept described in `002/spec/README.md`. The UI will be built in phases, with each phase focusing on a specific aspect of the composition.

## Phase 1: Scaling & Runtime ✅ COMPLETED

This phase demonstrates the UI as a composition layer. Users define a Function with scaling preferences, and the UI creates multiple Kubernetes resources.

### Goals
1. Demonstrate the UI as the **composition layer** that prevents API soup
2. Show user perspective: simple "Create Function" form
3. Show platform perspective: UI creates Deployment, Service, and scaling resources (HTTPScaledObject or ScaledObject)
4. Support multiple scaling methods: HTTP-based and KEDA triggers

### Technology Stack
- **HTML/CSS/JavaScript** - Keep it simple, no build tools required
- **Static files** - Can be opened directly in a browser
- **No backend** - Everything is client-side and mocked

## UI Components (Phase 1)

### 1. Function Creation Form (Left Panel)
A simple "Create Function" form - **this is what the user sees**:

**Function Details:**
- **Function Name** (text input, e.g., "my-function")
- **Namespace** (text input, default: "default")
- **Container Image** (text input, e.g., "registry.example.com/functions/my-function:latest")
- **Container Port** (number input, default: 8080)

**Scaling Configuration:**

*Shared Settings (applies to all scaling methods):*
- **Min Replica Count** (number input, default: 0)
- **Max Replica Count** (number input, default: 10)

Three collapsible panels with integrated radio buttons in headers:

*HTTP Concurrency Panel:*
- Panel header contains: radio button + collapse icon + "HTTP Concurrency"
- When selected/clicked: panel expands, shows:
  - **Target Concurrent Requests** (number input, default: 100)
  - Helper text: "Target number of concurrent requests per instance"

*HTTP Request Rate Panel:*
- Panel header contains: radio button + collapse icon + "HTTP Request Rate"
- When selected/clicked: panel expands, shows:
  - **Target Request Rate** (number input, default: 100)
    - Helper text: "Target requests per second"
  - **Aggregation Window** (text input, default: "1m")
    - Helper text: "Time window for aggregating metrics (e.g., '1m', '30s')"
  - **Metric Granularity** (text input, default: "1s")
    - Helper text: "Granularity for metric calculation (e.g., '1s', '500ms')"

*KEDA Triggers Panel:*
- Panel header contains: radio button + collapse icon + "KEDA Triggers"
- When selected/clicked: panel expands, shows:
  - **Trigger Type** dropdown with options:
    - CPU
    - Memory
    - Prometheus
    - Kafka
    - RabbitMQ
    - Redis
    - Cron
    - Custom (define your own)
  - Trigger-specific fields based on selected type (e.g., CPU utilization %, Kafka topic, custom YAML metadata)

**Create Function** button

### 2. Resources View (Right Panel)
Split into two sections showing the abstraction boundary:

#### A. What User Thinks (Top - highlighted in green)
- Simple message: "You created a Function named 'my-function' with auto-scaling enabled"
- Clean, conceptual representation

#### B. What UI Creates (Bottom - highlighted in blue)
Shows 3 resource cards, each expandable:

1. **Deployment** (apps/v1)
   - Shows: `my-function` Deployment
   - Label: `serverless.openshift.io/function: my-function`
   - Spec: replicas: 0, container image, ports

2. **Service** (v1)
   - Shows: `my-function` Service
   - Label: `serverless.openshift.io/function: my-function`
   - Spec: selector, ports, targetPort

3. **Scaling Resource** (varies based on selection)
   - **HTTPScaledObject** (http.keda.sh/v1alpha1) - for HTTP Concurrency or HTTP Request Rate
     - Shows: `my-function-http` HTTPScaledObject
     - Label: `serverless.openshift.io/function: my-function`
     - Spec: scaleTargetRef, scalingMetric (concurrency or requestRate)
   - **ScaledObject** (keda.sh/v1alpha1) - for KEDA Triggers
     - Shows: `my-function-scaledobject` ScaledObject
     - Label: `serverless.openshift.io/function: my-function`
     - Spec: scaleTargetRef, triggers (with chosen trigger type and configuration)

Each card:
- Shows resource type, API version, and name
- Expandable to show full YAML
- Highlights the label `serverless.openshift.io/function`
- Shows purpose/description of the resource
- Copy YAML button for easy export

## User Flow (Phase 1)

1. User fills in the "Create Function" form (simple, high-level fields)
2. User selects scaling method (HTTP Concurrency, HTTP Request Rate, or KEDA Triggers)
3. User configures method-specific settings (e.g., target value, trigger type)
4. User clicks "Create Function"
5. UI shows:
   - Top panel: "You created a Function" with scaling details (user perspective)
   - Bottom panel: 3 Kubernetes resources that were composed (platform perspective)
6. User can expand each resource card to see the generated YAML
7. User can copy YAML to clipboard
8. **Key insight**: User never had to understand Deployment, Service, HTTPScaledObject, or ScaledObject APIs

## Key Design Decisions (Phase 1)

### What to Include
- ✅ Simple "Create Function" form (user perspective)
- ✅ Three scaling method options with radio buttons in collapsible panel headers
- ✅ Shared min/max replica configuration
- ✅ YAML generation for 3 resources: Deployment, Service, and scaling resource (HTTPScaledObject or ScaledObject)
- ✅ Support for 7 KEDA trigger templates + custom trigger option
- ✅ Clear visual distinction: "What User Thinks" vs "What UI Creates"
- ✅ Labels visualization on all resources
- ✅ Expandable resource cards with copy-to-clipboard functionality
- ✅ Demonstrates UI as composition layer

### What to Exclude (Phase 1)
- ❌ Real Kubernetes API calls
- ❌ Complex validation logic (basic validation only)
- ❌ State persistence
- ❌ Complex styling/animations
- ❌ Edit/delete functionality
- ❌ Other resource types (Build, Function CR, Trigger, HTTPRoute)

## File Structure (Phase 1)

```
002/prototype/
├── PLAN.md (this file)
├── index.html (layout and form)
├── styles.css (styling)
├── app.js (form handling, UI logic, YAML generation)
└── templates.js (YAML templates for Deployment, Service, HTTPScaledObject)
```

## Implementation Steps (Phase 1)

1. **Create `index.html`**
   - Two-column layout (form | resources view)
   - "Create Function" form on the left
   - Resources view on the right with:
     - Top section: "What User Thinks" (green highlight)
     - Bottom section: "What UI Creates" with 3 expandable cards
   - Header explaining this is Phase 1: Scaling & Runtime

2. **Create `styles.css`**
   - Two-column layout (40% form / 60% resources)
   - Form styling (sections, inputs, labels, helper text)
   - Resource cards (collapsible/expandable)
   - YAML display with monospace font and basic syntax highlighting
   - Color coding: green for user view, blue for platform view
   - Responsive design

3. **Create `templates.js`**
   - Template function for Deployment YAML
   - Template function for Service YAML
   - Template function for HTTPScaledObject YAML
   - Each takes form inputs and returns formatted YAML string

4. **Create `app.js`**
   - Form submission handler
   - Generate all 3 YAMLs from form inputs
   - Render resource cards in the UI
   - Toggle expand/collapse for cards
   - Highlight labels and ownerReferences
   - Copy YAML to clipboard functionality

## Success Criteria (Phase 1)

The Phase 1 prototype successfully demonstrates:
- ✅ **UI as composition layer**: Simple form creates multiple resources
- ✅ **Abstraction boundary**: User thinks "Function", platform sees "Deployment + Service + scaling resource"
- ✅ **No API soup**: User doesn't need to understand 3+ different API groups
- ✅ **Scaling flexibility**: Supports HTTP-based scaling (concurrency, request rate) and KEDA triggers (CPU, memory, Prometheus, Kafka, RabbitMQ, Redis, cron, custom)
- ✅ **Resource relationships**: All resources share the same label (`serverless.openshift.io/function`)
- ✅ **Generated YAMLs are valid**: Properly formatted and follow K8s/KEDA conventions
- ✅ **User-friendly**: Collapsible panels, helpful text, copy-to-clipboard, clear visual distinction

## Example Output (Phase 1)

When user creates a function named "my-function" with scaling config, the UI creates:

### 1. Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-function
  namespace: default
  labels:
    serverless.openshift.io/function: my-function
spec:
  replicas: 0
  selector:
    matchLabels:
      app: my-function
  template:
    metadata:
      labels:
        app: my-function
    spec:
      containers:
        - name: function
          image: registry.example.com/functions/my-function:latest
          ports:
            - containerPort: 8080
```

### 2. Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-function
  namespace: default
  labels:
    serverless.openshift.io/function: my-function
spec:
  selector:
    app: my-function
  ports:
    - port: 80
      targetPort: 8080
```

### 3. HTTPScaledObject (with Concurrency metric)
```yaml
apiVersion: http.keda.sh/v1alpha1
kind: HTTPScaledObject
metadata:
  name: my-function-http
  namespace: default
  labels:
    serverless.openshift.io/function: my-function
spec:
  scaleTargetRef:
    name: my-function
    kind: Deployment
    apiVersion: apps/v1
    service: my-function
    port: 80
  scalingMetric:
    concurrency:
      targetValue: 100
```

**OR** with Request Rate metric:
```yaml
apiVersion: http.keda.sh/v1alpha1
kind: HTTPScaledObject
metadata:
  name: my-function-http
  namespace: default
  labels:
    serverless.openshift.io/function: my-function
spec:
  scaleTargetRef:
    name: my-function
    kind: Deployment
    apiVersion: apps/v1
    service: my-function
    port: 80
  scalingMetric:
    requestRate:
      targetValue: 100
      window: 1m
      granularity: 1s
```

---

## Phase 2: Networking ✅ COMPLETED

This phase adds networking options to expose the function externally. Users can choose different networking approaches, and the UI will compose the appropriate Kubernetes networking resources.

### Goals
1. Demonstrate multiple networking options (Gateway API, Ingress, OpenShift Route, none)
2. Show how the same Service can be exposed via different networking mechanisms
3. Keep networking configuration simple and optional
4. Generate proper networking resource YAMLs based on user selection

### Networking Options

Users will be able to choose from:

1. **No External Access** (default)
   - Function is only accessible within the cluster
   - No additional networking resources created
   - Service remains ClusterIP type

2. **Gateway API (HTTPRoute)**
   - Modern Kubernetes-native approach
   - Creates HTTPRoute resource
   - Requires Gateway API to be installed
   - Most flexible and standardized option

3. **Ingress**
   - Traditional Kubernetes networking
   - Creates Ingress resource
   - Works with any Ingress controller (nginx, Traefik, etc.)
   - Widely supported

4. **OpenShift Route** (if on OpenShift)
   - OpenShift-specific networking
   - Creates Route resource
   - Built-in TLS support
   - Automatic hostname generation

### UI Components (Phase 2)

Add new section to the form **after** Scaling Configuration:

**Networking Configuration:**

*Networking Method:* (radio buttons in collapsible panels)

- **No External Access** (default, collapsed panel)
  - Helper text: "Function is only accessible within the cluster"
  - No additional fields

- **Gateway API (HTTPRoute)**
  - **Gateway Name** (text input, default: "default-gateway")
    - Helper text: "Name of the Gateway to attach to"
  - **Hostname** (text input, optional, e.g., "my-function.example.com")
    - Helper text: "Optional: custom hostname for the route (leave empty for wildcard)"
  - **Path** (text input, default: "/")
    - Helper text: "URL path prefix (e.g., '/', '/api/v1')"

- **Ingress**
  - **Ingress Class** (text input, optional, e.g., "nginx")
    - Helper text: "Optional: specify ingress controller class"
  - **Hostname** (text input, required, e.g., "my-function.example.com")
    - Helper text: "Hostname for the ingress rule"
  - **Path** (text input, default: "/")
    - Helper text: "URL path (e.g., '/', '/api')"
  - **TLS Enabled** (checkbox)
    - When checked, shows:
      - **Secret Name** (text input, e.g., "my-function-tls")
        - Helper text: "Name of the TLS secret containing cert and key"

- **OpenShift Route**
  - **Hostname** (text input, optional)
    - Helper text: "Optional: custom hostname (leave empty for auto-generated)"
  - **Path** (text input, default: "/")
    - Helper text: "URL path prefix"
  - **TLS Termination** (dropdown: "none", "edge", "passthrough", "reencrypt", default: "edge")
    - Helper text: "TLS termination type"

### Resources Created (Phase 2)

Depending on the networking method selected, the UI will create an additional resource:

**Gateway API HTTPRoute:**
```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: my-function
  namespace: default
  labels:
    serverless.openshift.io/function: my-function
spec:
  parentRefs:
    - name: default-gateway
  hostnames:
    - my-function.example.com  # optional
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /
      backendRefs:
        - name: my-function
          port: 80
```

**Ingress:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-function
  namespace: default
  labels:
    serverless.openshift.io/function: my-function
spec:
  ingressClassName: nginx  # optional
  tls:  # if TLS enabled
    - hosts:
        - my-function.example.com
      secretName: my-function-tls
  rules:
    - host: my-function.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-function
                port:
                  number: 80
```

**OpenShift Route:**
```yaml
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: my-function
  namespace: default
  labels:
    serverless.openshift.io/function: my-function
spec:
  host: my-function.example.com  # optional, auto-generated if empty
  path: /
  to:
    kind: Service
    name: my-function
    weight: 100
  port:
    targetPort: 80
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect
```

### Implementation Steps (Phase 2)

1. **Update `index.html`**
   - Add new fieldset for "Networking Configuration"
   - Add 4 radio button panels (No Access, Gateway API, Ingress, OpenShift Route)
   - Add networking-specific input fields per option
   - Place after "Scaling Configuration" section

2. **Update `styles.css`**
   - Reuse existing metric-panel styles for networking panels
   - Ensure consistent styling with scaling panels

3. **Update `templates.js`**
   - Add `generateHTTPRouteYAML(config)`
   - Add `generateIngressYAML(config)`
   - Add `generateRouteYAML(config)`
   - Update RESOURCE_METADATA with networking resource descriptions

4. **Update `app.js`**
   - Add networking panel activation logic (similar to scaling panels)
   - Collect networking configuration from form
   - Generate networking resource based on selection
   - Add networking resource to resource cards (conditionally, only if not "No External Access")
   - Update user message to mention networking configuration
   - Add validation for required networking fields

### User Flow (Phase 2)

1. User fills in function details and scaling configuration (Phase 1)
2. User selects networking method (No Access, Gateway API, Ingress, or OpenShift Route)
3. User configures networking-specific settings (hostname, path, TLS, etc.)
4. User clicks "Create Function"
5. UI shows:
   - User perspective: "You created a Function exposed via [networking method]"
   - Platform perspective: 3 or 4 resources (Deployment, Service, Scaling, and optionally Networking)
6. If networking resource was created, user can expand it to see the YAML

### Success Criteria (Phase 2)

- ✅ **Networking flexibility**: Supports 4 networking options (none, Gateway API, Ingress, OpenShift Route)
- ✅ **Optional networking**: Networking is opt-in, not required
- ✅ **Proper resource generation**: Networking resources correctly reference the Service
- ✅ **Validation**: Required fields validated based on networking method
- ✅ **Consistent UX**: Networking panels match the scaling panel design

---

## Phase 3: Build Resources ✅ COMPLETED

This phase adds support for building functions from source code using either Shipwright Build or OpenShift Source-to-Image (S2I).

### Goals
1. Support building functions from source instead of requiring pre-built images
2. Demonstrate multiple build system options (Shipwright, S2I)
3. Show how build resources compose alongside runtime resources
4. Make image derivation clear based on build method

### Build Options

Users can choose from three build methods:

1. **No Build** (default)
   - Use pre-built container image
   - User provides container image URL directly
   - No build resources created

2. **Shipwright Build**
   - Cloud-native build system
   - Git URL and revision
   - Build strategy selection (Node.js, Python, Go, Java, Ruby, PHP, .NET)
   - Output image specification

3. **OpenShift S2I (Source-to-Image)**
   - OpenShift-native build system
   - Git URL and revision
   - Builder image selection
   - Output to ImageStreamTag
   - Auto-constructs internal registry image reference

### Implementation

**New YAML Generators:**
- `generateShipwrightBuildYAML()` - Shipwright Build resources
- `generateS2IBuildConfigYAML()` - OpenShift BuildConfig resources

**Image Configuration:**
- Each build method manages its own image specification
- No Build: Container Image field (user-provided)
- Shipwright: Output Image field (build output destination)
- S2I: ImageStreamTag → auto-constructs internal registry reference

**Resources Created:**
Depending on build method, adds either:
- Shipwright Build CR, or
- OpenShift BuildConfig CR

Both include proper ownerReferences to Function CR.

### Success Criteria

- ✅ **Multiple build methods**: Supports no build, Shipwright, and S2I
- ✅ **Image derivation**: Image comes from build output, not separate config
- ✅ **Proper resource generation**: Build resources correctly reference source and output
- ✅ **Validation**: Required fields validated based on build method
- ✅ **Consistent UX**: Build panels match scaling/networking panel design
- ✅ **Edit workflow**: Build configuration preserved on edit

---

## Phase 4: Eventing Configuration ✅ COMPLETED

This phase adds support for CloudEvents subscriptions via Knative Eventing, using an AWS Lambda-style post-creation workflow.

### Goals
1. Enable functions to subscribe to CloudEvents from Knative Brokers
2. Demonstrate the separation of concerns: UI creates Function CR, controller creates Triggers
3. Add event subscriptions AFTER function creation (like AWS Lambda triggers)
4. Provide dropdown selection of common event types
5. Show how the Function controller manages eventing infrastructure

### User Flow

1. **Create Function** - Function is created without event subscriptions
2. **View Function Details** - After creation, user sees function detail view
3. **Add Event Subscriptions** - User clicks "Add event subscription" button
4. **Select Event Type** - Dialog shows dropdown with common event types or custom input
5. **Manage Subscriptions** - Add/remove subscriptions from detail view

This matches the AWS Lambda pattern where triggers are added after function creation.

### Implementation

**New Views:**
- **Function Detail View** - Shows function overview and event subscriptions
  - Function name, namespace, image
  - Scaling and networking configuration
  - Event subscriptions section with "Add event subscription" button
  - List of current subscriptions with remove buttons

**Event Subscription Dialog:**
- Broker name input
- Event type dropdown with common types:
  - GitHub events (push, pull_request)
  - Slack events (message, reaction)
  - Stripe events (payment.succeeded, payment.failed)
  - Example events (order.created, order.updated, user.registered)
  - Custom (user-provided event type)
- Custom event type input (shown when "Custom" selected)

**State Management:**
- Functions now have `eventSubscriptions` array: `[{broker, eventType}, ...]`
- Removed previous `eventingEnabled` and `eventingConfig` fields
- Event subscriptions can be added/removed after function creation

**Updated YAML Generators:**
- `generateFunctionYAML()` - Groups subscriptions by broker and generates Function CR
- Function CR aggregates event types by broker

**Key Architectural Decision:**
The UI does NOT create Knative Trigger resources. Instead:
- The UI creates the Function CR with event subscriptions declared
- The Function controller watches Function CRs
- The controller creates/manages Knative Triggers to route events from the broker to the function

This follows the Kubernetes operator pattern where the controller is responsible for managing lower-level resources based on the higher-level Function CR specification.

**Resources Created by UI:**
- Function CR with `spec.eventing.subscriptions` populated

**Resources Created by Function Controller:**
- Knative Trigger(s) (one per subscription, managed by controller)

### UI Components

**Function Detail View:**
- Function overview section
- Event Subscriptions section with:
  - "Add event subscription" button
  - List of current subscriptions
  - Remove button for each subscription

**Add Event Subscription Dialog:**
- **Broker Name** (text input, default: "default")
- **Event Type** (dropdown with predefined options + custom)
- **Custom Event Type** (text input, shown when "Custom" selected)

### Success Criteria

- ✅ **Post-creation workflow**: Event subscriptions added after function creation
- ✅ **AWS Lambda-style UX**: Matches familiar pattern of adding triggers
- ✅ **Event type selection**: Dropdown with common types, option for custom
- ✅ **Proper separation of concerns**: UI creates Function CR, controller creates Triggers
- ✅ **Function CR format**: Correctly declares event subscriptions in spec.eventing
- ✅ **Subscription management**: Add and remove subscriptions
- ✅ **Duplicate prevention**: Prevents adding duplicate subscriptions
- ✅ **Real-time updates**: Function CR YAML updates immediately

### Example Function CR with Eventing

Creating a function and adding two event subscriptions (GitHub push and Slack message):

```yaml
apiVersion: serverless.openshift.io/v1alpha1
kind: Function
metadata:
  name: my-function
  namespace: default
spec:
  eventing:
    subscriptions:
      - broker: default
        eventTypes:
          - com.github.push
          - com.slack.message
```

The Function controller will create Knative Trigger resources based on this specification to route CloudEvents from the "default" broker to the function for the specified event types.

---

## Phase 5: Event Sources and Brokers Management

This phase adds CRUD functionality for Event Sources and Brokers, creating a complete event-driven architecture management experience.

### Goals
1. Enable users to manage Brokers (Knative Eventing infrastructure)
2. Enable users to manage Event Sources (producers of CloudEvents)
3. Replace manual broker name input with dropdown selection
4. Show relationship between Event Sources → Brokers → Functions
5. Provide visual management similar to AWS Lambda triggers

### Data Model

**Broker:**
```javascript
{
  id: 'default-broker',
  name: 'default',
  namespace: 'default',
  deliveryConfig: {
    retry: 3,
    backoffPolicy: 'exponential', // or 'linear'
    backoffDelay: '1s'
  },
  createdAt: '...'
}
```

**Event Source:**
```javascript
{
  id: 'github-webhook-1',
  name: 'github-webhook',
  namespace: 'default',
  type: 'github', // github, slack, kafka, etc.
  broker: 'default', // which broker to send events to
  config: {
    // Type-specific configuration
    // For GitHub: repo URL, webhook secret, event types
    // For Kafka: bootstrap servers, topics, consumer group
    // etc.
  },
  eventTypes: ['com.github.push', 'com.github.pull_request'],
  createdAt: '...'
}
```

### UI Structure

**Navigation:**
- Add tabs/sections for: Functions | Brokers | Event Sources
- Allow users to switch between managing different resources

**Brokers List View:**
- Table showing: Name, Namespace, Event Sources Count, Functions Count, Actions
- Create Broker button
- Edit/Delete buttons per row
- Click broker name to view details

**Broker Detail View:**
- Broker overview (name, namespace, delivery config)
- List of Event Sources sending to this broker
- List of Functions subscribed to this broker
- Composed resources (Broker CR, maybe ConfigMap for delivery)

**Broker Form (Create/Edit):**
- Name, Namespace
- Delivery configuration (retry, backoff policy, backoff delay)
- Auto-generate Broker CR YAML

**Event Sources List View:**
- Table showing: Name, Type, Broker, Event Types, Actions
- Create Event Source button
- Edit/Delete buttons per row
- Click event source name to view details

**Event Source Detail View:**
- Event source overview (name, type, broker, config)
- Event types produced
- Functions that subscribe to these event types
- Composed resources (varies by type: GitHubSource, KafkaSource, etc.)

**Event Source Form (Create/Edit):**
- Name, Namespace
- Type (dropdown: GitHub, Slack, Kafka, RabbitMQ, Cron, etc.)
- Broker (dropdown: select from existing brokers)
- Type-specific configuration fields
- Event types (multi-select or text input)
- Auto-generate Event Source CR YAML

### Event Subscription Workflow Changes

**Before (Phase 4):**
- User types broker name manually
- User selects/types event type
- UI creates Function CR with subscriptions

**After (Phase 5):**
- User selects broker from dropdown (populated from existing brokers)
- User selects/types event type
- UI shows which Event Sources produce these event types
- UI creates Function CR with subscriptions

### Implementation Steps

1. **Update `state.js`**
   - Add brokers array with sample data
   - Add eventSources array with sample data
   - Add CRUD functions for brokers
   - Add CRUD functions for event sources

2. **Create navigation/tabs**
   - Add tab navigation to switch between Functions/Brokers/Event Sources
   - Update routing to show appropriate view

3. **Implement Brokers CRUD**
   - Create brokers list view (HTML + CSS)
   - Create broker form view (HTML + CSS)
   - Create broker detail view (HTML + CSS)
   - Add JavaScript handlers for CRUD operations
   - Add Broker CR YAML generator in templates.js

4. **Implement Event Sources CRUD**
   - Create event sources list view (HTML + CSS)
   - Create event source form view (HTML + CSS)
   - Create event source detail view (HTML + CSS)
   - Add JavaScript handlers for CRUD operations
   - Add Event Source CR YAML generators (GitHubSource, KafkaSource, etc.) in templates.js

5. **Update Event Subscription UI**
   - Change broker input to dropdown
   - Populate dropdown from existing brokers
   - Show warning if no brokers exist
   - Add "Create Broker" quick link

6. **Update Function Detail View**
   - Show which Event Sources are connected
   - Show broker information for each subscription
   - Update diagram to show full flow: Event Source → Broker → Function

### Event Source Types

Support these common event source types:

1. **GitHub Source**
   - Repository URL
   - Webhook secret
   - Event types (push, pull_request, issues, etc.)

2. **Kafka Source**
   - Bootstrap servers
   - Topics
   - Consumer group

3. **Slack Source**
   - Webhook URL
   - Event types (message, reaction, etc.)

4. **Cron Source**
   - Schedule (cron expression)
   - Data payload

5. **Custom Source**
   - User-defined YAML configuration

### Resources Generated

**Broker CR:**
```yaml
apiVersion: eventing.knative.dev/v1
kind: Broker
metadata:
  name: default
  namespace: default
spec:
  delivery:
    retry: 3
    backoffPolicy: exponential
    backoffDelay: 1s
```

**GitHub Source CR:**
```yaml
apiVersion: sources.knative.dev/v1
kind: GitHubSource
metadata:
  name: github-webhook
  namespace: default
spec:
  eventTypes:
    - push
    - pull_request
  repository: username/repo
  accessToken:
    secretKeyRef:
      name: github-secret
      key: accessToken
  sink:
    ref:
      apiVersion: eventing.knative.dev/v1
      kind: Broker
      name: default
```

**Kafka Source CR:**
```yaml
apiVersion: sources.knative.dev/v1beta1
kind: KafkaSource
metadata:
  name: kafka-source
  namespace: default
spec:
  consumerGroup: my-consumer-group
  bootstrapServers:
    - kafka:9092
  topics:
    - my-topic
  sink:
    ref:
      apiVersion: eventing.knative.dev/v1
      kind: Broker
      name: default
```

### Success Criteria

- ✅ **Brokers CRUD**: Create, list, view, edit, and delete brokers
- ✅ **Event Sources CRUD**: Create, list, view, edit, and delete event sources
- ✅ **Broker dropdown**: Event subscription form uses dropdown instead of text input
- ✅ **Event source types**: Support at least 5 event source types
- ✅ **Proper YAML generation**: Generate valid Knative Eventing CRs
- ✅ **Visual relationships**: Show connections between Event Sources, Brokers, and Functions
- ✅ **Navigation**: Easy switching between managing different resource types

---

## Future Phases

- **Phase 6**: Complete composition view with all resource types
- **Phase 7**: Status aggregation and resource health visualization
- **Phase 8**: Advanced features (secrets, configmaps, volumes, environment variables)


TODO: 
- Ok, now... Let's do this... In the triggers section, we shouldn't show events in a dropdown directly. Instead, we should show sources / brokers first. Then the event types they publish in their status. Since we don't actually have any  
