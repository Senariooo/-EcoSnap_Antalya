import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Camera, Leaf, MapPin, Recycle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScanResult from "@/components/ScanResult";
import RecyclingPoints from "@/components/RecyclingPoints";
import BottomNav from "@/components/BottomNav";

const Index = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "map" | "tips">("home");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setCapturedImage(base64);
      setIsAnalyzing(true);
      setActiveTab("home");

      try {
        const { data, error } = await supabase.functions.invoke("analyze-waste", {
          body: { image: base64 },
        });

        if (error) {
          throw new Error(error.message || "Analiz başarısız oldu");
        }
        setAnalysisResult(data);
      } catch (error) {
        console.error("Analiz hatası:", error);
        setAnalysisResult({
          material: "Bilinmiyor",
          recyclable: false,
          confidence: 0,
          description: "Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.",
          upcycleIdea: "",
          carbonSaving: "",
        });
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleReset = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-6 pt-8 pb-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Eco<span className="text-primary">Snap</span>
          </h1>
        </div>
        <div className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
          🌍 Antalya
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-24 overflow-y-auto">
        {activeTab === "home" && (
          <>
            {!capturedImage ? (
              <HomeView onCapture={handleCapture} />
            ) : (
              <ScanResult
                image={capturedImage}
                result={analysisResult}
                isAnalyzing={isAnalyzing}
                onReset={handleReset}
              />
            )}
          </>
        )}

        {activeTab === "map" && (
          <RecyclingPoints wasteType={analysisResult?.material} />
        )}

        {activeTab === "tips" && <TipsView />}
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

const HomeView = ({ onCapture }: { onCapture: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="flex flex-col items-center pt-8"
  >
    {/* Hero Card */}
    <div className="w-full rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
          <Recycle className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Atığını Tara, Doğayı Koru</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Yapay zeka ile atığını analiz et, nasıl geri dönüştüreceğini öğren ve en yakın geri dönüşüm noktasını bul.
          </p>
        </div>
      </div>
    </div>

    {/* Scan Button */}
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="mb-8"
    >
      <Button
        onClick={onCapture}
        size="lg"
        className="w-44 h-44 rounded-full text-primary-foreground bg-primary hover:bg-primary/90 shadow-xl animate-pulse-green flex flex-col gap-3"
      >
        <Camera className="w-12 h-12" />
        <span className="text-base font-bold">Atığı Tara</span>
      </Button>
    </motion.div>

    {/* Quick Stats */}
    <div className="grid grid-cols-3 gap-3 w-full">
      {[
        { icon: Recycle, label: "Geri Dönüşüm", value: "♻️" },
        { icon: MapPin, label: "Toplama Noktası", value: "📍" },
        { icon: Sparkles, label: "Upcycle Fikri", value: "✨" },
      ].map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className="bg-card border border-border rounded-2xl p-4 text-center"
        >
          <div className="text-2xl mb-2">{item.value}</div>
          <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const TipsView = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="pt-4 space-y-4"
  >
    <h2 className="text-xl font-bold text-foreground mb-4">♻️ Geri Dönüşüm İpuçları</h2>
    {[
      { title: "Plastiği Ayırın", desc: "PET şişeleri kapağını çıkararak ayrı atın.", emoji: "🧴" },
      { title: "Kağıdı Katlayın", desc: "Karton kutuları düzleştirerek toplayın.", emoji: "📦" },
      { title: "Camı Temizleyin", desc: "Cam şişeleri yıkayıp ayrı kutusuna koyun.", emoji: "🫙" },
      { title: "Elektronik Atık", desc: "Pil ve elektronik atıkları özel kutulara bırakın.", emoji: "🔋" },
      { title: "Tekstil Geri Dönüşümü", desc: "Eski kıyafetleri belediye kumbaralarına bırakın.", emoji: "👕" },
    ].map((tip, i) => (
      <motion.div
        key={tip.title}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.08 }}
        className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3"
      >
        <span className="text-2xl">{tip.emoji}</span>
        <div>
          <h3 className="font-semibold text-foreground text-sm">{tip.title}</h3>
          <p className="text-xs text-muted-foreground font-body mt-0.5">{tip.desc}</p>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

export default Index;
