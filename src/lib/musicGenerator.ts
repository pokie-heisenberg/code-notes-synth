// Generative Music Algorithm - Markov Chain Implementation
// This simulates the C++ backend's generation logic client-side

export interface MusicNote {
  note: string;
  time: number;
  duration: string;
}

export interface GeneratedPattern {
  notes: MusicNote[];
}

// Musical scales in MIDI note numbers
const SCALES = {
  c_major: [60, 62, 64, 65, 67, 69, 71], // C D E F G A B
  a_minor: [57, 59, 60, 62, 64, 65, 67], // A B C D E F G
  d_major: [62, 64, 66, 67, 69, 71, 73], // D E F# G A B C#
  e_minor: [64, 66, 67, 69, 71, 72, 74], // E F# G A B C D
  g_major: [67, 69, 71, 72, 74, 76, 77], // G A B C D E F#
};

// Convert MIDI note number to note name
function midiToNoteName(midi: number): string {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const noteName = notes[midi % 12];
  return `${noteName}${octave}`;
}

// Constrained random walk algorithm
export function generateMusicPattern(
  scale: keyof typeof SCALES = 'c_major',
  length: number = 16
): GeneratedPattern {
  const scaleNotes = SCALES[scale];
  const notes: MusicNote[] = [];
  
  // Pick random starting note
  let currentIndex = Math.floor(Math.random() * scaleNotes.length);
  
  // Duration options (in Tone.js notation)
  const durations = ['8n', '8n', '8n', '4n', '16n'];
  
  let currentTime = 0;
  
  for (let i = 0; i < length; i++) {
    const currentMidi = scaleNotes[currentIndex];
    const duration = durations[Math.floor(Math.random() * durations.length)];
    
    notes.push({
      note: midiToNoteName(currentMidi),
      time: currentTime,
      duration: duration,
    });
    
    // Move to next note using constrained random walk
    // Can move +/- 1 or 2 steps within scale
    const possibleSteps = [-2, -1, 0, 1, 2];
    const step = possibleSteps[Math.floor(Math.random() * possibleSteps.length)];
    
    // Clamp to scale boundaries
    currentIndex = Math.max(0, Math.min(scaleNotes.length - 1, currentIndex + step));
    
    // Increment time (eighth note = 0.5 seconds at 120 BPM)
    currentTime += 0.5;
  }
  
  return { notes };
}
