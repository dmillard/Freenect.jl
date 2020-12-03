# Installation

`libfreenect` is a userspace driver, and is included in the Julia
[Yggdrasil](https://github.com/JuliaPackaging/Yggdrasil) package tree as
`libfreenect_jll`. The upshot of this is that you do _not_ need `libfreenect`
installed on your system to use Freenect.jl, and can just install with

```julia
using Pkg
Pkg.add("Freenect")
```