### Subscribing a Function to a specific event type

Old school, no mystery.
Binding a Function to a specific event type using a Knative Eventing Triggers.

The `Function` type should be an `Addressable`. 

All event delivery features would be the same, like retries, dead letter sinks, etc.

```yaml
apiVersion: foo.bar/v1
kind: Function
metadata:
  name: my-function
  namespace: default
spec:
  ...
---
apiVersion: eventing.knative.dev/v1
kind: Trigger
metadata:
  name: my-function-trigger
spec:
  broker: default
  subscriber:
    ref:
      apiVersion: foo.bar/v1
      kind: Function
      name: my-function
  filter:
    attributes:
      type: com.example.specific-event-type
  # or, new syntax:
  filters:
    - exact:
        type: com.github.push
```

Alternative idea #1:
- Alternatively, we can create a pseudo CRD with the `foo.bar/v1` API group to represent event subscriptions. That CRD controller would create the Knative Trigger behind the scenes.
- Reason for that can be:
  - Better UX for users of the Function platform, instead of an API Soup.
  - Maybe omitting some details that are not relevant for the function user (e.g. broker name).

```yaml
apiVersion: foo.bar/v1
kind: Function
metadata:
  name: my-function
  namespace: default
spec:
  ...
---
apiVersion: foo.bar/v1
kind: Subscription
metadata:
  name: my-function-trigger
spec:
  subscriber:
    ref:
      apiVersion: foo.bar/v1
      kind: Function
      name: my-function
  filter:
    attributes:
      type: com.example.specific-event-type
```

Alternative idea #2:
- Another idea is to add something like an `eventSubscriptions` field to the `Function` spec.
- That field would be a list of event subscription definitions.
- The Function controller would then create the necessary Knative Triggers based on that list.

```yaml
apiVersion: foo.bar/v1
kind: Function
metadata:
  name: my-function
  namespace: default
spec:
  eventSubscriptions:
   -  broker: default
      attributes:
        type: com.example.specific-event-type
```

