/**
 * Hospital Service — Localized Patna Provider Directory
 * JSON-based database of major Patna healthcare hubs
 */
const HospitalService = (() => {
  const hospitals = [
    {
      id: 'aiims-patna',
      name: 'AIIMS Patna',
      address: 'Phulwari Sharif, Patna - 801507',
      type: 'Government',
      tags: ['Government', 'Academic', 'Tertiary Care'],
      phone: '0612-2451070',
      emergency: '0612-2451071',
      ambulance: '108',
      opd: { status: 'busy', waitTime: 45 },
      beds: { total: 880, available: 23 },
      departments: [
        'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
        'Dermatology', 'Ophthalmology', 'ENT', 'Psychiatry', 'Oncology',
        'Pulmonology', 'Nephrology', 'Urology', 'Gastroenterology', 'Radiology'
      ],
      opdTimings: 'Mon-Sat: 8:00 AM - 2:00 PM',
      coordinates: { lat: 25.5768, lng: 85.0861 },
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvXopO81sqMpGMyVncNvFSBtw4r99H4t35IVXgSDt3M0kToYxOaPt2Oj5ITXgZ2QFYIC6NeFfLT8ER4YRwN8eL2z5qYSaX5LoK8r2eR7W1Q_R3k-fImyh1EzEc-rqnxlehVlxp0JP1A04-vG-UW2xBMMhgn11zad_-H3bQCUTbhMnDFYyP4r69beWdCZf5ccZ-j-JwzBYfkoL3i_Tv3-zsY3xtJDuETVTEnCSCy-9Jyi_gIQQ8oJPkqmUuG-f45lBXMBy8xJGKaJI'
    },
    {
      id: 'paras-hmri',
      name: 'Paras HMRI',
      address: 'Raja Bazar, Bailey Road, Patna - 800014',
      type: 'Private',
      tags: ['Multispecialty', '24/7 ER'],
      phone: '0612-7107107',
      emergency: '0612-7107108',
      ambulance: '0612-7107109',
      opd: { status: 'available', waitTime: 15 },
      beds: { total: 350, available: 42 },
      departments: [
        'General Medicine', 'Cardiology', 'Cardiac Surgery', 'Neurosurgery',
        'Orthopedics', 'Pediatrics', 'Gynecology', 'Oncology', 'Nephrology',
        'Urology', 'Gastroenterology', 'Pulmonology', 'Dermatology'
      ],
      opdTimings: 'Mon-Sat: 9:00 AM - 5:00 PM',
      coordinates: { lat: 25.6115, lng: 85.1376 },
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSaG4g873aQWYmgCfCzs6UJBPDU0teMZ0jdsKaeKfthtM7kBJHJQjboOJgaHIqDaaDcl5eF9YlL6G3M8uRxxk2BT9-VGgK6D1oLw-oCcUk64cN4Tvjn6Eo2ZdBHhD1SqCHrEqjVyWsxjlTOVJIhvCW1Srdojm-J2FCBnvdBh6vL1JxoDbgasVgjit-oP6RCVeXI30hvUcjEAnwLDFS-ohJ2srGpjIfJK9NhV0leHEZvNDuvnwOLPylyM8JJttX1OCZARg-kghEXzg'
    },
    {
      id: 'big-apollo',
      name: 'Big Apollo Spectra',
      address: 'Agam Kuan, Patna - 800007',
      type: 'Private',
      tags: ['Short Stay', 'Surgical'],
      phone: '0612-3500000',
      emergency: '0612-3500001',
      ambulance: '1800-1234-001',
      opd: { status: 'full', waitTime: 0 },
      beds: { total: 150, available: 0 },
      departments: [
        'General Surgery', 'Orthopedics', 'Gynecology', 'ENT',
        'Ophthalmology', 'Urology', 'Gastroenterology', 'Dermatology'
      ],
      opdTimings: 'Mon-Sat: 9:00 AM - 4:00 PM',
      coordinates: { lat: 25.5982, lng: 85.1745 },
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXmtVcBNgkB8BO8-nZuJU0CPydGjSHn16L1VGpdmsHHXOZdQRcE5cAHvSWaZrDzG_bHD471lA8fa2unzLxVJ2to-LQOKwycgxlwUZj44HqFMUNa43JGGsqLfUQDEJb0ApBJ2tWN9qZFZiE2XXW47DxsoXN4wBLcKp_9RCs7ajOrBEu2W8EqTchY-ozckeDeKRYtCrH9OIt29wybwz1mmgtC9d0HrnJdj6Klxeb_0nwL55RQn-raQ5_PdHO6Eaf16XXPcspku4ww_k'
    },
    {
      id: 'igims',
      name: 'IGIMS',
      address: 'Sheikhpura, Patna - 800014',
      type: 'Government',
      tags: ['Government', 'Super Specialty'],
      phone: '0612-2297631',
      emergency: '0612-2297632',
      ambulance: '108',
      opd: { status: 'available', waitTime: 30 },
      beds: { total: 600, available: 18 },
      departments: [
        'Cardiology', 'Cardiothoracic Surgery', 'Neurology', 'Neurosurgery',
        'Nephrology', 'Urology', 'Gastroenterology', 'Endocrinology',
        'Plastic Surgery', 'Burns Unit', 'General Medicine'
      ],
      opdTimings: 'Mon-Sat: 8:30 AM - 1:30 PM',
      coordinates: { lat: 25.6087, lng: 85.1204 },
      image: null
    },
    {
      id: 'pmch',
      name: 'PMCH',
      address: 'Ashok Rajpath, Patna - 800004',
      type: 'Government',
      tags: ['Government', 'Teaching Hospital', 'Oldest'],
      phone: '0612-2300343',
      emergency: '0612-2300344',
      ambulance: '108',
      opd: { status: 'busy', waitTime: 60 },
      beds: { total: 1800, available: 45 },
      departments: [
        'General Medicine', 'General Surgery', 'Orthopedics', 'Pediatrics',
        'Gynecology', 'Ophthalmology', 'ENT', 'Dermatology', 'Psychiatry',
        'Forensic Medicine', 'Anatomy', 'Radiology', 'Pathology'
      ],
      opdTimings: 'Mon-Sat: 8:00 AM - 12:00 PM',
      coordinates: { lat: 25.6126, lng: 85.1551 },
      image: null
    }
  ];

  const emergencyContacts = [
    { name: 'Patna Ambulance Services', number: '108', type: 'ambulance', primary: true },
    { name: 'Bihar Police Emergency', number: '100', type: 'police' },
    { name: 'Fire Brigade Patna', number: '101', type: 'fire' },
    { name: 'PMCH Emergency', number: '0612-2300344', type: 'hospital', distance: '1.2 km' },
    { name: 'IGIMS ER', number: '0612-2297632', type: 'hospital', distance: '4.5 km', beds: 2, critical: true },
    { name: 'Paras HMRI ER', number: '0612-7107108', type: 'hospital', distance: '3.1 km' }
  ];

  const bloodBanks = [
    { name: 'Red Cross Blood Center', address: 'Gandhi Maidan, Patna', phone: '0612-2219988', types: ['O+', 'B-', 'A+'] },
    { name: 'Mahavir Vatsalya Blood Bank', address: 'LCT Ghat, Main Road', phone: '0612-2534567', types: ['All'] }
  ];

  const specialties = [
    'General', 'Cardiology', 'Pediatrics', 'Dermatology', 'Neurology',
    'Orthopedics', 'Gynecology', 'Ophthalmology', 'ENT', 'Oncology'
  ];

  const blocks = ['Patna Sadar', 'Phulwari Sharif', 'Danapur', 'Sampatchak', 'Maner', 'Masaurhi'];

  // Public directory data compiled from official hospital pages where available.
  // Slot availability remains simulated; doctor names, hospitals, departments and OPD hints are public-directory data.
  const doctors = [
    {
      id: 'paras-jawed-anwer',
      hospitalId: 'paras-hmri',
      name: 'Dr. Jawed Anwer',
      specialty: 'Cardiology',
      designation: 'Senior Consultant - Cardiology',
      qualification: 'MBBS, MD, DM',
      opdDays: 'Mon-Sat',
      opdTime: '10:00 AM - 5:00 PM',
      room: 'Cardiac Sciences OPD',
      feeNote: 'Private consultation, confirm fee with hospital',
      source: 'Paras Health doctor directory'
    },
    {
      id: 'paras-ram-sagar-roy',
      hospitalId: 'paras-hmri',
      name: 'Dr. Ram Sagar Roy',
      specialty: 'Cardiology',
      designation: 'Chief Consultant - Cardiology',
      qualification: 'MBBS, MD, DM Cardiology',
      opdDays: 'Mon-Sat',
      opdTime: '11:30 AM - 3:50 PM',
      room: 'Cardiac Sciences OPD',
      feeNote: 'Private consultation, confirm fee with hospital',
      source: 'Paras Health doctor directory'
    },
    {
      id: 'paras-rajiv-ranjan',
      hospitalId: 'paras-hmri',
      name: 'Dr. Rajiv Ranjan',
      specialty: 'Pediatrics',
      designation: 'Senior Consultant - Pediatrics',
      qualification: 'MBBS, MD Pediatrics',
      opdDays: 'Mon-Sat',
      opdTime: '10:00 AM - 4:00 PM',
      room: 'Pediatrics OPD',
      feeNote: 'Private consultation, confirm fee with hospital',
      source: 'Paras Health paediatrics page'
    },
    {
      id: 'paras-prakash-sinha',
      hospitalId: 'paras-hmri',
      name: 'Dr. Prakash Sinha',
      specialty: 'Pediatrics',
      designation: 'Senior Consultant & HOD - Pediatric Pulmonology',
      qualification: 'Pediatric pulmonology',
      opdDays: 'Mon-Sat',
      opdTime: '10:00 AM - 4:00 PM',
      room: 'Pediatric Pulmonology OPD',
      feeNote: 'Private consultation, confirm fee with hospital',
      source: 'Paras Health pediatric pulmonology page'
    },
    {
      id: 'paras-abhishek-anand',
      hospitalId: 'paras-hmri',
      name: 'Dr. Abhishek Anand',
      specialty: 'Oncology',
      designation: 'Director & HOD - Medical Oncology',
      qualification: 'MBBS, MD Medicine, DM Medical Oncology',
      opdDays: 'Mon-Sat',
      opdTime: '10:00 AM - 4:00 PM',
      room: 'Onco Care OPD',
      feeNote: 'Private consultation, confirm fee with hospital',
      source: 'Paras Health Patna page'
    },
    {
      id: 'igims-bp-singh',
      hospitalId: 'igims',
      name: 'Dr. B. P. Singh',
      specialty: 'Cardiology',
      designation: 'Professor & HOD - Cardiology',
      qualification: 'Cardiology faculty',
      opdDays: 'Mon-Sat',
      opdTime: '8:30 AM - 1:30 PM',
      room: 'Cardiology OPD',
      feeNote: 'Government OPD registration applies',
      source: 'IGIMS faculty / employee directory'
    },
    {
      id: 'igims-ravi-vishnu-prasad',
      hospitalId: 'igims',
      name: 'Dr. Ravi Vishnu Prasad',
      specialty: 'Cardiology',
      designation: 'Additional Professor - Cardiology',
      qualification: 'Cardiology faculty',
      opdDays: 'Mon-Sat',
      opdTime: '8:30 AM - 1:30 PM',
      room: 'Cardiology OPD',
      feeNote: 'Government OPD registration applies',
      source: 'IGIMS faculty / employee directory'
    },
    {
      id: 'igims-naresh-kumar',
      hospitalId: 'igims',
      name: 'Dr. Naresh Kumar',
      specialty: 'General',
      designation: 'Professor & HOD - General Medicine',
      qualification: 'General Medicine faculty',
      opdDays: 'Mon-Sat',
      opdTime: '8:30 AM - 1:30 PM',
      room: 'Medicine OPD',
      feeNote: 'Government OPD registration applies',
      source: 'IGIMS faculty / employee directory'
    },
    {
      id: 'igims-ashok-kumar',
      hospitalId: 'igims',
      name: 'Dr. Ashok Kumar',
      specialty: 'Neurology',
      designation: 'Professor & HOD - Neuro Medicine',
      qualification: 'Neuro Medicine faculty',
      opdDays: 'Mon-Sat',
      opdTime: '8:30 AM - 1:30 PM',
      room: 'Neuro Medicine OPD',
      feeNote: 'Government OPD registration applies',
      source: 'IGIMS employee directory'
    },
    {
      id: 'igims-santosh-kumar',
      hospitalId: 'igims',
      name: 'Dr. Santosh Kumar',
      specialty: 'Orthopedics',
      designation: 'Professor & HOD - Orthopedics',
      qualification: 'Orthopedics faculty',
      opdDays: 'Mon-Sat',
      opdTime: '8:30 AM - 1:30 PM',
      room: 'Orthopedics OPD',
      feeNote: 'Government OPD registration applies',
      source: 'IGIMS faculty / employee directory'
    },
    {
      id: 'igims-jayant-prakash',
      hospitalId: 'igims',
      name: 'Dr. Jayant Prakash',
      specialty: 'Pediatrics',
      designation: 'Professor & HOD - Paediatrics',
      qualification: 'Paediatrics faculty',
      opdDays: 'Mon-Sat',
      opdTime: '8:30 AM - 1:30 PM',
      room: 'Paediatrics OPD',
      feeNote: 'Government OPD registration applies',
      source: 'IGIMS faculty directory'
    },
    {
      id: 'igims-rakesh-kumar-singh',
      hospitalId: 'igims',
      name: 'Dr. Rakesh Kumar Singh',
      specialty: 'ENT',
      designation: 'Professor & HOD - ENT',
      qualification: 'ENT faculty',
      opdDays: 'Mon-Sat',
      opdTime: '8:30 AM - 1:30 PM',
      room: 'ENT OPD',
      feeNote: 'Government OPD registration applies',
      source: 'IGIMS faculty / employee directory'
    },
    {
      id: 'igims-kranti-chandan-jaykar',
      hospitalId: 'igims',
      name: 'Dr. Kranti Chandan Jaykar',
      specialty: 'Dermatology',
      designation: 'Additional Professor - Skin & V.D.',
      qualification: 'Dermatology faculty',
      opdDays: 'Mon-Sat',
      opdTime: '8:30 AM - 1:30 PM',
      room: 'Skin & V.D. OPD',
      feeNote: 'Government OPD registration applies',
      source: 'IGIMS employee directory'
    },
    {
      id: 'pmch-devendra-sinha',
      hospitalId: 'pmch',
      name: 'Dr. Devendra Kumar Sinha',
      specialty: 'General',
      designation: 'Assistant Professor - Medicine',
      qualification: 'Medicine faculty',
      opdDays: 'Mon-Sat',
      opdTime: '9:00 AM - 2:00 PM',
      room: 'Medicine Outdoor',
      feeNote: 'Government OPD registration applies',
      source: 'PMCH teaching staff list'
    },
    {
      id: 'pmch-bhupendra-narain',
      hospitalId: 'pmch',
      name: 'Dr. Bhupendra Narain',
      specialty: 'Pediatrics',
      designation: 'Professor - Paediatrics',
      qualification: 'Paediatrics faculty',
      opdDays: 'Mon-Sat',
      opdTime: '9:00 AM - 2:00 PM',
      room: 'Paediatrics Outdoor',
      feeNote: 'Government OPD registration applies',
      source: 'PMCH teaching staff list'
    },
    {
      id: 'pmch-vineet-sinha',
      hospitalId: 'pmch',
      name: 'Dr. Vineet Sinha',
      specialty: 'ENT',
      designation: 'ENT OPD Doctor',
      qualification: 'ENT',
      opdDays: 'Monday, Thursday',
      opdTime: '9:00 AM - 2:00 PM',
      room: 'ENT Outdoor',
      feeNote: 'Government OPD registration applies',
      source: 'PMCH ENT OPD schedule'
    },
    {
      id: 'pmch-priti-sharma',
      hospitalId: 'pmch',
      name: 'Dr. Priti Sharma',
      specialty: 'ENT',
      designation: 'ENT OPD Doctor',
      qualification: 'ENT',
      opdDays: 'Tuesday, Friday',
      opdTime: '9:00 AM - 2:00 PM',
      room: 'ENT Outdoor',
      feeNote: 'Government OPD registration applies',
      source: 'PMCH ENT OPD schedule'
    },
    {
      id: 'pmch-kaushal-kishore',
      hospitalId: 'pmch',
      name: 'Dr. Kaushal Kishore',
      specialty: 'General',
      designation: 'Professor & HOD - Medicine',
      qualification: 'Medicine faculty',
      opdDays: 'Thursday',
      opdTime: '9:00 AM - 2:00 PM',
      room: 'Medicine Outdoor',
      feeNote: 'Government OPD registration applies',
      source: 'PMCH Medicine OPD schedule'
    },
    {
      id: 'pmch-geeta-sinha',
      hospitalId: 'pmch',
      name: 'Dr. Geeta Sinha',
      specialty: 'Gynecology',
      designation: 'Professor & HOD - Gynaecology',
      qualification: 'Gynaecology faculty',
      opdDays: 'Monday',
      opdTime: '9:00 AM - 2:00 PM',
      room: 'Gynaecology Outdoor',
      feeNote: 'Government OPD registration applies',
      source: 'PMCH Gynaecology OPD schedule'
    },
    {
      id: 'pmch-k-manju',
      hospitalId: 'pmch',
      name: 'Dr. K. Manju',
      specialty: 'Gynecology',
      designation: 'Professor - Gynaecology',
      qualification: 'Gynaecology faculty',
      opdDays: 'Tuesday',
      opdTime: '9:00 AM - 2:00 PM',
      room: 'Gynaecology Outdoor',
      feeNote: 'Government OPD registration applies',
      source: 'PMCH Gynaecology OPD schedule'
    },
    {
      id: 'pmch-sanjeet-kumar',
      hospitalId: 'pmch',
      name: 'Dr. Sanjeet Kumar',
      specialty: 'Ophthalmology',
      designation: 'Eye OPD Doctor',
      qualification: 'Ophthalmology',
      opdDays: 'Monday, Friday',
      opdTime: '9:00 AM - 2:00 PM',
      room: 'Eye Outdoor',
      feeNote: 'Government OPD registration applies',
      source: 'PMCH Eye OPD schedule'
    },
    {
      id: 'pmch-nageshwar-sharma',
      hospitalId: 'pmch',
      name: 'Dr. Nageshwar Sharma',
      specialty: 'Ophthalmology',
      designation: 'Eye OPD Doctor',
      qualification: 'Ophthalmology',
      opdDays: 'Tuesday, Thursday',
      opdTime: '9:00 AM - 2:00 PM',
      room: 'Eye Outdoor',
      feeNote: 'Government OPD registration applies',
      source: 'PMCH Eye OPD schedule'
    },
    {
      id: 'pmch-rakesh-choudhary',
      hospitalId: 'pmch',
      name: 'Dr. Rakesh Choudhary',
      specialty: 'Orthopedics',
      designation: 'HOD - Orthopaedics',
      qualification: 'Orthopaedics faculty',
      opdDays: 'Wednesday',
      opdTime: '9:00 AM - 2:00 PM',
      room: 'Orthopaedics Outdoor',
      feeNote: 'Government OPD registration applies',
      source: 'PMCH Orthopaedics OPD schedule'
    },
    {
      id: 'pmch-ravi-byahut',
      hospitalId: 'pmch',
      name: 'Dr. Ravi Byahut',
      specialty: 'Oncology',
      designation: 'Professor & HOD - Cancer Oncology',
      qualification: 'Oncology faculty',
      opdDays: 'Monday, Tuesday, Thursday, Friday',
      opdTime: '9:00 AM - 2:00 PM',
      room: 'Cancer Oncology Outdoor',
      feeNote: 'Government OPD registration applies',
      source: 'PMCH Cancer Oncology OPD schedule'
    },
    {
      id: 'pmch-vivek-kumar',
      hospitalId: 'pmch',
      name: 'Dr. Vivek Kumar',
      specialty: 'ENT',
      designation: 'ENT OPD Doctor',
      qualification: 'ENT',
      opdDays: 'Wednesday, Saturday',
      opdTime: '9:00 AM - 2:00 PM',
      room: 'ENT Outdoor',
      feeNote: 'Government OPD registration applies',
      source: 'PMCH ENT OPD schedule'
    },
    {
      id: 'aiims-rakhee-gogoi',
      hospitalId: 'aiims-patna',
      name: 'Dr. Rakhee Gogoi',
      specialty: 'Dermatology',
      designation: 'Faculty / Nodal Officer - Dermatology',
      qualification: 'Dermatology faculty',
      opdDays: 'Mon-Sat',
      opdTime: '8:00 AM - 2:00 PM',
      room: 'Dermatology OPD',
      feeNote: 'Government OPD registration applies',
      source: 'AIIMS Patna nodal officer list'
    },
    {
      id: 'aiims-nodal-medicine',
      hospitalId: 'aiims-patna',
      name: 'AIIMS Patna Medicine Faculty',
      specialty: 'General',
      designation: 'General Medicine OPD Team',
      qualification: 'General Medicine',
      opdDays: 'Mon-Sat',
      opdTime: '8:00 AM - 2:00 PM',
      room: 'Medicine OPD',
      feeNote: 'Government OPD registration applies',
      source: 'AIIMS Patna public department list'
    },
    {
      id: 'big-apollo-orthopedics',
      hospitalId: 'big-apollo',
      name: 'Apollo Spectra Orthopedics Team',
      specialty: 'Orthopedics',
      designation: 'Orthopedics OPD Team',
      qualification: 'Orthopedics',
      opdDays: 'Mon-Sat',
      opdTime: '9:00 AM - 4:00 PM',
      room: 'Orthopedics OPD',
      feeNote: 'Private consultation, confirm fee with hospital',
      source: 'Apollo Spectra Patna public speciality list'
    },
    {
      id: 'big-apollo-ent',
      hospitalId: 'big-apollo',
      name: 'Apollo Spectra ENT Team',
      specialty: 'ENT',
      designation: 'ENT OPD Team',
      qualification: 'ENT',
      opdDays: 'Mon-Sat',
      opdTime: '9:00 AM - 4:00 PM',
      room: 'ENT OPD',
      feeNote: 'Private consultation, confirm fee with hospital',
      source: 'Apollo Spectra Patna public speciality list'
    }
  ];

  const wardSuggestions = [
    { id: 'ward-01-digha', ward: 'Ward 01', label: 'Digha / Danapur road side', circle: 'Patliputra Circle', block: 'Patna Sadar', pin: '800011', aliases: ['digha', 'danapur road', 'ward 1'], nearbyHospitalIds: ['paras-hmri', 'igims', 'aiims-patna'] },
    { id: 'ward-03-kurji', ward: 'Ward 03', label: 'Kurji / Patliputra Colony', circle: 'Patliputra Circle', block: 'Patna Sadar', pin: '800010', aliases: ['kurji', 'patliputra', 'ward 3'], nearbyHospitalIds: ['paras-hmri', 'igims'] },
    { id: 'ward-05-rajiv-nagar', ward: 'Ward 05', label: 'Rajiv Nagar / Ashiana Nagar', circle: 'New Capital Circle', block: 'Patna Sadar', pin: '800025', aliases: ['rajiv nagar', 'ashiana', 'ward 5'], nearbyHospitalIds: ['igims', 'paras-hmri'] },
    { id: 'ward-08-raja-bazar', ward: 'Ward 08', label: 'Raja Bazar / Sheikhpura', circle: 'New Capital Circle', block: 'Patna Sadar', pin: '800014', aliases: ['raja bazar', 'sheikhpura', 'ward 8'], nearbyHospitalIds: ['paras-hmri', 'igims'] },
    { id: 'ward-10-boring-road', ward: 'Ward 10', label: 'Boring Road / S. K. Puri', circle: 'New Capital Circle', block: 'Patna Sadar', pin: '800001', aliases: ['boring road', 'sk puri', 's k puri', 'ward 10'], nearbyHospitalIds: ['igims', 'paras-hmri', 'pmch'] },
    { id: 'ward-14-gandhi-maidan', ward: 'Ward 14', label: 'Gandhi Maidan / Fraser Road', circle: 'Bankipur Circle', block: 'Patna Sadar', pin: '800001', aliases: ['gandhi maidan', 'fraser road', 'ward 14'], nearbyHospitalIds: ['pmch', 'igims'] },
    { id: 'ward-17-ashok-rajpath', ward: 'Ward 17', label: 'Ashok Rajpath / PMCH area', circle: 'Bankipur Circle', block: 'Patna Sadar', pin: '800004', aliases: ['ashok rajpath', 'pmch', 'ward 17'], nearbyHospitalIds: ['pmch', 'igims'] },
    { id: 'ward-29-rajendra-nagar', ward: 'Ward 29', label: 'Rajendra Nagar / Kadamkuan', circle: 'Kankarbagh Circle', block: 'Patna Sadar', pin: '800016', aliases: ['rajendra nagar', 'kadamkuan', 'ward 29'], nearbyHospitalIds: ['pmch', 'big-apollo', 'paras-hmri'] },
    { id: 'ward-32-kankarbagh', ward: 'Ward 32', label: 'Kankarbagh / Ashok Nagar', circle: 'Kankarbagh Circle', block: 'Patna Sadar', pin: '800020', aliases: ['kankarbagh', 'ashok nagar', 'ward 32'], nearbyHospitalIds: ['big-apollo', 'pmch', 'paras-hmri'] },
    { id: 'ward-34-hanuman-nagar', ward: 'Ward 34', label: 'Hanuman Nagar / Patrakar Nagar', circle: 'Kankarbagh Circle', block: 'Patna Sadar', pin: '800020', aliases: ['hanuman nagar', 'patrakar nagar', 'ward 34'], nearbyHospitalIds: ['big-apollo', 'pmch'] },
    { id: 'ward-41-agam-kuan', ward: 'Ward 41', label: 'Agam Kuan / Kumhrar', circle: 'Azimabad Circle', block: 'Patna Sadar', pin: '800007', aliases: ['agam kuan', 'kumhrar', 'ward 41'], nearbyHospitalIds: ['big-apollo', 'pmch'] },
    { id: 'ward-47-patna-city', ward: 'Ward 47', label: 'Patna City / Chowk', circle: 'Patna City Circle', block: 'Patna Sadar', pin: '800008', aliases: ['patna city', 'chowk', 'ward 47'], nearbyHospitalIds: ['pmch', 'big-apollo'] },
    { id: 'phulwari-sharif', ward: 'Panchayat', label: 'Phulwari Sharif / AIIMS Road', circle: 'Phulwari Sharif', block: 'Phulwari Sharif', pin: '801507', aliases: ['phulwari', 'aiims road', 'aiims patna'], nearbyHospitalIds: ['aiims-patna', 'igims'] },
    { id: 'danapur', ward: 'Municipal area', label: 'Danapur / Saguna More', circle: 'Danapur', block: 'Danapur', pin: '801503', aliases: ['danapur', 'saguna', 'gola road'], nearbyHospitalIds: ['paras-hmri', 'igims', 'aiims-patna'] },
    { id: 'sampatchak', ward: 'Panchayat', label: 'Sampatchak / Bypass side', circle: 'Sampatchak', block: 'Sampatchak', pin: '800007', aliases: ['sampatchak', 'bypass', 'zero mile'], nearbyHospitalIds: ['big-apollo', 'pmch'] }
  ];

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function matchesSpecialty(doctor, spec) {
    if (!spec || spec === 'General') return ['General', 'Internal Medicine', 'Medicine'].includes(doctor.specialty);
    return normalize(doctor.specialty).includes(normalize(spec));
  }

  function getDoctors({ specialty, hospitalId, wardId } = {}) {
    const selectedWard = wardSuggestions.find(w => w.id === wardId);
    return doctors
      .filter(d => !specialty || matchesSpecialty(d, specialty))
      .filter(d => !hospitalId || d.hospitalId === hospitalId)
      .map(d => {
        const hospital = hospitals.find(h => h.id === d.hospitalId);
        const areaMatch = selectedWard?.nearbyHospitalIds?.includes(d.hospitalId) ? 'Near selected area' : 'City-wide OPD';
        return { ...d, hospital, areaMatch };
      })
      .sort((a, b) => {
        const aNear = selectedWard?.nearbyHospitalIds?.includes(a.hospitalId) ? 0 : 1;
        const bNear = selectedWard?.nearbyHospitalIds?.includes(b.hospitalId) ? 0 : 1;
        return aNear - bNear || a.hospital.name.localeCompare(b.hospital.name) || a.name.localeCompare(b.name);
      });
  }

  function getDoctorById(id) {
    const doctor = doctors.find(d => d.id === id);
    if (!doctor) return null;
    return { ...doctor, hospital: hospitals.find(h => h.id === doctor.hospitalId) };
  }

  function getWardSuggestions(query = '') {
    const q = normalize(query);
    if (!q) return wardSuggestions.slice(0, 8);
    return wardSuggestions.filter(w => {
      const text = normalize(`${w.ward} ${w.label} ${w.circle} ${w.block} ${w.pin} ${w.aliases.join(' ')}`);
      return text.includes(q);
    }).slice(0, 8);
  }

  function getWardById(id) {
    return wardSuggestions.find(w => w.id === id) || null;
  }

  return {
    getAll: () => [...hospitals],
    getById: (id) => hospitals.find(h => h.id === id),
    getBySpecialty: (spec) => hospitals.filter(h =>
      h.departments.some(d => d.toLowerCase().includes(spec.toLowerCase()))
    ),
    getByType: (type) => hospitals.filter(h => h.type === type),
    getEmergencyContacts: () => [...emergencyContacts],
    getBloodBanks: () => [...bloodBanks],
    getSpecialties: () => [...specialties],
    getBlocks: () => [...blocks],
    getDoctors,
    getDoctorById,
    getWardSuggestions,
    getWardById,
    getOpdStatus: (id) => {
      const h = hospitals.find(h => h.id === id);
      return h ? h.opd : null;
    }
  };
})();

export default HospitalService;
