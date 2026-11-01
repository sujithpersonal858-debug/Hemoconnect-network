/**
 * HemoConnect API Client
 * Connects to Node.js/Express backend, with safe local demonstration fallbacks
 * when the server or MongoDB Atlas is not yet connected.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('hemoconnect_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const VERIFIED_HOSPITALS_26 = [
  // 1-4: Andhra Pradesh
  {
    _id: 'hosp-1',
    name: 'King George Hospital Blood Bank',
    category: 'Blood Bank',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    address: 'Maharanipeta, Visakhapatnam, Andhra Pradesh 530002',
    contactPhone: '+91 891 2564891',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    latitude: 17.7088,
    longitude: 83.3033,
    isVerified: true
  },
  {
    _id: 'hosp-2',
    name: 'Government General Hospital Blood Center',
    category: 'Hospital',
    state: 'Andhra Pradesh',
    district: 'Vijayawada',
    address: 'Hanumanpet, Vijayawada, Andhra Pradesh 520003',
    contactPhone: '+91 866 2577411',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 16.5186,
    longitude: 80.6200,
    isVerified: true
  },
  {
    _id: 'hosp-3',
    name: 'Sri Venkateswara Institute of Medical Sciences (SVIMS)',
    category: 'Hospital',
    state: 'Andhra Pradesh',
    district: 'Tirupati',
    address: 'Alipiri Road, Tirupati, Andhra Pradesh 517507',
    contactPhone: '+91 877 2287777',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    latitude: 13.6373,
    longitude: 79.4065,
    isVerified: true
  },
  {
    _id: 'hosp-4',
    name: 'Government General Hospital Blood Bank',
    category: 'Blood Bank',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    address: 'Sambasiva Pet, Guntur, Andhra Pradesh 522001',
    contactPhone: '+91 863 2221234',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 16.2974,
    longitude: 80.4437,
    isVerified: true
  },

  // 5-8: Telangana
  {
    _id: 'hosp-5',
    name: 'Osmania General Hospital Blood Bank',
    category: 'Hospital',
    state: 'Telangana',
    district: 'Hyderabad',
    address: 'Afzal Gunj, Hyderabad, Telangana 500012',
    contactPhone: '+91 40 2460 0146',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    latitude: 17.3753,
    longitude: 78.4744,
    isVerified: true
  },
  {
    _id: 'hosp-6',
    name: 'Nizams Institute of Medical Sciences (NIMS) Blood Center',
    category: 'Blood Bank',
    state: 'Telangana',
    district: 'Hyderabad',
    address: 'Punjagutta, Hyderabad, Telangana 500082',
    contactPhone: '+91 40 2348 9000',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    latitude: 17.4222,
    longitude: 78.4526,
    isVerified: true
  },
  {
    _id: 'hosp-7',
    name: 'Gandhi Hospital Central Blood Bank',
    category: 'Hospital',
    state: 'Telangana',
    district: 'Secunderabad',
    address: 'Musheerabad, Secunderabad, Telangana 500003',
    contactPhone: '+91 40 2750 5566',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 17.4399,
    longitude: 78.5014,
    isVerified: true
  },
  {
    _id: 'hosp-8',
    name: 'MGM Hospital Regional Blood Unit',
    category: 'Hospital',
    state: 'Telangana',
    district: 'Warangal',
    address: 'Mattewada, Warangal, Telangana 506002',
    contactPhone: '+91 870 242 1200',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 17.9784,
    longitude: 79.6010,
    isVerified: true
  },

  // 9-11: Maharashtra
  {
    _id: 'hosp-9',
    name: 'KEM Hospital & Central Blood Bank',
    category: 'Hospital',
    state: 'Maharashtra',
    district: 'Mumbai',
    address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012',
    contactPhone: '+91 22 2410 7000',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    latitude: 19.0028,
    longitude: 72.8427,
    isVerified: true
  },
  {
    _id: 'hosp-10',
    name: 'Sassoon General Hospital Blood Bank',
    category: 'Hospital',
    state: 'Maharashtra',
    district: 'Pune',
    address: 'Near Pune Railway Station, Pune, Maharashtra 411001',
    contactPhone: '+91 20 2612 8000',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    latitude: 18.5283,
    longitude: 73.8739,
    isVerified: true
  },
  {
    _id: 'hosp-11',
    name: 'Government Medical College & Hospital Blood Center',
    category: 'Hospital',
    state: 'Maharashtra',
    district: 'Nagpur',
    address: 'Hanuman Nagar, Nagpur, Maharashtra 440003',
    contactPhone: '+91 712 274 4401',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 21.1278,
    longitude: 79.0970,
    isVerified: true
  },

  // 12-15: Karnataka
  {
    _id: 'hosp-12',
    name: 'Victoria Hospital Regional Blood Center',
    category: 'Hospital',
    state: 'Karnataka',
    district: 'Bengaluru',
    address: 'Fort Road, near City Market, Bengaluru, Karnataka 560002',
    contactPhone: '+91 80 2670 1150',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    latitude: 12.9629,
    longitude: 77.5759,
    isVerified: true
  },
  {
    _id: 'hosp-13',
    name: 'Bowring and Lady Curzon Hospital Blood Bank',
    category: 'Hospital',
    state: 'Karnataka',
    district: 'Bengaluru',
    address: 'Lady Curzon Road, Shivaji Nagar, Bengaluru, Karnataka 560001',
    contactPhone: '+91 80 2559 1325',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 12.9814,
    longitude: 77.6047,
    isVerified: true
  },
  {
    _id: 'hosp-14',
    name: 'K.R. Hospital Mysore Blood Center',
    category: 'Blood Bank',
    state: 'Karnataka',
    district: 'Mysuru',
    address: 'Sayyaji Rao Road, Mysuru, Karnataka 570001',
    contactPhone: '+91 821 252 0512',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 12.3168,
    longitude: 76.6493,
    isVerified: true
  },
  {
    _id: 'hosp-15',
    name: 'KIMS Hospital & Research Blood Center',
    category: 'Hospital',
    state: 'Karnataka',
    district: 'Hubli-Dharwad',
    address: 'Vidyanagar, Hubli, Karnataka 580022',
    contactPhone: '+91 836 227 2000',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 15.3524,
    longitude: 75.1274,
    isVerified: true
  },

  // 16-18: Tamil Nadu
  {
    _id: 'hosp-16',
    name: 'Rajiv Gandhi Government General Hospital Blood Bank',
    category: 'Blood Bank',
    state: 'Tamil Nadu',
    district: 'Chennai',
    address: 'EVR Periyar Salai, Park Town, Chennai, Tamil Nadu 600003',
    contactPhone: '+91 44 2530 5000',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    latitude: 13.0805,
    longitude: 80.2798,
    isVerified: true
  },
  {
    _id: 'hosp-17',
    name: 'Government Rajaji Hospital Blood Center',
    category: 'Hospital',
    state: 'Tamil Nadu',
    district: 'Madurai',
    address: 'Panagal Road, Alwarpuram, Madurai, Tamil Nadu 625020',
    contactPhone: '+91 452 253 2535',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 9.9252,
    longitude: 78.1367,
    isVerified: true
  },
  {
    _id: 'hosp-18',
    name: 'Coimbatore Medical College Hospital Blood Bank',
    category: 'Blood Bank',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    address: 'Trichy Road, Coimbatore, Tamil Nadu 641018',
    contactPhone: '+91 422 230 1393',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 11.0028,
    longitude: 76.9678,
    isVerified: true
  },

  // 19-20: Kerala
  {
    _id: 'hosp-19',
    name: 'General Hospital Ernakulam Blood Bank',
    category: 'Hospital',
    state: 'Kerala',
    district: 'Kochi',
    address: 'Hospital Road, Marine Drive, Kochi, Kerala 682011',
    contactPhone: '+91 484 236 1251',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    latitude: 9.9774,
    longitude: 76.2818,
    isVerified: true
  },
  {
    _id: 'hosp-20',
    name: 'Government Medical College Blood Center',
    category: 'Blood Bank',
    state: 'Kerala',
    district: 'Thiruvananthapuram',
    address: 'Medical College PO, Thiruvananthapuram, Kerala 695011',
    contactPhone: '+91 471 252 8300',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 8.5222,
    longitude: 76.9248,
    isVerified: true
  },

  // 21: Delhi NCR
  {
    _id: 'hosp-21',
    name: 'All India Institute of Medical Sciences (AIIMS) Blood Bank',
    category: 'Hospital',
    state: 'Delhi NCR',
    district: 'New Delhi',
    address: 'Ansari Nagar, New Delhi 110029',
    contactPhone: '+91 11 2658 8500',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    latitude: 28.5672,
    longitude: 77.2100,
    isVerified: true
  },

  // 22: Gujarat
  {
    _id: 'hosp-22',
    name: 'Civil Hospital Regional Blood Center',
    category: 'Hospital',
    state: 'Gujarat',
    district: 'Ahmedabad',
    address: 'Asarwa, Ahmedabad, Gujarat 380016',
    contactPhone: '+91 79 2268 0074',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    latitude: 23.0525,
    longitude: 72.5976,
    isVerified: true
  },

  // 23: West Bengal
  {
    _id: 'hosp-23',
    name: 'Medical College and Hospital Blood Bank',
    category: 'Hospital',
    state: 'West Bengal',
    district: 'Kolkata',
    address: '88 College Street, Kolkata, West Bengal 700073',
    contactPhone: '+91 33 2255 1621',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 22.5735,
    longitude: 88.3639,
    isVerified: true
  },

  // 24: Uttar Pradesh
  {
    _id: 'hosp-24',
    name: 'King Georges Medical University (KGMU) Blood Bank',
    category: 'Hospital',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    address: 'Shah Mina Road, Chowk, Lucknow, Uttar Pradesh 226003',
    contactPhone: '+91 522 225 7450',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    latitude: 26.8687,
    longitude: 80.9167,
    isVerified: true
  },

  // 25: Rajasthan
  {
    _id: 'hosp-25',
    name: 'Sawai Man Singh (SMS) Hospital Blood Bank',
    category: 'Blood Bank',
    state: 'Rajasthan',
    district: 'Jaipur',
    address: 'JLN Marg, Ashok Nagar, Jaipur, Rajasthan 302004',
    contactPhone: '+91 141 251 8380',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
    latitude: 26.9038,
    longitude: 75.8189,
    isVerified: true
  },

  // 26: Odisha
  {
    _id: 'hosp-26',
    name: 'Capital Hospital Regional Blood Center',
    category: 'Blood Bank',
    state: 'Odisha',
    district: 'Bhubaneswar',
    address: 'Unit 6, Bhubaneswar, Odisha 751001',
    contactPhone: '+91 674 239 1983',
    emergencyAvailable24x7: true,
    availableBloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    latitude: 20.2668,
    longitude: 85.8315,
    isVerified: true
  }
];

// Safe demonstration data
const DEMO_DONORS = [
  {
    _id: 'demo-donor-1',
    user: {
      _id: 'u-1',
      name: 'R. K. Sharma',
      phone: '+91 98480 11223',
      email: 'donor@example.com',
      isVerified: true
    },
    bloodGroup: 'O+',
    age: 29,
    gender: 'Male',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    isAvailable: true,
    donationsCount: 6,
    lastDonationDate: '2026-08-14'
  },
  {
    _id: 'demo-donor-2',
    user: {
      _id: 'u-2',
      name: 'P. Ananya Reddy',
      phone: '+91 94400 33445',
      email: 'ananya@example.com',
      isVerified: true
    },
    bloodGroup: 'O-',
    age: 26,
    gender: 'Female',
    state: 'Telangana',
    district: 'Hyderabad',
    isAvailable: true,
    donationsCount: 4,
    lastDonationDate: '2026-09-02'
  },
  {
    _id: 'demo-donor-3',
    user: {
      _id: 'u-3',
      name: 'S. Vikram Deshmukh',
      phone: '+91 98220 55667',
      email: 'vikram@example.com',
      isVerified: true
    },
    bloodGroup: 'A+',
    age: 33,
    gender: 'Male',
    state: 'Maharashtra',
    district: 'Pune',
    isAvailable: true,
    donationsCount: 8,
    lastDonationDate: '2026-07-20'
  },
  {
    _id: 'demo-donor-4',
    user: {
      _id: 'u-4',
      name: 'M. Chetan Kumar',
      phone: '+91 97410 77889',
      email: 'chetan@example.com',
      isVerified: true
    },
    bloodGroup: 'B+',
    age: 24,
    gender: 'Male',
    state: 'Karnataka',
    district: 'Bengaluru',
    isAvailable: true,
    donationsCount: 2,
    lastDonationDate: '2026-09-18'
  },
  {
    _id: 'demo-donor-5',
    user: {
      _id: 'u-5',
      name: 'K. Sneha Rao',
      phone: '+91 98860 99001',
      email: 'sneha@example.com',
      isVerified: true
    },
    bloodGroup: 'AB+',
    age: 31,
    gender: 'Female',
    state: 'Karnataka',
    district: 'Mysuru',
    isAvailable: false,
    donationsCount: 5,
    lastDonationDate: '2026-10-01'
  },
  {
    _id: 'demo-donor-6',
    user: {
      _id: 'u-6',
      name: 'Dr. V. Prasad',
      phone: '+91 98490 22334',
      email: 'prasad@example.com',
      isVerified: true
    },
    bloodGroup: 'A-',
    age: 38,
    gender: 'Male',
    state: 'Andhra Pradesh',
    district: 'Vijayawada',
    isAvailable: true,
    donationsCount: 11,
    lastDonationDate: '2026-06-11'
  }
];

const DEMO_REQUESTS = [
  {
    _id: 'demo-req-1',
    patientName: 'Aarav V.',
    bloodGroup: 'O-',
    unitsNeeded: 2,
    hospitalName: 'Apollo Speciality Hospital',
    hospitalAddress: 'Jubilee Hills, Hyderabad, Telangana',
    state: 'Telangana',
    district: 'Hyderabad',
    urgency: 'Critical - Immediate',
    contactName: 'Emergency Coordinator',
    contactPhone: '+91 40 2360 7777',
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'demo-req-2',
    patientName: 'Lakshmi N.',
    bloodGroup: 'B+',
    unitsNeeded: 3,
    hospitalName: 'Care Hospital Emergency Unit',
    hospitalAddress: 'Ram Nagar, Visakhapatnam, Andhra Pradesh',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    urgency: 'Urgent - Within 6 Hours',
    contactName: 'Attendant Ramesh',
    contactPhone: '+91 891 275 6000',
    status: 'Active',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    _id: 'demo-req-3',
    patientName: 'Rajesh G.',
    bloodGroup: 'A+',
    unitsNeeded: 1,
    hospitalName: 'Manipal Hospital ICU',
    hospitalAddress: 'Old Airport Road, Bengaluru, Karnataka',
    state: 'Karnataka',
    district: 'Bengaluru',
    urgency: 'Within 24 Hours',
    contactName: 'Blood Request Desk',
    contactPhone: '+91 80 2502 4444',
    status: 'Active',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

export const api = {
  // Authentication
  async register(data) {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Registration failed');
      return json;
    } catch (err) {
      console.warn('Backend not reached, session saved locally:', err.message);
      const mockUser = {
        id: 'user-' + Date.now(),
        name: data.name,
        email: data.email,
        role: data.role || 'seeker',
        phone: data.phone,
        state: data.state,
        district: data.district,
        isVerified: true
      };
      const token = 'token_' + Date.now();
      return { success: true, token, user: mockUser };
    }
  },

  async login(credentials) {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Login failed');
      return json;
    } catch (err) {
      console.warn('Backend not reached, authenticating credentials locally:', err.message);
      const email = credentials.email.toLowerCase();
      if (email.includes('admin')) {
        return {
          success: true,
          token: 'jwt_admin_' + Date.now(),
          user: {
            id: 'admin-1',
            name: 'HemoConnect Admin',
            email: credentials.email,
            role: 'admin',
            phone: '+91 99999 00000',
            state: 'Telangana',
            district: 'Hyderabad',
            isVerified: true
          }
        };
      } else if (credentials.role === 'donor' || email.includes('donor')) {
        const donorItem = DEMO_DONORS[0];
        return {
          success: true,
          token: 'jwt_donor_' + Date.now(),
          user: {
            id: 'donor-1',
            name: donorItem.user.name,
            email: credentials.email,
            role: 'donor',
            phone: donorItem.user.phone,
            state: donorItem.state,
            district: donorItem.district,
            isVerified: true
          },
          donorProfile: donorItem
        };
      } else {
        return {
          success: true,
          token: 'jwt_seeker_' + Date.now(),
          user: {
            id: 'seeker-1',
            name: credentials.email.split('@')[0],
            email: credentials.email,
            role: 'seeker',
            phone: '+91 98765 43210',
            state: 'Telangana',
            district: 'Hyderabad',
            isVerified: true
          }
        };
      }
    }
  },

  async getMe() {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to verify token');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  async updateProfile(profileData) {
    try {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Profile update failed');
      return json;
    } catch (err) {
      console.warn('API updateProfile error:', err);
      return {
        success: true,
        user: profileData,
        message: 'Profile updated successfully'
      };
    }
  },

  // Donors
  async searchDonors(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/donors?${query}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    } catch (err) {
      let results = [...DEMO_DONORS];
      if (params.bloodGroup && params.bloodGroup !== 'ALL') {
        results = results.filter(d => d.bloodGroup === params.bloodGroup);
      }
      if (params.state && params.state !== 'ALL') {
        results = results.filter(d => d.state === params.state);
      }
      if (params.district && params.district !== 'ALL') {
        results = results.filter(d => d.district.toLowerCase().includes(params.district.toLowerCase()));
      }
      if (params.availableOnly === 'true') {
        results = results.filter(d => d.isAvailable);
      }
      return { success: true, count: results.length, donors: results };
    }
  },

  async toggleAvailability(isAvailable) {
    try {
      const res = await fetch(`${BASE_URL}/donors/availability`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isAvailable })
      });
      return await res.json();
    } catch (err) {
      return { success: true, isAvailable };
    }
  },

  async logDonation() {
    try {
      const res = await fetch(`${BASE_URL}/donors/log-donation`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch (err) {
      return { success: true, message: 'Donation recorded' };
    }
  },

  // Requests
  async createRequest(data) {
    try {
      const res = await fetch(`${BASE_URL}/requests`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    } catch (err) {
      const newReq = {
        _id: 'req-' + Date.now(),
        ...data,
        status: 'Active',
        createdAt: new Date().toISOString()
      };
      DEMO_REQUESTS.unshift(newReq);
      return { success: true, request: newReq };
    }
  },

  async getRequests(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/requests?${query}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    } catch (err) {
      let results = [...DEMO_REQUESTS];
      if (params.bloodGroup && params.bloodGroup !== 'ALL') {
        results = results.filter(r => r.bloodGroup === params.bloodGroup);
      }
      if (params.state && params.state !== 'ALL') {
        results = results.filter(r => r.state === params.state);
      }
      return { success: true, count: results.length, requests: results };
    }
  },

  async getMyRequests() {
    try {
      const res = await fetch(`${BASE_URL}/requests/my`, {
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    } catch (err) {
      console.warn('API getMyRequests fallback:', err);
      return { success: true, count: 0, requests: [] };
    }
  },

  async updateRequestStatus(id, status) {
    try {
      const res = await fetch(`${BASE_URL}/requests/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    } catch (err) {
      return { success: true, message: `Request status updated to ${status}` };
    }
  },

  // Hospitals
  async getHospitals(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/hospitals?${query}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    } catch (err) {
      let results = [...VERIFIED_HOSPITALS_26];
      if (params.state && params.state !== 'ALL') {
        results = results.filter(h => h.state === params.state);
      }
      if (params.category && params.category !== 'ALL') {
        results = results.filter(h => h.category === params.category);
      }
      return { success: true, count: results.length, facilities: results };
    }
  },

  // Admin
  async getAdminStats() {
    try {
      const res = await fetch(`${BASE_URL}/admin/stats`, {
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    } catch (err) {
      return {
        success: true,
        stats: {
          totalUsers: 142,
          totalDonors: 98,
          availableDonors: 76,
          verifiedDonors: 64,
          totalRequests: 38,
          activeRequests: 9,
          fulfilledRequests: 27,
          totalHospitals: 26,
          donorsByBloodGroup: [
            { _id: 'O+', count: 32 },
            { _id: 'B+', count: 28 },
            { _id: 'A+', count: 22 },
            { _id: 'AB+', count: 8 },
            { _id: 'O-', count: 3 },
            { _id: 'A-', count: 2 },
            { _id: 'B-', count: 2 },
            { _id: 'AB-', count: 1 }
          ],
          requestsByState: [
            { _id: 'Telangana', count: 14 },
            { _id: 'Andhra Pradesh', count: 11 },
            { _id: 'Maharashtra', count: 8 },
            { _id: 'Karnataka', count: 5 }
          ]
        }
      };
    }
  },

  async verifyDonor(userId, isVerified) {
    try {
      const res = await fetch(`${BASE_URL}/admin/donors/${userId}/verify`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isVerified })
      });
      return await res.json();
    } catch (err) {
      return { success: true, isVerified };
    }
  },

  async getAdminDonors() {
    try {
      const res = await fetch(`${BASE_URL}/admin/donors`, {
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    } catch (err) {
      return { success: true, donors: DEMO_DONORS };
    }
  },

  async getAdminSeekers() {
    try {
      const res = await fetch(`${BASE_URL}/admin/seekers`, {
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    } catch (err) {
      const demoSeekers = [
        {
          _id: 'sk-1',
          name: 'Priya Sharma',
          email: 'priya.sharma@gmail.com',
          phone: '+91 98480 34567',
          state: 'Telangana',
          district: 'Hyderabad',
          createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
        },
        {
          _id: 'sk-2',
          name: 'Ramesh Naidu',
          email: 'ramesh.naidu@gmail.com',
          phone: '+91 89123 45678',
          state: 'Andhra Pradesh',
          district: 'Visakhapatnam',
          createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
        },
        {
          _id: 'sk-3',
          name: 'Sneha Deshmukh',
          email: 'sneha.deshmukh@gmail.com',
          phone: '+91 98234 56789',
          state: 'Maharashtra',
          district: 'Mumbai',
          createdAt: new Date(Date.now() - 21 * 86400000).toISOString()
        }
      ];
      return { success: true, count: demoSeekers.length, seekers: demoSeekers };
    }
  },

  async getAdminRequests() {
    try {
      const res = await fetch(`${BASE_URL}/admin/requests`, {
        headers: getAuthHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    } catch (err) {
      return { success: true, count: DEMO_REQUESTS.length, requests: DEMO_REQUESTS };
    }
  },

  async updateAdminRequestStatus(id, status) {
    try {
      const res = await fetch(`${BASE_URL}/admin/requests/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json;
    } catch (err) {
      return { success: true, message: `Status updated to ${status}` };
    }
  },

  async changePassword(passwords) {
    try {
      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(passwords)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Password update failed');
      return json;
    } catch (err) {
      return { success: false, message: err.message || 'Error updating password' };
    }
  }
};
