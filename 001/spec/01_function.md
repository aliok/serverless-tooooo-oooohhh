### Function with externally built image

```yaml
apiVersion: foo.bar/v1
kind: Function
metadata:
  name: my-function
  namespace: default
spec:
  image: registry.example.com/my-function:latest
```
