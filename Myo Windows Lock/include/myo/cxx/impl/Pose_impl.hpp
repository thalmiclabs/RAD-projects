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
#ifndef MYO_CXX_IMPL_POSE_IMPL_HPP
#define MYO_CXX_IMPL_POSE_IMPL_HPP

#include "../Pose.hpp"

#include <iostream>

namespace myo {

inline
Pose::Pose()
: _type(unknown)
{
}

inline
Pose::Pose(Pose::Type type)
: _type(type)
{
}

inline
bool Pose::operator==(Pose other) const
{
    return _type == other._type;
}

inline
bool Pose::operator!=(Pose other) const
{
    return !(*this == other);
}

inline
Pose::Type Pose::type() const
{
    return _type;
}

inline
bool operator==(Pose pose, Pose::Type type)
{
    return pose.type() == type;
}

inline
bool operator==(Pose::Type type, Pose pose)
{
    return pose == type;
}

inline
bool operator!=(Pose pose, Pose::Type type)
{
    return !(pose == type);
}

inline
bool operator!=(Pose::Type type, Pose pose)
{
    return !(type == pose);
}

inline
std::string Pose::toString() const
{
    switch (type()) {
    case Pose::rest:
        return "rest";
    case Pose::fist:
        return "fist";
    case Pose::waveIn:
        return "waveIn";
    case Pose::waveOut:
        return "waveOut";
    case Pose::fingersSpread:
        return "fingersSpread";
    case Pose::doubleTap:
        return "doubleTap";
    case Pose::unknown:
        return "unknown";
    }

    return "<invalid>";
}

inline
std::ostream& operator<<(std::ostream& out, const Pose& pose)
{
    return out << pose.toString();
}

} // namespace myo

#endif // MYO_CXX_IMPL_POSE_IMPL_HPP
