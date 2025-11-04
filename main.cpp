#include <vector>
#include <string>
#include <random>
#include <map>
#include <iostream>
#include <sstream>
#include <iomanip>

// Include header-only libraries
#include "crow_all.h"
#include <nlohmann/json.hpp>

using json = nlohmann::json;

// Generate musical pattern using only standard C++ libraries
std::vector<std::map<std::string, std::string>> generateMusicPattern() {
    // Define C major scale
    std::vector<std::string> c_major_scale = {"C4", "D4", "E4", "F4", "G4", "A4", "B4"};
    
    // Random number generator
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> scale_dist(0, c_major_scale.size() - 1);
    std::uniform_int_distribution<> step_dist(-2, 2);
    std::uniform_int_distribution<> length_dist(10, 15);
    
    // Generate pattern length (10-15 notes)
    int pattern_length = length_dist(gen);
    
    // Pick random starting note
    int current_index = scale_dist(gen);
    
    // Duration options
    std::vector<std::string> durations = {"8n", "8n", "8n", "4n", "16n"};
    std::uniform_int_distribution<> duration_dist(0, durations.size() - 1);
    
    // Store results
    std::vector<std::map<std::string, std::string>> pattern;
    
    double current_time = 0.0;
    const double time_step = 0.5; // Eighth note = 0.5 seconds at 120 BPM
    
    // Generate the pattern
    for (int i = 0; i < pattern_length; i++) {
        // Get current note
        std::string note = c_major_scale[current_index];
        std::string duration = durations[duration_dist(gen)];
        
        // Convert time to string (with 1 decimal place)
        std::ostringstream time_stream;
        time_stream << std::fixed << std::setprecision(1) << current_time;
        std::string time_str = time_stream.str();
        
        // Create note entry
        std::map<std::string, std::string> note_entry;
        note_entry["note"] = note;
        note_entry["time"] = time_str;
        note_entry["duration"] = duration;
        
        pattern.push_back(note_entry);
        
        // Random walk: move -2, -1, 0, 1, or 2 steps
        int step = step_dist(gen);
        current_index += step;
        
        // Clamp to scale boundaries
        if (current_index < 0) {
            current_index = 0;
        } else if (current_index >= static_cast<int>(c_major_scale.size())) {
            current_index = c_major_scale.size() - 1;
        }
        
        // Increment time
        current_time += time_step;
    }
    
    return pattern;
}

// CORS middleware function
void addCorsHeaders(crow::response& res) {
    res.add_header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.add_header("Access-Control-Allow-Headers", "Content-Type");
}

int main() {
    crow::SimpleApp app;
    
    // Handle CORS preflight requests
    CROW_ROUTE(app, "/api/generate")
        .methods("OPTIONS"_method)
    ([&](const crow::request& req) {
        crow::response res;
        addCorsHeaders(res);
        res.code = 204; // No Content
        return res;
    });
    
    // Main API endpoint
    CROW_ROUTE(app, "/api/generate")
        .methods("GET"_method)
    ([&](const crow::request& req) {
        // Generate the pattern
        auto pattern = generateMusicPattern();
        
        // Convert to JSON
        json result;
        json notes_array = json::array();
        
        for (const auto& note_map : pattern) {
            json note_obj;
            note_obj["note"] = note_map.at("note");
            
            // Convert time string to double
            double time_value = std::stod(note_map.at("time"));
            note_obj["time"] = time_value;
            
            note_obj["duration"] = note_map.at("duration");
            notes_array.push_back(note_obj);
        }
        
        result["notes"] = notes_array;
        
        // Create response with CORS headers
        crow::response res;
        addCorsHeaders(res);
        res.add_header("Content-Type", "application/json");
        res.body = result.dump(2); // Pretty print with 2-space indent
        res.code = 200;
        
        return res;
    });
    
    // Start server on port 8080
    app.port(8080).multithreaded().run();
    
    return 0;
}

