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
#include "../Myo.hpp"
#include "../detail/ThrowOnError.hpp"

#include <stdexcept>

namespace myo {

inline
void Myo::vibrate(VibrationType type)
{
    libmyo_vibrate(_myo, static_cast<libmyo_vibration_type_t>(type), ThrowOnError());
}

inline
void Myo::requestRssi() const
{
    libmyo_request_rssi(_myo, ThrowOnError());
}

inline
void Myo::unlock(UnlockType type)
{
    libmyo_myo_unlock(_myo, static_cast<libmyo_unlock_type_t>(type), ThrowOnError());
}

inline
void Myo::lock()
{
    libmyo_myo_lock(_myo, ThrowOnError());
}

inline
void Myo::notifyUserAction()
{
    libmyo_myo_notify_user_action(_myo, libmyo_user_action_single, ThrowOnError());
}

inline
void Myo::setStreamEmg(StreamEmgType type)
{
    libmyo_set_stream_emg(_myo, static_cast<libmyo_stream_emg_t>(type), ThrowOnError());
}

inline
libmyo_myo_t Myo::libmyoObject() const
{
    return _myo;
}

inline
Myo::Myo(libmyo_myo_t myo)
: _myo(myo)
{
    if (!_myo) {
        throw std::invalid_argument("Cannot construct Myo instance with null pointer");
    }
}

inline
Myo::~Myo()
{
}

} // namespace myo
