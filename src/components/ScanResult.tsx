import { motion } from "framer-motion";
import { ArrowLeft, Leaf, Lightbulb, Recycle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScanResultProps {
  image: string;
  result: {
    material: string;
    recyclable: boolean;
    confidence: number;
    description: string;
    upcycleIdea: string;
    carbonSaving: string;
  } | null;
  isAnalyzing: boolean;
  onReset: () => void;
}

const ScanResult = ({ image, result, isAnalyzing, onReset }: ScanResultProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-2 space-y-4"
    >
      <Button variant="ghost" size="sm" onClick={onReset} className="gap-2 text-muted-foreground">
        <ArrowLeft className="w-4 h-4" /> Geri Dön
      </Button>

      {/* Captured Image */}
      <div className="rounded-2xl overflow-hidden border border-border aspect-video">
        <img src={image} alt="Taranan atık" className="w-full h-full object-cover" />
      </div>

      {isAnalyzing ? (
        <div className="flex flex-col items-center py-12 gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-muted-foreground">Yapay zeka analiz ediyor...</p>
        </div>
      ) : result ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* Material Card */}
          <div className={`rounded-2xl p-5 border ${result.recyclable ? "bg-primary/5 border-primary/20" : "bg-destructive/5 border-destructive/20"}`}>
            <div className="flex items-center gap-3 mb-3">
              {result.recyclable ? (
                <Recycle className="w-6 h-6 text-primary" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive" />
              )}
              <div>
                <h3 className="font-bold text-foreground text-lg">{result.material}</h3>
                <p className={`text-xs font-semibold ${result.recyclable ? "text-primary" : "text-destructive"}`}>
                  {result.recyclable ? "♻️ Geri Dönüştürülebilir" : "❌ Geri Dönüştürülemez"}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">{result.description}</p>
          </div>

          {/* Upcycle Idea */}
          {result.upcycleIdea && (
            <div className="rounded-2xl p-4 bg-accent/10 border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                <h4 className="font-semibold text-foreground text-sm">İleri Dönüşüm Fikri</h4>
              </div>
              <p className="text-sm text-muted-foreground font-body">{result.upcycleIdea}</p>
            </div>
          )}

          {/* Carbon Saving */}
          {result.carbonSaving && (
            <div className="rounded-2xl p-4 bg-secondary border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground text-sm">Karbon Tasarrufu</h4>
              </div>
              <p className="text-sm text-muted-foreground font-body">{result.carbonSaving}</p>
            </div>
          )}
        </motion.div>
      ) : null}
    </motion.div>
  );
};

export default ScanResult;
