# Getting Started

The key functions are [`sync_get_video`](@ref), [`sync_get_depth`](@ref), and
[`sync_get_pointcloud`](@ref). Each of these has a memory-safe Julia wrapper
which will return an array.

To display the returned array as an image, refer to [Displaying
Images](displaying_images.md).

Sometimes `libfreenect` doesn't connect to the Kinect immediately. I find it
helpful to try to set the LED until it makes a connection.

## Quickstart Example

```julia
using Freenect

kinect_idx = 0

while sync_set_led(green, kinect_idx) != 0
    sleep(0.5)
end

sync_set_led(blink_red_yellow, kinect_idx)
sleep(1)

sync_set_tilt_degs(10, kinect_idx)
sleep(1)

sync_set_tilt_degs(0, kinect_idx)
sleep(1)

image, image_timestamp = sync_get_video(kinect_idx, video_rgb)
depth, depth_timestamp = sync_get_depth(kinect_idx, depth_11bit)
cloud, cloud_timestamp = sync_get_pointcloud(kinect_idx)
```