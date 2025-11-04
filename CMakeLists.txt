cmake_minimum_required(VERSION 3.14)
project(code-notes-synth-backend)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Fetch Crow (header-only)
include(FetchContent)
FetchContent_Declare(
    crow
    GIT_REPOSITORY https://github.com/CrowCpp/Crow.git
    GIT_TAG v1.0+5
)
FetchContent_MakeAvailable(crow)

# Fetch nlohmann/json (header-only)
FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.11.2
)
FetchContent_MakeAvailable(json)

# Fetch ASIO (header-only, required for Crow)
FetchContent_Declare(
    asio
    GIT_REPOSITORY https://github.com/chriskohlhoff/asio.git
    GIT_TAG asio-1-28-0
)
set(ASIO_STANDALONE ON CACHE BOOL "Use standalone ASIO")
FetchContent_MakeAvailable(asio)

# Create executable
add_executable(${PROJECT_NAME} main.cpp)

# Include directories
target_include_directories(${PROJECT_NAME} PRIVATE
    ${crow_SOURCE_DIR}/include
    ${json_SOURCE_DIR}/include
    ${json_SOURCE_DIR}
    ${asio_SOURCE_DIR}/asio/include
)

# For Windows, we need to link against ws2_32 and wsock32
if(WIN32)
    target_link_libraries(${PROJECT_NAME} PRIVATE ws2_32 wsock32)
endif()

