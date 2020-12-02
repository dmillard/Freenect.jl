function compute_world_X_depth()
    # These values are rather undocumented and come from the source of the
    # glpclview example in libfreenect.
    fx = 594.21
    fy = 591.04
    a = -0.0030711
    b = 3.3309495
    cx = 339.5
    cy = 242.7
    W = [1 / fx 0       0  -cx / fx
         0      -1 / fy 0  cy / fy
         0      0       0  -1
         0      0       a  b]
    P = [ 0.  0. -1.  0.
         -1.  0.  0.  0.
          0.  1.  0.  0.
          0.  0.  0.  1.]

    return P * W
end
const world_X_depth = compute_world_X_depth()

function sync_get_pointcloud(index::Integer)
    depth, timestamp = sync_get_depth(index, depth_11bit)
    cloud = zeros((3, 640, 480))
    for i ∈ 1:480, j ∈ 1:640
        uvw = Float64[j - 1, i - 1, depth[i, j], 1.0]
        xyzw = world_X_depth * uvw
        cloud[:, j, i] .= xyzw[1:3] ./ xyzw[4]
    end

    return cloud, timestamp
end
export sync_get_pointcloud