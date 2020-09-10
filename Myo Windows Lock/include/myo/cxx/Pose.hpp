// Copyright 2015 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
#pragma once

#include <iosfwd>
#include <string>

#include <myo/libmyo.h>

namespace myo {

/// A pose represents a detected configuration of the user's hand.
class Pose {
public:
    /// Types of poses supported by the SDK.
    enum Type {
        rest          = libmyo_pose_rest,
        fist          = libmyo_pose_fist,
        waveIn        = libmyo_pose_wave_in,
        waveOut       = libmyo_pose_wave_out,
        fingersSpread = libmyo_pose_fingers_spread,
        doubleTap     = libmyo_pose_double_tap,
        unknown       = libmyo_pose_unknown
    };

    /// Construct a pose of type Pose::none.
    Pose();

    /// Construct a pose with the given type.
    Pose(Type type);

    /// Returns true if and only if the two poses are of the same type.
    bool operator==(Pose other) const;

    /// Equivalent to `!(*this == other)`.
    bool operator!=(Pose other) const;

    /// Returns the type of this pose.
    Type type() const;

    /// Return a human-readable string representation of the pose.
    std::string toString() const;

private:
    Type _type;
};

/// @relates Pose
/// Returns true if and only if the type of pose is the same as the provided type.
bool operator==(Pose pose, Pose::Type t);

/// @relates Pose
/// Equivalent to `pose == type`.
bool operator==(Pose::Type type, Pose pose);

/// @relates Pose
/// Equivalent to `!(pose == type)`.
bool operator!=(Pose pose, Pose::Type type);

/// @relates Pose
/// Equivalent to `!(type == pose)`.
bool operator!=(Pose::Type type, Pose pose);

/// @relates Pose
/// Write the name of the provided pose to the provided output stream.
std::ostream& operator<<(std::ostream& out, const Pose& pose);

} // namespace myo

#include "impl/Pose_impl.hpp"
