/**
 * Curated registry of operational commercial passenger airports across India.
 * STRICT POLICY:
 * - Must have an authentic, active 3-letter IATA code.
 * - Non-commercial airfields (e.g. Behala), flying clubs, military air force stations (e.g. Barrackpore AFS),
 *   and closed civil aerodromes (e.g. Safdarjung, Begumpet, HAL) are strictly EXCLUDED.
 */

export interface CommercialAirport {
  name: string;
  iata: string;
  lat: number;
  lon: number;
  city?: string;
  state?: string;
}

export const MAJOR_INDIAN_AIRPORTS: CommercialAirport[] = [
  // West Bengal
  { name: "Netaji Subhash Chandra Bose Int'l Airport (CCU)", iata: "CCU", lat: 22.6547, lon: 88.4467, city: "Kolkata", state: "West Bengal" },
  { name: "Kazi Nazrul Islam Airport (RDP)", iata: "RDP", lat: 23.6231, lon: 87.2417, city: "Durgapur", state: "West Bengal" },
  { name: "Bagdogra International Airport (IXB)", iata: "IXB", lat: 26.6812, lon: 88.3286, city: "Siliguri", state: "West Bengal" },

  // Delhi NCR
  { name: "Indira Gandhi International Airport (DEL)", iata: "DEL", lat: 28.5562, lon: 77.1000, city: "Delhi", state: "Delhi" },

  // Maharashtra
  { name: "Chhatrapati Shivaji Maharaj Int'l Airport (BOM)", iata: "BOM", lat: 19.0896, lon: 72.8656, city: "Mumbai", state: "Maharashtra" },
  { name: "Pune Airport (PNQ)", iata: "PNQ", lat: 18.5822, lon: 73.9197, city: "Pune", state: "Maharashtra" },
  { name: "Dr. Babasaheb Ambedkar Int'l Airport (NAG)", iata: "NAG", lat: 21.0922, lon: 79.0472, city: "Nagpur", state: "Maharashtra" },
  { name: "Shirdi Airport (SAG)", iata: "SAG", lat: 19.6894, lon: 74.3792, city: "Shirdi", state: "Maharashtra" },
  { name: "Chhatrapati Sambhajinagar Airport (IXU)", iata: "IXU", lat: 19.8631, lon: 75.3981, city: "Chhatrapati Sambhajinagar", state: "Maharashtra" },
  { name: "Kolhapur Airport (KLH)", iata: "KLH", lat: 16.6644, lon: 74.2892, city: "Kolhapur", state: "Maharashtra" },
  { name: "Nanded Airport (NDC)", iata: "NDC", lat: 19.1836, lon: 77.3183, city: "Nanded", state: "Maharashtra" },

  // Karnataka
  { name: "Kempegowda International Airport (BLR)", iata: "BLR", lat: 13.1986, lon: 77.7066, city: "Bengaluru", state: "Karnataka" },
  { name: "Mangalore International Airport (IXE)", iata: "IXE", lat: 12.9613, lon: 74.8900, city: "Mangalore", state: "Karnataka" },
  { name: "Hubballi Airport (HBX)", iata: "HBX", lat: 15.3617, lon: 75.0849, city: "Hubli", state: "Karnataka" },
  { name: "Belagavi Airport (IXG)", iata: "IXG", lat: 15.8592, lon: 74.6183, city: "Belgaum", state: "Karnataka" },
  { name: "Kallaburgi Airport (GBI)", iata: "GBI", lat: 17.2950, lon: 76.9536, city: "Kalaburagi", state: "Karnataka" },
  { name: "Shivamogga Airport (RQY)", iata: "RQY", lat: 13.8825, lon: 75.6444, city: "Shivamogga", state: "Karnataka" },

  // Tamil Nadu
  { name: "Chennai International Airport (MAA)", iata: "MAA", lat: 12.9941, lon: 80.1709, city: "Chennai", state: "Tamil Nadu" },
  { name: "Coimbatore International Airport (CJB)", iata: "CJB", lat: 11.0299, lon: 77.0434, city: "Coimbatore", state: "Tamil Nadu" },
  { name: "Tiruchirappalli International Airport (TRZ)", iata: "TRZ", lat: 10.7654, lon: 78.7097, city: "Tiruchirappalli", state: "Tamil Nadu" },
  { name: "Madurai Airport (IXM)", iata: "IXM", lat: 9.8345, lon: 78.0934, city: "Madurai", state: "Tamil Nadu" },
  { name: "Tuticorin Airport (TCR)", iata: "TCR", lat: 8.7242, lon: 78.0264, city: "Thoothukudi", state: "Tamil Nadu" },
  { name: "Salem Airport (SXV)", iata: "SXV", lat: 11.7828, lon: 78.0647, city: "Salem", state: "Tamil Nadu" },

  // Telangana
  { name: "Rajiv Gandhi International Airport (HYD)", iata: "HYD", lat: 17.2403, lon: 78.4294, city: "Hyderabad", state: "Telangana" },

  // Andhra Pradesh
  { name: "Visakhapatnam International Airport (VTZ)", iata: "VTZ", lat: 17.7212, lon: 83.2245, city: "Visakhapatnam", state: "Andhra Pradesh" },
  { name: "Vijayawada International Airport (VGA)", iata: "VGA", lat: 16.5304, lon: 80.7968, city: "Vijayawada", state: "Andhra Pradesh" },
  { name: "Tirupati Airport (TIR)", iata: "TIR", lat: 13.6325, lon: 79.5433, city: "Tirupati", state: "Andhra Pradesh" },
  { name: "Rajahmundry Airport (RJA)", iata: "RJA", lat: 17.1106, lon: 81.8183, city: "Rajahmundry", state: "Andhra Pradesh" },
  { name: "Kadapa Airport (CDP)", iata: "CDP", lat: 14.5100, lon: 78.7725, city: "Kadapa", state: "Andhra Pradesh" },
  { name: "Kurnool Airport (KJB)", iata: "KJB", lat: 15.7119, lon: 78.2933, city: "Kurnool", state: "Andhra Pradesh" },

  // Kerala
  { name: "Cochin International Airport (COK)", iata: "COK", lat: 10.1520, lon: 76.4019, city: "Kochi", state: "Kerala" },
  { name: "Trivandrum International Airport (TRV)", iata: "TRV", lat: 8.4821, lon: 76.9200, city: "Thiruvananthapuram", state: "Kerala" },
  { name: "Calicut International Airport (CCJ)", iata: "CCJ", lat: 11.1368, lon: 75.9553, city: "Kozhikode", state: "Kerala" },
  { name: "Kannur International Airport (CNN)", iata: "CNN", lat: 11.9174, lon: 75.5484, city: "Kannur", state: "Kerala" },

  // Gujarat
  { name: "Sardar Vallabhbhai Patel Int'l Airport (AMD)", iata: "AMD", lat: 23.0772, lon: 72.6347, city: "Ahmedabad", state: "Gujarat" },
  { name: "Surat International Airport (STV)", iata: "STV", lat: 21.1139, lon: 72.7419, city: "Surat", state: "Gujarat" },
  { name: "Vadodara Airport (BDQ)", iata: "BDQ", lat: 22.3362, lon: 73.2263, city: "Vadodara", state: "Gujarat" },
  { name: "Rajkot International Airport (HSR)", iata: "HSR", lat: 22.3486, lon: 70.9983, city: "Rajkot", state: "Gujarat" },
  { name: "Bhavnagar Airport (BHU)", iata: "BHU", lat: 21.7522, lon: 72.1856, city: "Bhavnagar", state: "Gujarat" },
  { name: "Jamnagar Airport (JGA)", iata: "JGA", lat: 22.4659, lon: 70.0127, city: "Jamnagar", state: "Gujarat" },
  { name: "Porbandar Airport (PBD)", iata: "PBD", lat: 21.6489, lon: 69.6572, city: "Porbandar", state: "Gujarat" },
  { name: "Bhuj Airport (BHJ)", iata: "BHJ", lat: 23.2878, lon: 69.6703, city: "Bhuj", state: "Gujarat" },
  { name: "Keshod Airport (IXK)", iata: "IXK", lat: 21.3172, lon: 70.2694, city: "Keshod", state: "Gujarat" },

  // Uttar Pradesh
  { name: "Chaudhary Charan Singh Int'l Airport (LKO)", iata: "LKO", lat: 26.7606, lon: 80.8893, city: "Lucknow", state: "Uttar Pradesh" },
  { name: "Lal Bahadur Shastri Int'l Airport (VNS)", iata: "VNS", lat: 25.4524, lon: 82.8593, city: "Varanasi", state: "Uttar Pradesh" },
  { name: "Maharishi Valmiki Int'l Airport (AYJ)", iata: "AYJ", lat: 26.7454, lon: 82.1550, city: "Ayodhya", state: "Uttar Pradesh" },
  { name: "Prayagraj Airport (IXD)", iata: "IXD", lat: 25.4402, lon: 81.7341, city: "Prayagraj", state: "Uttar Pradesh" },
  { name: "Kanpur Airport (KNU)", iata: "KNU", lat: 26.4419, lon: 80.4124, city: "Kanpur", state: "Uttar Pradesh" },
  { name: "Agra Airport (AGR)", iata: "AGR", lat: 27.1558, lon: 77.9609, city: "Agra", state: "Uttar Pradesh" },
  { name: "Gorakhpur Airport (GOP)", iata: "GOP", lat: 26.7397, lon: 83.4497, city: "Gorakhpur", state: "Uttar Pradesh" },
  { name: "Bareilly Airport (BEK)", iata: "BEK", lat: 28.4222, lon: 79.4503, city: "Bareilly", state: "Uttar Pradesh" },

  // Bihar
  { name: "Jayprakash Narayan Airport (PAT)", iata: "PAT", lat: 25.5913, lon: 85.0880, city: "Patna", state: "Bihar" },
  { name: "Gaya Airport (GAY)", iata: "GAY", lat: 24.7443, lon: 84.9512, city: "Gaya", state: "Bihar" },
  { name: "Darbhanga Airport (DBR)", iata: "DBR", lat: 26.1950, lon: 85.9144, city: "Darbhanga", state: "Bihar" },

  // Odisha
  { name: "Biju Patnaik Airport (BBI)", iata: "BBI", lat: 20.2444, lon: 85.8178, city: "Bhubaneswar", state: "Odisha" },
  { name: "Veer Surendra Sai Airport (JRG)", iata: "JRG", lat: 21.9142, lon: 84.0505, city: "Jharsuguda", state: "Odisha" },

  // Jharkhand
  { name: "Birsa Munda Airport (IXR)", iata: "IXR", lat: 23.3143, lon: 85.3217, city: "Ranchi", state: "Jharkhand" },
  { name: "Deoghar Airport (DGH)", iata: "DGH", lat: 24.4439, lon: 86.7042, city: "Deoghar", state: "Jharkhand" },

  // Madhya Pradesh
  { name: "Devi Ahilya Bai Holkar Airport (IDR)", iata: "IDR", lat: 22.7217, lon: 75.8011, city: "Indore", state: "Madhya Pradesh" },
  { name: "Raja Bhoj Airport (BHO)", iata: "BHO", lat: 23.2875, lon: 77.3378, city: "Bhopal", state: "Madhya Pradesh" },
  { name: "Jabalpur Airport (JLR)", iata: "JLR", lat: 23.1778, lon: 80.0522, city: "Jabalpur", state: "Madhya Pradesh" },
  { name: "Rajmata Vijaya Raje Scindia Airport (GWL)", iata: "GWL", lat: 26.2933, lon: 78.2278, city: "Gwalior", state: "Madhya Pradesh" },
  { name: "Khajuraho Airport (HJR)", iata: "HJR", lat: 24.8172, lon: 79.9197, city: "Khajuraho", state: "Madhya Pradesh" },

  // Chhattisgarh
  { name: "Swami Vivekananda Airport (RPR)", iata: "RPR", lat: 21.1804, lon: 81.7388, city: "Raipur", state: "Chhattisgarh" },
  { name: "Bilaspur Airport (PAB)", iata: "PAB", lat: 21.9883, lon: 82.1111, city: "Bilaspur", state: "Chhattisgarh" },
  { name: "Jagdalpur Airport (JGB)", iata: "JGB", lat: 19.0736, lon: 82.0322, city: "Jagdalpur", state: "Chhattisgarh" },

  // Rajasthan
  { name: "Jaipur International Airport (JAI)", iata: "JAI", lat: 26.8242, lon: 75.8122, city: "Jaipur", state: "Rajasthan" },
  { name: "Maharana Pratap Airport (UDR)", iata: "UDR", lat: 24.6177, lon: 73.8961, city: "Udaipur", state: "Rajasthan" },
  { name: "Jodhpur Airport (JDH)", iata: "JDH", lat: 26.2511, lon: 73.0489, city: "Jodhpur", state: "Rajasthan" },
  { name: "Jaisalmer Airport (JSA)", iata: "JSA", lat: 26.8887, lon: 70.8653, city: "Jaisalmer", state: "Rajasthan" },
  { name: "Bikaner Airport (BKB)", iata: "BKB", lat: 28.0706, lon: 73.2064, city: "Bikaner", state: "Rajasthan" },
  { name: "Kishangarh Airport (KQH)", iata: "KQH", lat: 26.6022, lon: 74.8131, city: "Ajmer / Kishangarh", state: "Rajasthan" },

  // Punjab & Chandigarh
  { name: "Sri Guru Ram Dass Jee Int'l Airport (ATQ)", iata: "ATQ", lat: 31.7096, lon: 74.7973, city: "Amritsar", state: "Punjab" },
  { name: "Shaheed Bhagat Singh Int'l Airport (IXC)", iata: "IXC", lat: 30.6735, lon: 76.7885, city: "Chandigarh", state: "Chandigarh" },
  { name: "Bathinda Airport (BUP)", iata: "BUP", lat: 30.2708, lon: 74.7578, city: "Bathinda", state: "Punjab" },

  // Uttarakhand
  { name: "Dehradun Jolly Grant Airport (DED)", iata: "DED", lat: 30.1897, lon: 78.1803, city: "Dehradun", state: "Uttarakhand" },
  { name: "Pantnagar Airport (PGH)", iata: "PGH", lat: 29.0333, lon: 79.4736, city: "Pantnagar", state: "Uttarakhand" },

  // Jammu & Kashmir and Ladakh
  { name: "Sheikh ul-Alam Int'l Airport (SXR)", iata: "SXR", lat: 33.9871, lon: 74.7741, city: "Srinagar", state: "Jammu and Kashmir" },
  { name: "Jammu Airport (IXJ)", iata: "IXJ", lat: 32.6891, lon: 74.8374, city: "Jammu", state: "Jammu and Kashmir" },
  { name: "Kushok Bakula Rimpochee Airport (IXL)", iata: "IXL", lat: 34.1359, lon: 77.5465, city: "Leh", state: "Ladakh" },

  // Himachal Pradesh
  { name: "Kullu-Manali Airport (KUU)", iata: "KUU", lat: 31.8767, lon: 77.1542, city: "Kullu", state: "Himachal Pradesh" },
  { name: "Kangra Airport (DHM)", iata: "DHM", lat: 32.1651, lon: 76.2634, city: "Dharamshala", state: "Himachal Pradesh" },
  { name: "Shimla Airport (SLV)", iata: "SLV", lat: 31.0817, lon: 77.0683, city: "Shimla", state: "Himachal Pradesh" },

  // Goa
  { name: "Goa Dabolim Airport (GOI)", iata: "GOI", lat: 15.3808, lon: 73.8313, city: "Dabolim", state: "Goa" },
  { name: "Manohar International Airport (GOX)", iata: "GOX", lat: 15.7667, lon: 73.8667, city: "Mopa", state: "Goa" },

  // Assam & Northeast
  { name: "Lokpriya Gopinath Bordoloi Int'l Airport (GAU)", iata: "GAU", lat: 26.1061, lon: 91.5859, city: "Guwahati", state: "Assam" },
  { name: "Dibrugarh Airport (DIB)", iata: "DIB", lat: 27.4839, lon: 95.0175, city: "Dibrugarh", state: "Assam" },
  { name: "Silchar Airport (IXS)", iata: "IXS", lat: 24.9131, lon: 92.9792, city: "Silchar", state: "Assam" },
  { name: "Jorhat Airport (JRH)", iata: "JRH", lat: 26.7317, lon: 94.1755, city: "Jorhat", state: "Assam" },
  { name: "Tezpur Airport (TEZ)", iata: "TEZ", lat: 26.7094, lon: 92.7972, city: "Tezpur", state: "Assam" },
  { name: "Rupsi Airport (RUP)", iata: "RUP", lat: 26.1400, lon: 89.9056, city: "Rupsi", state: "Assam" },
  { name: "Agartala Maharaja Bir Bikram Airport (IXA)", iata: "IXA", lat: 23.8870, lon: 91.2405, city: "Agartala", state: "Tripura" },
  { name: "Imphal Airport (IMF)", iata: "IMF", lat: 24.7600, lon: 93.8967, city: "Imphal", state: "Manipur" },
  { name: "Shillong Airport (SHL)", iata: "SHL", lat: 25.7036, lon: 91.9789, city: "Shillong", state: "Meghalaya" },
  { name: "Lengpui Airport (AJL)", iata: "AJL", lat: 23.8406, lon: 92.6192, city: "Aizawl", state: "Mizoram" },
  { name: "Dimapur Airport (DMU)", iata: "DMU", lat: 25.8839, lon: 93.7711, city: "Dimapur", state: "Nagaland" },
  { name: "Hollongi Donyi Polo Airport (HGI)", iata: "HGI", lat: 26.9861, lon: 93.6483, city: "Itanagar", state: "Arunachal Pradesh" },
  { name: "Pakyong Airport (PYG)", iata: "PYG", lat: 27.2289, lon: 88.5878, city: "Gangtok / Pakyong", state: "Sikkim" },

  // Andaman & Nicobar
  { name: "Veer Savarkar Int'l Airport (IXZ)", iata: "IXZ", lat: 11.6412, lon: 92.7297, city: "Port Blair", state: "Andaman and Nicobar Islands" }
];
