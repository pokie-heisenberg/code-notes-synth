import { MusicNote } from "@/lib/musicGenerator";
import { Music2 } from "lucide-react";

interface PatternVisualizerProps {
  notes: MusicNote[];
  currentNoteIndex: number;
  isPlaying: boolean;
}

export const PatternVisualizer = ({ notes, currentNoteIndex, isPlaying }: PatternVisualizerProps) => {
  if (notes.length === 0) {
    return (
      <div className="w-full max-w-4xl p-12 bg-card rounded-2xl border border-border flex flex-col items-center justify-center text-muted-foreground space-y-4">
        <Music2 className="h-16 w-16 opacity-50" />
        <p className="text-lg">No pattern generated yet. Click "Generate Music" to start!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl p-8 bg-card rounded-2xl border border-border glow-cyan">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gradient">Generated Pattern</h3>
        <p className="text-sm text-muted-foreground mt-1">{notes.length} notes</p>
      </div>
      
      <div className="grid grid-cols-8 gap-3">
        {notes.map((note, index) => (
          <div
            key={index}
            className={`
              p-4 rounded-lg border-2 transition-all duration-300 text-center
              ${
                isPlaying && index === currentNoteIndex
                  ? 'bg-primary border-primary text-primary-foreground scale-110 glow-cyan-strong'
                  : index < currentNoteIndex && isPlaying
                  ? 'bg-muted border-muted-foreground/30 text-muted-foreground'
                  : 'bg-input border-border text-foreground hover:border-primary/50'
              }
            `}
          >
            <div className="font-bold text-lg">{note.note}</div>
            <div className="text-xs opacity-70 mt-1">{note.duration}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
