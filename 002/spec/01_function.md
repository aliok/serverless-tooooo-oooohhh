### Function

```yaml
apiVersion: foo.bar/v1
kind: Function
metadata:
  name: my-function
  namespace: default
spec:
  subscriptions:
    - broker: default
      eventTypes: 
        - com.github.push
        - com.slack.message
  sink:
    ref:
      apiVersion: serving.knative.dev/v1
      kind: Service
      name: my-function-service
status:
  address:
    url: http://my-function.default.svc.cluster.local
  resources:
    build:
      ref:
        apiVersion: shipwright.io/v1beta1
        kind: Build
        name: my-function-build
    deployment:
      ref:
        apiVersion: apps/v1
        kind: Deployment
        name: my-function-deployment
    scaler:
      ref:
        apiVersion: keda.sh/v1alpha1
        kind: HttpScaledObject
        name: my-function-httpscaledobject
    service:
      ref:
        apiVersion: v1
        kind: Service
        name: my-function-service
    ingress:
      ref:
        apiVersion: networking.k8s.io/v1
        kind: Ingress
        name: my-function-ingress
  conditions:
    - type: Ready
      status: "True"
    - type: BuildSucceeded
      status: "True"
    - type: DeploymentReady
      status: "True"
    - type: AutoscalerReady
      status: "True"
    - type: EventSubscriptionsReady
      status: "True"
    - type: ResourcesReady
      status: "True"
    - type: NetworkReady
      status: "True"
    - type: BuildInProgress
      status: "False"
```

