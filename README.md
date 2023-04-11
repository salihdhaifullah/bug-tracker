# Vue.js and .NET 6 web api Bug-tracker

## to build
```sh
docker build -t bug-tracker .
```

## to inspect image
```sh
docker run -it --rm --entrypoint /bin/sh bug-tracker
```

## to run
```sh
docker run -d -p 5000:5000 bug-tracker
```
