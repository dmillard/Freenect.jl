"""
Available modes for the LED on the Kinect.
"""
@exported_enum LEDMode begin
    off = 0
    green = 1
    red = 2
    yellow = 3
    blink_green = 4
    blink_red_yellow = 6
end

"""
Enumeration of available resolutions.
Not all available resolutions are actually supported for all video formats.
Frame modes may not perfectly match resolutions.  For instance,
`resolution_medium` is 640x488 for the IR camera.
"""
@exported_enum Resolution begin
    resolution_low = 0 # QVGA - 320 x 240
    resolution_medium = 1 # VGA - 640 x 480
    resolution_high = 2 # SXGA - 1280x1024
end

const resolution_to_dims = Dict{Resolution,NTuple{2,Int}}(
    resolution_low => (240, 320),
    resolution_medium => (480, 640),
    resolution_high => (1024, 1280)
)

"""
See <http://openkinect.org/wiki/Protocol_Documentation#RGB_Camera> for more information.
"""
@exported_enum VideoFormat begin
    video_rgb = 0 # Decompressed RGB mode (demosaicing done by libfreenect)
    video_bayer = 1 # Bayer compressed mode (raw information from camera)
    video_ir_8bit = 2 # 8-bit IR mode
    video_ir_10bit = 3 # 10-bit IR mode
    video_ir_10bit_packed = 4 # 10-bit packed IR mode
    video_yuv_rgb = 5 # YUV RGB mode
    video_yuv_raw = 6 # YUV Raw mode 
end

const video_format_to_channels = Dict{VideoFormat,Int}(
    video_rgb => 3,
    video_ir_8bit => 1,
    # I haven't used the other modes enough to wrap them. Contributions welcome!
)

"""
See http://openkinect.org/wiki/Protocol_Documentation#RGB_Camera for more information.
"""
@exported_enum DepthFormat begin
    depth_11bit = 0 # 11 bit depth information in one uint16_t/pixel
    depth_10bit = 1 # 10 bit depth information in one uint16_t/pixel
    depth_11bit_packed = 2 # 11 bit packed depth information
    depth_10bit_packed = 3 # 10 bit packed depth information
    depth_registered = 4 # processed depth data in mm, aligned to 640x480 rgb
    depth_mm = 5 # depth to each pixel in mm, but left unaligned to rgb image
end

const wrappable_depth_formats = Set{DepthFormat}([
    depth_11bit,
    depth_10bit,
    depth_registered,
    depth_mm,
    # I haven't used the other modes enough to wrap them. Contributions welcome!
])

"""
Possible status codes returned in [`RawTiltState`](@ref).
"""
@exported_enum TiltStatusCode begin
    tilt_status_stopped = 0x00
    tilt_status_limit = 0x01
    tilt_status_moving = 0x04
end

"""
$(TYPEDEF)

$(TYPEDFIELDS)

This data is currently uninterpreted and only provided raw.
"""
struct RawTiltState
    accelerometer_x::Cshort
    accelerometer_y::Cshort
    accelerometer_z::Cshort
    tilt_angle::Cchar
    tilt_status::Cchar
end
import Base.copy
copy(s::RawTiltState) = RawTiltState(s.accelerometer_x, s.accelerometer_y, s.accelerometer_z, s.tilt_angle, s.tilt_status)
export RawTiltState

# These are just a thin wrapper around the ccall

@exported_cfun begin
    """
    $(TYPEDSIGNATURES)

    Synchronous video function, starts the runloop if it isn't running

    The returned buffer is valid until this function is called again, after
    which the buffer must not be used again. Make a copy if the data is
    required.
    """
    sync_get_video_with_res(video::Ref{Ptr{Cvoid}}, timestamp::Ref{Cuint}, index::Cint, res::Cint, fmt::Cint)::Cint
end

@exported_cfun begin
    """
    $(TYPEDSIGNATURES)

    Does the exact same as [`sync_get_video_with_res`](@ref), with a default
    resolution of `resolution_medium`.
    """
    sync_get_video(video::Ref{Ptr{Cvoid}}, timestamp::Ref{Cuint}, index::Cint, fmt::Cint)::Cint
end

@exported_cfun begin
    """
    $(TYPEDSIGNATURES)

    Synchronous depth function, starts the runloop if it isn't running

    In the raw pointer version, the returned buffer is valid until this
    function is called again, after which the buffer must not be used again.
    Make a copy if the data is required. The version returning an array does
    not have this limitation.
    """
    sync_get_depth_with_res(depth::Ref{Ptr{Cvoid}}, timestamp::Ref{Cuint}, index::Cint, res::Cint, fmt::Cint)::Cint
end

@exported_cfun begin
    """
    $(TYPEDSIGNATURES)

    Does the exact same as [`sync_get_depth_with_res`](@ref), with a default
    resolution of `resolution_medium`.
    """
    sync_get_depth(depth::Ref{Ptr{Cvoid}}, timestamp::Ref{Cuint}, index::Cint, fmt::Cint)::Cint
end

@exported_cfun begin
    """
    $(TYPEDSIGNATURES)

    Tilt the kinect to `angle`. Starts the runloop if it isn't running.
    """
    sync_set_tilt_degs(angle::Cint, index::Cint)::Cint
end

@exported_cfun begin
    """
    $(TYPEDSIGNATURES)

    Tilt state function, starts the runloop if it isn't running.

    The returned pointer is only safe until the next call to this function.
    """
    sync_get_tilt_state(state::Ref{Ptr{RawTiltState}}, index::Cint)::Cint
end

@exported_cfun begin
    """
    $(TYPEDSIGNATURES)

    Set the LED to the given mode, starts the runloop if it isn't running.
    """
    sync_set_led(led::Cint, index::Cint)::Cint
end

# These should be safe to call and use the return values

"""
$(TYPEDSIGNATURES)

Synchronous video function, starts the runloop if it isn't running.

The returned array is copied before returning and is safe to store.
"""
function sync_get_video_with_res(index::Integer, res::Resolution, fmt::VideoFormat)
    if fmt ∉ keys(video_format_to_channels)
        error(
            "Video format \"$fmt\" not in wrapped types $(keys(video_format_to_channels)). " *
            "Use the more verbose version of sync_get_video_with_res and decode manually."
        )
    end

    timestamp = Ref{Cuint}()
    unsafe_video = Ref{Ptr{Cvoid}}(C_NULL)
    sync_get_video_with_res(unsafe_video, timestamp, index, res, fmt)
    rows, cols = resolution_to_dims[res]
    channels = video_format_to_channels[fmt]
    wrapped_video = unsafe_wrap(Array, convert(Ptr{UInt8}, unsafe_video[]), (channels, cols, rows))
    wrapped_video_transpose = PermutedDimsArray(wrapped_video, [1, 3, 2])

    if channels == 1
        wrapped_video_transpose = view(wrapped_video_transpose, 1, :, :)
    end

    return copy(wrapped_video_transpose), Int(timestamp[])
end

"""
$(TYPEDSIGNATURES)

Synchronous video function with resolution `resolution_medium`, starts the
runloop if it isn't running.

The returned array is copied before returning and is safe to store.
"""
sync_get_video(index::Integer, fmt::VideoFormat) = sync_get_video_with_res(index, resolution_medium, fmt)

"""
$(TYPEDSIGNATURES)

Synchronous depth function, starts the runloop if it isn't running.

The returned array is copied before returning and is safe to store.
"""
function sync_get_depth_with_res(index::Integer, res::Resolution, fmt::DepthFormat)
    if fmt ∉ wrappable_depth_formats
        error(
            "Depth format \"$fmt\" not in wrapped types $(wrappable_depth_formats). " *
            "Use the more verbose version of sync_get_depth_with_res and decode manually."
        )
    end

    timestamp = Ref{Cuint}()
    unsafe_depth = Ref{Ptr{Cvoid}}(C_NULL)
    sync_get_depth_with_res(unsafe_depth, timestamp, index, res, fmt)
    rows, cols = resolution_to_dims[res]
    wrapped_depth = unsafe_wrap(Array, convert(Ptr{UInt16}, unsafe_depth[]), (cols, rows))
    wrapped_depth_transpose = transpose(wrapped_depth)

    return copy(wrapped_depth_transpose), Int(timestamp[])
end

"""
$(TYPEDSIGNATURES)

Synchronous depth function with resolution `resolution_medium`, starts the
runloop if it isn't running.

The returned array is copied before returning and is safe to store.
"""
sync_get_depth(index::Integer, fmt::DepthFormat) = sync_get_depth_with_res(index, resolution_medium, fmt)

"""
$(TYPEDSIGNATURES)

Tilt state function, starts the runloop if it isn't running.

The returned `RawTiltState` struct is safe to store.
"""
function sync_get_tilt_state(index::Integer)
    state = Ref{Ptr{RawTiltState}}(C_NULL)
    sync_get_tilt_state(state, index)
    return copy(unsafe_load(state[]))
end