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

"""
$(TYPEDSIGNATURES)

Helper for getting a pointcloud from the camera at `index`.

The resulting point cloud is relative to the camera, with X forward, Y left,
and Z up.

This function uses a fixed homography matrix - you may have better results
for your own hardware by calibrating your Kinect.
"""
function sync_get_pointcloud(index::Integer)
    depth, timestamp = sync_get_depth(index, depth_11bit)
    cloud = zeros((3, 480, 640))
    for i ∈ 1:480, j ∈ 1:640
        uvw = Float64[j - 1, i - 1, depth[i, j], 1.0]
        xyzw = world_X_depth * uvw
        cloud[:, i, j] .= xyzw[1:3] ./ xyzw[4]
    end

    return cloud, timestamp
end
export sync_get_pointcloud