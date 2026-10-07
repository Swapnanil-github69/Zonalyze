export interface CommercialAirport {
  name: string;
  iata: string;
  city: string;
  lat: number;
  lon: number;
}

export const INDIAN_COMMERCIAL_AIRPORTS: CommercialAirport[] = [
  // West Bengal & Eastern India
  { name: "Netaji Subhash Chandra Bose Int'l Airport", iata: "CCU", city: "Kolkata", lat: 22.6547, lon: 88.4467 },
  { name: "Kazi Nazrul Islam Airport", iata: "RDP", city: "Durgapur", lat: 23.6231, lon: 87.2417 },
  { name: "Bagdogra International Airport", iata: "IXB", city: "Siliguri", lat: 26.6812, lon: 88.3286 },
  { name: "Biju Patnaik Airport", iata: "BBI", city: "Bhubaneswar", lat: 20.2444, lon: 85.8178 },
  { name: "Birsa Munda Airport", iata: "IXR", city: "Ranchi", lat: 23.3143, lon: 85.3217 },
  { name: "Jayprakash Narayan Airport", iata: "PAT", city: "Patna", lat: 25.5913, lon: 85.0880 },
  { name: "Gaya Airport", iata: "GAY", city: "Gaya", lat: 24.7441, lon: 84.9511 },

  // North & NCR
  { name: "Indira Gandhi International Airport", iata: "DEL", city: "New Delhi", lat: 28.5562, lon: 77.1000 },
  { name: "Chaudhary Charan Singh Int'l Airport", iata: "LKO", city: "Lucknow", lat: 26.7606, lon: 80.8893 },
  { name: "Lal Bahadur Shastri Airport", iata: "VNS", city: "Varanasi", lat: 25.4524, lon: 82.8593 },
  { name: "Jaipur International Airport", iata: "JAI", city: "Jaipur", lat: 26.8242, lon: 75.8122 },
  { name: "Shaheed Bhagat Singh Airport", iata: "IXC", city: "Chandigarh", lat: 30.6735, lon: 76.7885 },
  { name: "Sri Guru Ram Dass Jee Int'l Airport", iata: "ATQ", city: "Amritsar", lat: 31.7096, lon: 74.7973 },
  { name: "Sheikh ul-Alam Int'l Airport", iata: "SXR", city: "Srinagar", lat: 33.9871, lon: 74.7741 },
  { name: "Dehradun Airport", iata: "DED", city: "Dehradun", lat: 30.1897, lon: 78.1803 },

  // West & Central India
  { name: "Chhatrapati Shivaji Maharaj Int'l Airport", iata: "BOM", city: "Mumbai", lat: 19.0896, lon: 72.8656 },
  { name: "Pune International Airport", iata: "PNQ", city: "Pune", lat: 18.5822, lon: 73.9197 },
  { name: "Sardar Vallabhbhai Patel Int'l Airport", iata: "AMD", city: "Ahmedabad", lat: 23.0772, lon: 72.6347 },
  { name: "Dr. Babasaheb Ambedkar Airport", iata: "NAG", city: "Nagpur", lat: 21.0922, lon: 79.0472 },
  { name: "Goa Dabolim Airport", iata: "GOI", city: "Goa", lat: 15.3808, lon: 73.8314 },
  { name: "Manohar International Airport", iata: "GOX", city: "Mopa", lat: 15.7669, lon: 73.8672 },
  { name: "Surat International Airport", iata: "STV", city: "Surat", lat: 21.1139, lon: 72.7419 },
  { name: "Devi Ahilya Bai Holkar Airport", iata: "IDR", city: "Indore", lat: 22.7217, lon: 75.8011 },
  { name: "Raja Bhoj Airport", iata: "BHO", city: "Bhopal", lat: 23.2875, lon: 77.3378 },
  { name: "Swami Vivekananda Airport", iata: "RPR", city: "Raipur", lat: 21.1804, lon: 81.7388 },

  // South India
  { name: "Kempegowda International Airport", iata: "BLR", city: "Bengaluru", lat: 13.1986, lon: 77.7066 },
  { name: "Chennai International Airport", iata: "MAA", city: "Chennai", lat: 12.9941, lon: 80.1709 },
  { name: "Rajiv Gandhi International Airport", iata: "HYD", city: "Hyderabad", lat: 17.2403, lon: 78.4294 },
  { name: "Cochin International Airport", iata: "COK", city: "Kochi", lat: 10.1520, lon: 76.4019 },
  { name: "Trivandrum International Airport", iata: "TRV", city: "Thiruvananthapuram", lat: 8.4821, lon: 76.9200 },
  { name: "Calicut International Airport", iata: "CCJ", city: "Kozhikode", lat: 11.1368, lon: 75.9553 },
  { name: "Coimbatore International Airport", iata: "CJB", city: "Coimbatore", lat: 11.0299, lon: 77.0434 },
  { name: "Tiruchirappalli International Airport", iata: "TRZ", city: "Tiruchirappalli", lat: 10.7654, lon: 78.7097 },
  { name: "Mangaluru International Airport", iata: "IXE", city: "Mangaluru", lat: 12.9613, lon: 74.8900 },
  { name: "Visakhapatnam International Airport", iata: "VTZ", city: "Visakhapatnam", lat: 17.7212, lon: 83.2245 },
  { name: "Vijayawada International Airport", iata: "VGA", city: "Vijayawada", lat: 16.5304, lon: 80.7968 },

  // Northeast
  { name: "Lokpriya Gopinath Bordoloi Int'l Airport", iata: "GAU", city: "Guwahati", lat: 26.1061, lon: 91.5859 },
  { name: "Maharaja Bir Bikram Airport", iata: "IXA", city: "Agartala", lat: 23.8869, lon: 91.2404 },
  { name: "Imphal Airport", iata: "IMF", city: "Imphal", lat: 24.7600, lon: 93.8967 }
];

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Returns the nearest commercial airport within maxDistanceKm.
 */
export function getNearestCommercialAirport(lat: number, lon: number, maxDistanceKm = 150) {
  let closest: any = null;
  let minDistance = Infinity;

  for (const ap of INDIAN_COMMERCIAL_AIRPORTS) {
    const d = haversineMeters(lat, lon, ap.lat, ap.lon);
    if (d < minDistance && d <= maxDistanceKm * 1000) {
      minDistance = d;
      closest = {
        name: `${ap.name} (${ap.iata})`,
        iata: ap.iata,
        city: ap.city,
        distanceMeters: Math.round(d),
        coordinates: [ap.lon, ap.lat] as [number, number],
        type: "Commercial Hub"
      };
    }
  }

  return closest;
}

// For backward compatibility
export const MAJOR_INDIAN_AIRPORTS = INDIAN_COMMERCIAL_AIRPORTS;
