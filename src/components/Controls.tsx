import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Square, Sparkles } from "lucide-react";

interface ControlsProps {
  isPlaying: boolean;
  onGenerate: () => void;
  onPlay: () => void;
  onStop: () => void;
  scale: string;
  onScaleChange: (scale: string) => void;
  tempo: number;
  onTempoChange: (tempo: number) => void;
}

export const Controls = ({
  isPlaying,
  onGenerate,
  onPlay,
  onStop,
  scale,
  onScaleChange,
  tempo,
  onTempoChange,
}: ControlsProps) => {
  return (
    <div className="w-full max-w-2xl space-y-6 p-8 bg-card rounded-2xl border border-border glow-cyan">
      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={onGenerate}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg glow-cyan-strong transition-all duration-300 hover:scale-105"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Music
        </Button>
      </div>

      {/* Playback Controls */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={onPlay}
          disabled={isPlaying}
          size="lg"
          variant="secondary"
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-6"
        >
          <Play className="mr-2 h-5 w-5" />
          Play
        </Button>
        <Button
          onClick={onStop}
          disabled={!isPlaying}
          size="lg"
          variant="outline"
          className="border-border hover:bg-muted font-semibold px-6"
        >
          <Square className="mr-2 h-5 w-5" />
          Stop
        </Button>
      </div>

      {/* Scale Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">Musical Scale</label>
        <Select value={scale} onValueChange={onScaleChange}>
          <SelectTrigger className="bg-input border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="c_major">C Major</SelectItem>
            <SelectItem value="a_minor">A Minor</SelectItem>
            <SelectItem value="d_major">D Major</SelectItem>
            <SelectItem value="e_minor">E Minor</SelectItem>
            <SelectItem value="g_major">G Major</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tempo Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-muted-foreground">Tempo</label>
          <span className="text-sm font-mono text-primary">{tempo} BPM</span>
        </div>
        <Slider
          value={[tempo]}
          onValueChange={(values) => onTempoChange(values[0])}
          min={60}
          max={180}
          step={5}
          className="w-full"
        />
      </div>
    </div>
  );
};
