### Event sources

[event_delivery.md](event_delivery.md) describes how to deliver events to functions by subscribing to events from a broker.

This would not allow us to show a direct connection from the event source to the function, though.
Other serverless functions platforms (e.g. AWS Lambda) allow configuring event sources directly on the function.

To support that, we can have 2 approaches:
A. Using a higher level abstraction (CRD) to represent event subscriptions, which would create the sources and triggers behind the scenes.
B. Using annotations or spec fields on the Function resource to represent event sources directly.


### Approach A

##### With source details in the Subscription - dynamic data field

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
  name: my-function-subscription
spec:
  subscriber:
    ref:
      apiVersion: foo.bar/v1
      kind: Function
      name: my-function
  eventSource:
    kind: KafkaSource
    name: my-kafka-source
    data:                                 # --> dynamic data field
      bootstrapServers: kafka-broker:9092
      topics:
        - my-topic
      consumerGroup: my-consumer-group
```

What's achieved?
- The user can define event subscriptions directly on the Function platform API.
- UI can show a direct connection from the event source to the function.
- No Knative Eventing knowledge needed from the user.

Cons:
- The Subscription controller needs to handle creating the actual Knative Eventing sources based on the dynamic data field.
- Dynamic schema validation for the data field based on the event source kind - bad UX.
- Can't use a single event source to deliver events to multiple functions (duplication of event source definitions).

##### Without source details in the Subscription - reference only

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
  name: my-function-subscription
spec:
  subscriber:
    ref:
      apiVersion: foo.bar/v1
      kind: Function
      name: my-function
  eventSource:
    kind: KafkaSource
    name: my-kafka-source
---
apiVersion: sources.knative.dev/v1beta1
kind: KafkaSource
metadata:
  name: my-kafka-source
spec:
  bootstrapServers: kafka-broker:9092
  topics:
    - my-topic
  consumerGroup: my-consumer-group
```

What's achieved?
- The user can define event subscriptions directly on the Function platform API.
- UI can show a direct connection from the event source to the function.
- Eventing sources can be reused for multiple functions.

Cons:
- The user still needs to define the Knative Eventing source separately. What's the point of having the Subscription CRD then?


### Approach B

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
    name: my-function-subscription
spec:
    subscriber:
        ref:
            apiVersion: foo.bar/v1
            kind: Function
            name: my-function
        ...
```

DOESN'T MAKE SENSE! YAML INCOMPLETE.

