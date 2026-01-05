# Fake UI Implementation Plan

## Overview
Create a simple web-based prototype UI that demonstrates the Function composition concept described in `002/spec/README.md`. The UI will be built in phases, with each phase focusing on a specific aspect of the composition.

## Phase 1: Scaling (Runtime + KEDA HTTPScaledObject)

This phase demonstrates the UI as a composition layer. Users define a Function with scaling preferences, and the UI creates multiple Kubernetes resources.

### Goals
1. Demonstrate the UI as the **composition layer** that prevents API soup
2. Show user perspective: simple "Create Function" form
3. Show platform perspective: UI creates Deployment, Service, and HTTPScaledObject
4. Keep it simple and focused on the scaling/runtime aspect only

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

Two collapsible panels with integrated radio buttons in headers:

*Concurrency Panel:*
- Panel header contains: radio button + collapse icon + "Concurrency"
- When selected/clicked: panel expands, shows:
  - **Target Concurrent Requests** (number input, default: 100)
  - Helper text: "Target number of concurrent requests per instance"

*Request Rate Panel:*
- Panel header contains: radio button + collapse icon + "Request Rate"
- When selected/clicked: panel expands, shows:
  - **Target Request Rate** (number input, default: 100)
    - Helper text: "Target requests per second"
  - **Aggregation Window** (text input, default: "1m")
    - Helper text: "Time window for aggregating metrics (e.g., '1m', '30s')"
  - **Metric Granularity** (text input, default: "1s")
    - Helper text: "Granularity for metric calculation (e.g., '1s', '500ms')"

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

3. **HTTPScaledObject** (http.keda.sh/v1alpha1)
   - Shows: `my-function-http` HTTPScaledObject
   - Label: `serverless.openshift.io/function: my-function`
   - Spec: scaleTargetRef, scalingMetric (concurrency)

Each card:
- Shows resource type and name
- Expandable to show full YAML
- Highlights the label `serverless.openshift.io/function`
- Shows ownerReference pointing to Function CR (conceptual for Phase 1)

## User Flow (Phase 1)

1. User fills in the "Create Function" form (simple, high-level fields)
2. User clicks "Create Function"
3. UI shows:
   - Top panel: "You created a Function" (user perspective)
   - Bottom panel: 3 Kubernetes resources that were composed (platform perspective)
4. User can expand each resource card to see the generated YAML
5. **Key insight**: User never had to understand Deployment, Service, or HTTPScaledObject APIs

## Key Design Decisions (Phase 1)

### What to Include
- ✅ Simple "Create Function" form (user perspective)
- ✅ YAML generation for 3 resources: Deployment, Service, HTTPScaledObject
- ✅ Clear visual distinction: "What User Thinks" vs "What UI Creates"
- ✅ Labels and ownerReferences visualization
- ✅ Expandable resource cards
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
- ✅ **Abstraction boundary**: User thinks "Function", platform sees "Deployment + Service + HTTPScaledObject"
- ✅ **No API soup**: User doesn't need to understand 3 different API groups
- ✅ **Resource relationships**: All resources share the same label
- ✅ **Generated YAMLs are valid**: Properly formatted and follow K8s conventions

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

## Future Phases (Not in Phase 1)

- **Phase 2**: Build resources (Shipwright Build)
- **Phase 3**: Runtime resources (Deployment, Service)
- **Phase 4**: Eventing resources (Function CR, Trigger)
- **Phase 5**: Networking resources (HTTPRoute)
- **Phase 6**: Complete composition view with all resources