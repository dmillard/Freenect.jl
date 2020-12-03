var documenterSearchIndex = {"docs":
[{"location":"getting_started/#Getting-Started","page":"Getting Started","title":"Getting Started","text":"","category":"section"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"The key functions are sync_get_video, sync_get_depth, and sync_get_pointcloud. Each of these has a memory-safe Julia wrapper which will return an array.","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"To display the returned array as an image, refer to Displaying Images.","category":"page"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"Sometimes libfreenect doesn't connect to the Kinect immediately. I find it helpful to try to set the LED until it makes a connection.","category":"page"},{"location":"getting_started/#Quickstart-Example","page":"Getting Started","title":"Quickstart Example","text":"","category":"section"},{"location":"getting_started/","page":"Getting Started","title":"Getting Started","text":"using Freenect\n\nkinect_idx = 0\n\nwhile sync_set_led(green, kinect_idx) != 0\n    sleep(0.5)\nend\n\nsync_set_led(blink_red_yellow, kinect_idx)\nsleep(1)\n\nsync_set_tilt_degs(10, kinect_idx)\nsleep(1)\n\nsync_set_tilt_degs(0, kinect_idx)\nsleep(1)\n\nimage, image_timestamp = sync_get_video(kinect_idx, video_rgb)\ndepth, depth_timestamp = sync_get_depth(kinect_idx, depth_11bit)\ncloud, cloud_timestamp = sync_get_pointcloud(kinect_idx)","category":"page"},{"location":"displaying_images/#Displaying-Images","page":"Displaying Images","title":"Displaying Images","text":"","category":"section"},{"location":"displaying_images/","page":"Displaying Images","title":"Displaying Images","text":"Freenect.jl doesn't come with any image-specific utilities out of the box, it only returns arrays of data.","category":"page"},{"location":"displaying_images/","page":"Displaying Images","title":"Displaying Images","text":"Here are some examples of using the JuliaImages suite to display data from the Kinect.","category":"page"},{"location":"displaying_images/","page":"Displaying Images","title":"Displaying Images","text":"Before running these examples, be sure to install the relevant packages:","category":"page"},{"location":"displaying_images/","page":"Displaying Images","title":"Displaying Images","text":"using Pkg\nPkg.add(\"Images\")\nPkg.add(\"ImageView\")","category":"page"},{"location":"displaying_images/#RGB-Image","page":"Displaying Images","title":"RGB Image","text":"","category":"section"},{"location":"displaying_images/","page":"Displaying Images","title":"Displaying Images","text":"using Freenect, Images, ImageView\n\nimage, timestamp = sync_get_video(0, video_rgb)\nimshow(colorview(RGB, image ./ 255))","category":"page"},{"location":"displaying_images/","page":"Displaying Images","title":"Displaying Images","text":"(Image: RGB Image)","category":"page"},{"location":"displaying_images/#Infrared-Image","page":"Displaying Images","title":"Infrared Image","text":"","category":"section"},{"location":"displaying_images/","page":"Displaying Images","title":"Displaying Images","text":"using Freenect, Images, ImageView\n\nimage, timestamp = sync_get_video(0, video_ir_8bit)\nimshow(colorview(Gray, image ./ 255))","category":"page"},{"location":"displaying_images/","page":"Displaying Images","title":"Displaying Images","text":"(Image: Infrared Image)","category":"page"},{"location":"displaying_images/#Depth-Image","page":"Displaying Images","title":"Depth Image","text":"","category":"section"},{"location":"displaying_images/","page":"Displaying Images","title":"Displaying Images","text":"These images often appear washed out when directly visualized, and anything below the minimum range appears in white.","category":"page"},{"location":"displaying_images/","page":"Displaying Images","title":"Displaying Images","text":"using Freenect, Images, ImageView\n\ndepth, timestamp = sync_get_depth(0, depth_11bit)\nimshow(colorview(Gray, depth ./ 2^11))","category":"page"},{"location":"displaying_images/","page":"Displaying Images","title":"Displaying Images","text":"(Image: Depth Image)","category":"page"},{"location":"displaying_images/#Point-Cloud-Image","page":"Displaying Images","title":"Point Cloud Image","text":"","category":"section"},{"location":"displaying_images/","page":"Displaying Images","title":"Displaying Images","text":"While direct XYZ to RGB isn't the cleanest visualizer, it works in a pinch.","category":"page"},{"location":"displaying_images/","page":"Displaying Images","title":"Displaying Images","text":"using Freenect, Images, ImageView\n\ncloud, timestamp = sync_get_pointcloud(0)\nimshow(colorview(RGB, cloud))","category":"page"},{"location":"displaying_images/","page":"Displaying Images","title":"Displaying Images","text":"(Image: Point Cloud Image)","category":"page"},{"location":"installation/#Installation","page":"Installation","title":"Installation","text":"","category":"section"},{"location":"installation/","page":"Installation","title":"Installation","text":"libfreenect is a userspace driver, and is included in the Julia Yggdrasil package tree as libfreenect_jll. The upshot of this is that you do not need libfreenect installed on your system to use Freenect.jl, and can just install with","category":"page"},{"location":"installation/","page":"Installation","title":"Installation","text":"using Pkg\nPkg.add(\"Freenect\")","category":"page"},{"location":"reference/","page":"Reference","title":"Reference","text":"CurrentModule = Freenect","category":"page"},{"location":"reference/#Reference","page":"Reference","title":"Reference","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"","category":"page"},{"location":"reference/","page":"Reference","title":"Reference","text":"Modules = [Freenect]","category":"page"},{"location":"reference/#Freenect.DepthFormat","page":"Reference","title":"Freenect.DepthFormat","text":"See http://openkinect.org/wiki/Protocol_Documentation#RGB_Camera for more information.\n\n\n\n\n\n","category":"type"},{"location":"reference/#Freenect.LEDMode","page":"Reference","title":"Freenect.LEDMode","text":"Available modes for the LED on the Kinect.\n\n\n\n\n\n","category":"type"},{"location":"reference/#Freenect.RawTiltState","page":"Reference","title":"Freenect.RawTiltState","text":"struct RawTiltState\n\naccelerometer_x::Int16\naccelerometer_y::Int16\naccelerometer_z::Int16\ntilt_angle::Int8\ntilt_status::Int8\n\nThis data is currently uninterpreted and only provided raw.\n\n\n\n\n\n","category":"type"},{"location":"reference/#Freenect.Resolution","page":"Reference","title":"Freenect.Resolution","text":"Enumeration of available resolutions. Not all available resolutions are actually supported for all video formats. Frame modes may not perfectly match resolutions.  For instance, resolution_medium is 640x488 for the IR camera.\n\n\n\n\n\n","category":"type"},{"location":"reference/#Freenect.TiltStatusCode","page":"Reference","title":"Freenect.TiltStatusCode","text":"Possible status codes returned in RawTiltState.\n\n\n\n\n\n","category":"type"},{"location":"reference/#Freenect.VideoFormat","page":"Reference","title":"Freenect.VideoFormat","text":"See http://openkinect.org/wiki/Protocol_Documentation#RGB_Camera for more information.\n\n\n\n\n\n","category":"type"},{"location":"reference/#Freenect.sync_get_depth-NTuple{4,Any}","page":"Reference","title":"Freenect.sync_get_depth","text":"sync_get_depth(depth::Any, timestamp::Any, index::Any, fmt::Any) -> Int32\n\n\nDoes the exact same as sync_get_depth_with_res, with a default resolution of resolution_medium.\n\n\n\n\n\n","category":"method"},{"location":"reference/#Freenect.sync_get_depth-Tuple{Integer,DepthFormat}","page":"Reference","title":"Freenect.sync_get_depth","text":"sync_get_depth(index::Integer, fmt::DepthFormat) -> Tuple{Array{UInt16,2},Int64}\n\n\nSynchronous depth function with resolution resolution_medium, starts the runloop if it isn't running.\n\nThe returned array is copied before returning and is safe to store.\n\n\n\n\n\n","category":"method"},{"location":"reference/#Freenect.sync_get_depth_with_res-NTuple{5,Any}","page":"Reference","title":"Freenect.sync_get_depth_with_res","text":"sync_get_depth_with_res(depth::Any, timestamp::Any, index::Any, res::Any, fmt::Any) -> Int32\n\n\nSynchronous depth function, starts the runloop if it isn't running\n\nIn the raw pointer version, the returned buffer is valid until this function is called again, after which the buffer must not be used again. Make a copy if the data is required. The version returning an array does not have this limitation.\n\n\n\n\n\n","category":"method"},{"location":"reference/#Freenect.sync_get_depth_with_res-Tuple{Integer,Resolution,DepthFormat}","page":"Reference","title":"Freenect.sync_get_depth_with_res","text":"sync_get_depth_with_res(index::Integer, res::Resolution, fmt::DepthFormat) -> Tuple{Array{UInt16,2},Int64}\n\n\nSynchronous depth function, starts the runloop if it isn't running.\n\nThe returned array is copied before returning and is safe to store.\n\n\n\n\n\n","category":"method"},{"location":"reference/#Freenect.sync_get_pointcloud-Tuple{Integer}","page":"Reference","title":"Freenect.sync_get_pointcloud","text":"sync_get_pointcloud(index::Integer) -> Tuple{Array{Float64,3},Int64}\n\n\nHelper for getting a pointcloud from the camera at index.\n\nThe resulting point cloud is relative to the camera, with X forward, Y left, and Z up.\n\nThis function uses a fixed homography matrix - you may have better results for your own hardware by calibrating your Kinect.\n\n\n\n\n\n","category":"method"},{"location":"reference/#Freenect.sync_get_tilt_state-Tuple{Any,Any}","page":"Reference","title":"Freenect.sync_get_tilt_state","text":"sync_get_tilt_state(state::Any, index::Any) -> Int32\n\n\nTilt state function, starts the runloop if it isn't running.\n\nThe returned pointer is only safe until the next call to this function.\n\n\n\n\n\n","category":"method"},{"location":"reference/#Freenect.sync_get_tilt_state-Tuple{Integer}","page":"Reference","title":"Freenect.sync_get_tilt_state","text":"sync_get_tilt_state(index::Integer) -> RawTiltState\n\n\nTilt state function, starts the runloop if it isn't running.\n\nThe returned RawTiltState struct is safe to store.\n\n\n\n\n\n","category":"method"},{"location":"reference/#Freenect.sync_get_video-NTuple{4,Any}","page":"Reference","title":"Freenect.sync_get_video","text":"sync_get_video(video::Any, timestamp::Any, index::Any, fmt::Any) -> Int32\n\n\nDoes the exact same as sync_get_video_with_res, with a default resolution of resolution_medium.\n\n\n\n\n\n","category":"method"},{"location":"reference/#Freenect.sync_get_video-Tuple{Integer,VideoFormat}","page":"Reference","title":"Freenect.sync_get_video","text":"sync_get_video(index::Integer, fmt::VideoFormat) -> Tuple{Any,Int64}\n\n\nSynchronous video function with resolution resolution_medium, starts the runloop if it isn't running.\n\nThe returned array is copied before returning and is safe to store.\n\n\n\n\n\n","category":"method"},{"location":"reference/#Freenect.sync_get_video_with_res-NTuple{5,Any}","page":"Reference","title":"Freenect.sync_get_video_with_res","text":"sync_get_video_with_res(video::Any, timestamp::Any, index::Any, res::Any, fmt::Any) -> Int32\n\n\nSynchronous video function, starts the runloop if it isn't running\n\nThe returned buffer is valid until this function is called again, after which the buffer must not be used again. Make a copy if the data is required.\n\n\n\n\n\n","category":"method"},{"location":"reference/#Freenect.sync_get_video_with_res-Tuple{Integer,Resolution,VideoFormat}","page":"Reference","title":"Freenect.sync_get_video_with_res","text":"sync_get_video_with_res(index::Integer, res::Resolution, fmt::VideoFormat) -> Tuple{Any,Int64}\n\n\nSynchronous video function, starts the runloop if it isn't running.\n\nThe returned array is copied before returning and is safe to store.\n\n\n\n\n\n","category":"method"},{"location":"reference/#Freenect.sync_set_led-Tuple{Any,Any}","page":"Reference","title":"Freenect.sync_set_led","text":"sync_set_led(led::Any, index::Any) -> Int32\n\n\nSet the LED to the given mode, starts the runloop if it isn't running.\n\n\n\n\n\n","category":"method"},{"location":"reference/#Freenect.sync_set_tilt_degs-Tuple{Any,Any}","page":"Reference","title":"Freenect.sync_set_tilt_degs","text":"sync_set_tilt_degs(angle::Any, index::Any) -> Int32\n\n\nTilt the kinect to angle. Starts the runloop if it isn't running.\n\n\n\n\n\n","category":"method"},{"location":"#Freenect.jl","page":"Home","title":"Freenect.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Freenect.jl is a wrapper around the libfreenect open source Microsoft Kinect driver.","category":"page"},{"location":"","page":"Home","title":"Home","text":"This package only supports Kinect v1, which comes from the XBox 360 era.","category":"page"},{"location":"#Acknowledgements","page":"Home","title":"Acknowledgements","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The development of this software was supported in part by the NASA Space Technology Research Fellowship, grant number 80NSSC19K1182.","category":"page"}]
}
