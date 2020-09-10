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
#ifndef MYO_LIBMYO_DETAIL_VISIBILITY_H
#define MYO_LIBMYO_DETAIL_VISIBILITY_H

#if defined(_WIN32) || defined(__CYGWIN__)
  #ifdef myo_EXPORTS
    #ifdef __GNUC__
      #define LIBMYO_EXPORT __attribute__ ((dllexport))
    #else
      #define LIBMYO_EXPORT __declspec(dllexport)
    #endif
  #else
    #ifdef LIBMYO_STATIC_BUILD
      #define LIBMYO_EXPORT
    #else
      #ifdef __GNUC__
        #define LIBMYO_EXPORT __attribute__ ((dllimport))
      #else
        #define LIBMYO_EXPORT __declspec(dllimport)
      #endif
    #endif
  #endif
#else
  #if __GNUC__ >= 4
    #define LIBMYO_EXPORT __attribute__ ((visibility ("default")))
  #else
    #define LIBMYO_EXPORT
  #endif
#endif

#endif // MYO_LIBMYO_DETAIL_VISIBILITY_H
