import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ChevronRight } from "lucide-react";

interface RecyclingPointsProps {
  wasteType?: string;
}

const RECYCLING_POINTS = [
  {
    id: 1,
    name: "Muratpaşa Belediyesi Geri Dönüşüm Merkezi",
    address: "Fener Mah., Tekelioğlu Cad., Muratpaşa/Antalya",
    phone: "0242 228 88 00",
    hours: "08:00 - 17:00",
    types: ["Plastik", "Kağıt", "Cam", "Metal"],
    lat: 36.8841,
    lng: 30.7056,
  },
  {
    id: 2,
    name: "Konyaaltı Belediyesi Atık Toplama Noktası",
    address: "Liman Mah., Atatürk Bulvarı, Konyaaltı/Antalya",
    phone: "0242 261 07 07",
    hours: "08:30 - 17:30",
    types: ["Plastik", "Kağıt", "Cam", "Elektronik"],
    lat: 36.8667,
    lng: 30.6333,
  },
  {
    id: 3,
    name: "Kepez Belediyesi Geri Dönüşüm Tesisi",
    address: "Varsak Karşıyaka Mah., Kepez/Antalya",
    phone: "0242 340 30 30",
    hours: "09:00 - 18:00",
    types: ["Plastik", "Metal", "Tekstil", "Elektronik"],
    lat: 36.9500,
    lng: 30.6833,
  },
  {
    id: 4,
    name: "Aksu Belediyesi Çevre Noktası",
    address: "Kumköy Mah., Aksu/Antalya",
    phone: "0242 426 70 07",
    hours: "08:00 - 16:30",
    types: ["Plastik", "Cam", "Kağıt"],
    lat: 36.9333,
    lng: 30.8167,
  },
  {
    id: 5,
    name: "Döşemealtı Belediyesi Ambalaj Atık Merkezi",
    address: "Yeniköy Mah., Döşemealtı/Antalya",
    phone: "0242 229 05 50",
    hours: "08:30 - 17:00",
    types: ["Plastik", "Kağıt", "Metal", "Cam"],
    lat: 37.0000,
    lng: 30.6000,
  },
];

const RecyclingPoints = ({ wasteType }: RecyclingPointsProps) => {
  const filteredPoints = wasteType
    ? RECYCLING_POINTS.filter((p) => p.types.includes(wasteType))
    : RECYCLING_POINTS;

  const sortedPoints = filteredPoints.length > 0 ? filteredPoints : RECYCLING_POINTS;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">📍 Geri Dönüşüm Noktaları</h2>
        <span className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-medium">
          Antalya
        </span>
      </div>

      {wasteType && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 text-sm text-primary font-medium">
          🔍 "{wasteType}" için uygun noktalar gösteriliyor
        </div>
      )}

      <div className="space-y-3">
        {sortedPoints.map((point, i) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm leading-snug">{point.name}</h3>
                <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <p className="text-xs font-body">{point.address}</p>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    <span className="text-xs font-body">{point.phone}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs font-body">{point.hours}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {point.types.map((type) => (
                    <span
                      key={type}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        type === wasteType
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href={`https://www.google.com/maps?q=${point.lat},${point.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecyclingPoints;
