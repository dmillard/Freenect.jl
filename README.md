# Freenect

[![Stable](https://img.shields.io/badge/docs-stable-blue.svg)](https://dmillard.github.io/Freenect.jl/stable)
[![Dev](https://img.shields.io/badge/docs-dev-blue.svg)](https://dmillard.github.io/Freenect.jl/dev)
[![Build Status](https://github.com/dmillard/Freenect.jl/workflows/CI/badge.svg)](https://github.com/dmillard/Freenect.jl/actions)
[![Coverage](https://codecov.io/gh/dmillard/Freenect.jl/branch/master/graph/badge.svg)](https://codecov.io/gh/dmillard/Freenect.jl)

Freenect.jl is a wrapper around the [libfreenect](https://github.com/OpenKinect/libfreenect) open source Microsoft Kinect driver.

This package only supports Kinect v1, which comes from the XBox 360 era.

You do not need libfreenect installed to use Freenect.jl, you can just do
```julia
using Pkg
Pkg.add("Freenect")
```