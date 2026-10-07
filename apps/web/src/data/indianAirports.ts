export interface CommercialAirport {
  name: string;
  iata: string;
  lat: number;
  lon: number;
}

export const NON_COMMERCIAL_AIRPORT_BLACKLIST = [
  "behala",
  "barrackpore",
  "safdarjung",
  "juhu",
  "tambaram",
  "dona paula",
  "yelahanka",
  "hakimpet",
  "dundigal",
  "hindon",
  "flying club",
  "air force",
  "afs",
  "airstrip",
  "heliport",
  "gliding",
];

export const MAJOR_INDIAN_AIRPORTS = [
  // West Bengal & Eastern India
  { name: "Netaji Subhash Chandra Bose Int'l Airport (CCU)", iata: "CCU", lat: 22.6547, lon: 88.4467 },
  { name: "Kazi Nazrul Islam Airport (RDP)", iata: "RDP", lat: 23.6231, lon: 87.2417 },
  { name: "Bagdogra International Airport (IXB)", iata: "IXB", lat: 26.6812, lon: 88.3286 },
  { name: "Biju Patnaik Airport (BBI)", iata: "BBI", lat: 20.2444, lon: 85.8178 },
  { name: "Birsa Munda Airport (IXR)", iata: "IXR", lat: 23.3143, lon: 85.3217 },
  { name: "Jayprakash Narayan Airport (PAT)", iata: "PAT", lat: 25.5913, lon: 85.0880 },
  { name: "Gaya Airport (GAY)", iata: "GAY", lat: 24.7441, lon: 84.9511 },

  // North & NCR
  { name: "Indira Gandhi International Airport (DEL)", iata: "DEL", lat: 28.5562, lon: 77.1000 },
  { name: "Chaudhary Charan Singh Int'l Airport (LKO)", iata: "LKO", lat: 26.7606, lon: 80.8893 },
  { name: "Lal Bahadur Shastri Airport (VNS)", iata: "VNS", lat: 25.4524, lon: 82.8593 },
  { name: "Jaipur International Airport (JAI)", iata: "JAI", lat: 26.8242, lon: 75.8122 },
  { name: "Shaheed Bhagat Singh Airport (IXC)", iata: "IXC", lat: 30.6735, lon: 76.7885 },
  { name: "Sri Guru Ram Dass Jee Int'l Airport (ATQ)", iata: "ATQ", lat: 31.7096, lon: 74.7973 },
  { name: "Sheikh ul-Alam Int'l Airport (SXR)", iata: "SXR", lat: 33.9871, lon: 74.7741 },
  { name: "Dehradun Airport (DED)", iata: "DED", lat: 30.1897, lon: 78.1803 },

  // West & Central India
  { name: "Chhatrapati Shivaji Maharaj Int'l Airport (BOM)", iata: "BOM", lat: 19.0896, lon: 72.8656 },
  { name: "Pune International Airport (PNQ)", iata: "PNQ", lat: 18.5822, lon: 73.9197 },
  { name: "Sardar Vallabhbhai Patel Int'l Airport (AMD)", iata: "AMD", lat: 23.0772, lon: 72.6347 },
  { name: "Dr. Babasaheb Ambedkar Airport (NAG)", iata: "NAG", lat: 21.0922, lon: 79.0472 },
  { name: "Goa Dabolim Airport (GOI)", iata: "GOI", lat: 15.3808, lon: 73.8314 },
  { name: "Manohar International Airport (GOX)", iata: "GOX", lat: 15.7669, lon: 73.8672 },
  { name: "Surat International Airport (STV)", iata: "STV", lat: 21.1139, lon: 72.7419 },
  { name: "Devi Ahilya Bai Holkar Airport (IDR)", iata: "IDR", lat: 22.7217, lon: 75.8011 },
  { name: "Raja Bhoj Airport (BHO)", iata: "BHO", lat: 23.2875, lon: 77.3378 },
  { name: "Swami Vivekananda Airport (RPR)", iata: "RPR", lat: 21.1804, lon: 81.7388 },

  // South India
  { name: "Kempegowda International Airport (BLR)", iata: "BLR", lat: 13.1986, lon: 77.7066 },
  { name: "Chennai International Airport (MAA)", iata: "MAA", lat: 12.9941, lon: 80.1709 },
  { name: "Rajiv Gandhi International Airport (HYD)", iata: "HYD", lat: 17.2403, lon: 78.4294 },
  { name: "Cochin International Airport (COK)", iata: "COK", lat: 10.1520, lon: 76.4019 },
  { name: "Trivandrum International Airport (TRV)", iata: "TRV", lat: 8.4821, lon: 76.9200 },
  { name: "Calicut International Airport (CCJ)", iata: "CCJ", lat: 11.1368, lon: 75.9553 },
  { name: "Coimbatore International Airport (CJB)", iata: "CJB", lat: 11.0299, lon: 77.0434 },
  { name: "Tiruchirappalli International Airport (TRZ)", iata: "TRZ", lat: 10.7654, lon: 78.7097 },
  { name: "Mangaluru International Airport (IXE)", iata: "IXE", lat: 12.9613, lon: 74.8900 },
  { name: "Visakhapatnam International Airport (VTZ)", iata: "VTZ", lat: 17.7212, lon: 83.2245 },
  { name: "Vijayawada International Airport (VGA)", iata: "VGA", lat: 16.5304, lon: 80.7968 },

  // Northeast
  { name: "Lokpriya Gopinath Bordoloi Int'l Airport (GAU)", iata: "GAU", lat: 26.1061, lon: 91.5859 },
  { name: "Maharaja Bir Bikram Airport (IXA)", iata: "IXA", lat: 23.8869, lon: 91.2404 },
  { name: "Imphal Airport (IMF)", iata: "IMF", lat: 24.7600, lon: 93.8967 }
];

export function resolveClientNearestAirport(lat: number, lon: number): { name: string; distanceMeters: number; coordinates: [number, number] } | null {
  let closest: { name: string; distanceMeters: number; coordinates: [number, number] } | null = null;
  let minDistance = Infinity;

  for (const ap of MAJOR_INDIAN_AIRPORTS) {
    const apNameLower = ap.name.toLowerCase();
    if (NON_COMMERCIAL_AIRPORT_BLACKLIST.some((term) => apNameLower.includes(term))) {
      continue;
    }

    const dLat = (ap.lat - lat) * 111000;
    const dLon = (ap.lon - lon) * 111000 * Math.cos((lat * Math.PI) / 180);
    const d = Math.round(Math.sqrt(dLat * dLat + dLon * dLon));
    if (d < minDistance && d <= 150000) {
      minDistance = d;
      closest = {
        name: ap.name,
        distanceMeters: d,
        coordinates: [ap.lon, ap.lat],
      };
    }
  }
  return closest;
}
