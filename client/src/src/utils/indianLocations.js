/**
 * 15 Indian States with major districts and regional coordinates
 * Focused especially on Andhra Pradesh, Telangana, Maharashtra, and Karnataka
 */

export const INDIAN_STATES = [
  {
    name: 'Andhra Pradesh',
    code: 'AP',
    districts: [
      'Visakhapatnam',
      'Vijayawada (NTR)',
      'Guntur',
      'Tirupati',
      'Kurnool',
      'Kakinada',
      'Rajahmundry (East Godavari)',
      'Nellore',
      'Anantapur',
      'Kadapa (YSR)'
    ],
    center: { lat: 15.9129, lng: 79.7400 }
  },
  {
    name: 'Telangana',
    code: 'TS',
    districts: [
      'Hyderabad',
      'Secunderabad',
      'Warangal',
      'Nizamabad',
      'Karimnagar',
      'Khammam',
      'Nalgonda',
      'Mahabubnagar',
      'Rangareddy',
      'Medchal-Malkajgiri'
    ],
    center: { lat: 17.8749, lng: 78.1008 }
  },
  {
    name: 'Maharashtra',
    code: 'MH',
    districts: [
      'Mumbai',
      'Pune',
      'Nagpur',
      'Nashik',
      'Thane',
      'Aurangabad (Chhatrapati Sambhajinagar)',
      'Solapur',
      'Kolhapur',
      'Amravati',
      'Navi Mumbai'
    ],
    center: { lat: 19.7515, lng: 75.7139 }
  },
  {
    name: 'Karnataka',
    code: 'KA',
    districts: [
      'Bengaluru Urban',
      'Bengaluru Rural',
      'Mysuru',
      'Hubli-Dharwad',
      'Mangaluru (Dakshina Kannada)',
      'Belagavi',
      'Kalaburagi',
      'Ballari',
      'Davangere',
      'Shivamogga'
    ],
    center: { lat: 15.3173, lng: 75.7139 }
  },
  {
    name: 'Tamil Nadu',
    code: 'TN',
    districts: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
    center: { lat: 11.1271, lng: 78.6569 }
  },
  {
    name: 'Kerala',
    code: 'KL',
    districts: ['Thiruvananthapuram', 'Kochi (Ernakulam)', 'Kozhikode', 'Thrissur', 'Kollam'],
    center: { lat: 10.8505, lng: 76.2711 }
  },
  {
    name: 'Gujarat',
    code: 'GJ',
    districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Gandhinagar'],
    center: { lat: 22.2587, lng: 71.1924 }
  },
  {
    name: 'Delhi NCR',
    code: 'DL',
    districts: ['Central Delhi', 'New Delhi', 'South Delhi', 'North Delhi', 'Noida', 'Gurugram'],
    center: { lat: 28.7041, lng: 77.1025 }
  },
  {
    name: 'Uttar Pradesh',
    code: 'UP',
    districts: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Ghaziabad'],
    center: { lat: 26.8467, lng: 80.9462 }
  },
  {
    name: 'West Bengal',
    code: 'WB',
    districts: ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Asansol'],
    center: { lat: 22.9868, lng: 87.8550 }
  },
  {
    name: 'Rajasthan',
    code: 'RJ',
    districts: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
    center: { lat: 27.0238, lng: 74.2179 }
  },
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    districts: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
    center: { lat: 22.9734, lng: 78.6569 }
  },
  {
    name: 'Punjab',
    code: 'PB',
    districts: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Mohali'],
    center: { lat: 31.1471, lng: 75.3412 }
  },
  {
    name: 'Odisha',
    code: 'OD',
    districts: ['Bhubaneswar (Khurda)', 'Cuttack', 'Rourkela (Sundargarh)', 'Puri', 'Sambalpur'],
    center: { lat: 20.9517, lng: 85.0985 }
  },
  {
    name: 'Bihar',
    code: 'BR',
    districts: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
    center: { lat: 25.0961, lng: 85.3131 }
  }
];

export const ALL_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
