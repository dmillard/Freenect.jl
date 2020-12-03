module Freenect

using libfreenect_jll
using DocStringExtensions

include("./export_utils.jl")
include("./freenect_sync.jl")
include("./pointcloud.jl")

end