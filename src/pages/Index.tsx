import { useState, useRef, useEffect } from "react";
import * as Tone from "tone";
import { Controls } from "@/components/Controls";
import { PatternVisualizer } from "@/components/PatternVisualizer";
import { generateMusicPattern, MusicNote } from "@/lib/musicGenerator";
import { toast } from "sonner";
import { Music } from "lucide-react";

const Index = () => {
  const [notes, setNotes] = useState<MusicNote[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scale, setScale] = useState("c_major");
  const [tempo, setTempo] = useState(120);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const partRef = useRef<Tone.Part | null>(null);

  useEffect(() => {
    // Initialize synth on mount
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 0.5,
      },
    }).toDestination();

    return () => {
      // Cleanup on unmount
      if (partRef.current) {
        partRef.current.dispose();
      }
      if (synthRef.current) {
        synthRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    // Update tempo
    Tone.Transport.bpm.value = tempo;
  }, [tempo]);

  const handleGenerate = () => {
    const pattern = generateMusicPattern(scale as any, 16);
    setNotes(pattern.notes);
    setCurrentNoteIndex(-1);
    toast.success("New pattern generated!", {
      description: `${pattern.notes.length} notes in ${scale.replace("_", " ")}`,
    });
  };

  const handlePlay = async () => {
    if (notes.length === 0) {
      toast.error("No pattern to play", {
        description: "Generate a pattern first!",
      });
      return;
    }

    // Start Tone.js audio context
    await Tone.start();
    
    // Clean up previous part if exists
    if (partRef.current) {
      partRef.current.dispose();
    }

    setIsPlaying(true);
    setCurrentNoteIndex(0);

    // Create a new Part with the notes
    let noteIndex = 0;
    partRef.current = new Tone.Part((time, value) => {
      synthRef.current?.triggerAttackRelease(value.note, value.duration, time);
      
      // Update UI to show current note
      Tone.Draw.schedule(() => {
        setCurrentNoteIndex(noteIndex);
        noteIndex++;
      }, time);
    }, notes.map((note) => ({
      time: note.time,
      note: note.note,
      duration: note.duration,
    })));

    partRef.current.start(0);
    
    // Schedule stop at the end
    const lastNote = notes[notes.length - 1];
    const endTime = lastNote.time + 1;
    
    Tone.Transport.schedule(() => {
      handleStop();
    }, endTime);

    Tone.Transport.start();
  };

  const handleStop = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    
    if (partRef.current) {
      partRef.current.stop();
    }
    
    setIsPlaying(false);
    setCurrentNoteIndex(-1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start pt-12 px-4 pb-24">
      {/* Header */}
      <div className="text-center mb-12 space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Music className="h-12 w-12 text-primary animate-pulse-slow" />
        </div>
        <h1 className="text-5xl font-bold text-gradient mb-2">
          Generative Music Engine
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Algorithmically generated musical patterns using Markov Chain synthesis.
          Generate, customize, and play unique melodies in your browser.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-8 w-full flex justify-center">
        <Controls
          isPlaying={isPlaying}
          onGenerate={handleGenerate}
          onPlay={handlePlay}
          onStop={handleStop}
          scale={scale}
          onScaleChange={setScale}
          tempo={tempo}
          onTempoChange={setTempo}
        />
      </div>

      {/* Visualizer */}
      <PatternVisualizer
        notes={notes}
        currentNoteIndex={currentNoteIndex}
        isPlaying={isPlaying}
      />

      {/* Footer Info */}
      <div className="mt-16 text-center text-sm text-muted-foreground max-w-2xl">
        <p className="mb-2">
          <strong className="text-primary">Frontend:</strong> React + Tone.js for audio synthesis
        </p>
        <p>
          <strong className="text-primary">Algorithm:</strong> Constrained random walk through musical scales
        </p>
        <p className="mt-4 text-xs opacity-70">
          Ready to connect to C++ backend API at <code className="bg-muted px-2 py-1 rounded">GET /api/generate</code>
        </p>
      </div>
    </div>
  );
};

export default Index;
