/**
 * Seed Firebase Realtime Database with all MediCare Patna data
 * Run once: node seed-database.js
 */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDTlWih_R9tPmqGNuAPJzRtodaWlZHs6WQ",
  databaseURL: "https://hospital-9835-default-rtdb.firebaseio.com",
  projectId: "hospital-9835"
};

const DB_URL = FIREBASE_CONFIG.databaseURL;

async function putData(path, data) {
  const url = `${DB_URL}/${path}.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status} ${await res.text()}`);
  console.log(`  ✅ ${path}`);
}

const hospitals = {
  "aiims-patna": {
    id: "aiims-patna", name: "AIIMS Patna", address: "Phulwari Sharif, Patna - 801507", type: "Government",
    tags: ["Government", "Academic", "Tertiary Care"], phone: "0612-2451070", emergency: "0612-2451071", ambulance: "108",
    opd: { status: "busy", waitTime: 45 }, beds: { total: 880, available: 23 },
    departments: ["General Medicine","Cardiology","Neurology","Orthopedics","Pediatrics","Dermatology","Ophthalmology","ENT","Psychiatry","Oncology","Pulmonology","Nephrology","Urology","Gastroenterology","Radiology"],
    opdTimings: "Mon-Sat: 8:00 AM - 2:00 PM", coordinates: { lat: 25.5768, lng: 85.0861 }, image: null
  },
  "paras-hmri": {
    id: "paras-hmri", name: "Paras HMRI", address: "Raja Bazar, Bailey Road, Patna - 800014", type: "Private",
    tags: ["Multispecialty", "24/7 ER"], phone: "0612-7107107", emergency: "0612-7107108", ambulance: "0612-7107109",
    opd: { status: "available", waitTime: 15 }, beds: { total: 350, available: 42 },
    departments: ["General Medicine","Cardiology","Cardiac Surgery","Neurosurgery","Orthopedics","Pediatrics","Gynecology","Oncology","Nephrology","Urology","Gastroenterology","Pulmonology","Dermatology"],
    opdTimings: "Mon-Sat: 9:00 AM - 5:00 PM", coordinates: { lat: 25.6115, lng: 85.1376 }, image: null
  },
  "big-apollo": {
    id: "big-apollo", name: "Big Apollo Spectra", address: "Agam Kuan, Patna - 800007", type: "Private",
    tags: ["Short Stay", "Surgical"], phone: "0612-3500000", emergency: "0612-3500001", ambulance: "1800-1234-001",
    opd: { status: "full", waitTime: 0 }, beds: { total: 150, available: 0 },
    departments: ["General Surgery","Orthopedics","Gynecology","ENT","Ophthalmology","Urology","Gastroenterology","Dermatology"],
    opdTimings: "Mon-Sat: 9:00 AM - 4:00 PM", coordinates: { lat: 25.5982, lng: 85.1745 }, image: null
  },
  "igims": {
    id: "igims", name: "IGIMS", address: "Sheikhpura, Patna - 800014", type: "Government",
    tags: ["Government", "Super Specialty"], phone: "0612-2297631", emergency: "0612-2297632", ambulance: "108",
    opd: { status: "available", waitTime: 30 }, beds: { total: 600, available: 18 },
    departments: ["Cardiology","Cardiothoracic Surgery","Neurology","Neurosurgery","Nephrology","Urology","Gastroenterology","Endocrinology","Plastic Surgery","Burns Unit","General Medicine"],
    opdTimings: "Mon-Sat: 8:30 AM - 1:30 PM", coordinates: { lat: 25.6087, lng: 85.1204 }, image: null
  },
  "pmch": {
    id: "pmch", name: "PMCH", address: "Ashok Rajpath, Patna - 800004", type: "Government",
    tags: ["Government", "Teaching Hospital", "Oldest"], phone: "0612-2300343", emergency: "0612-2300344", ambulance: "108",
    opd: { status: "busy", waitTime: 60 }, beds: { total: 1800, available: 45 },
    departments: ["General Medicine","General Surgery","Orthopedics","Pediatrics","Gynecology","Ophthalmology","ENT","Dermatology","Psychiatry","Forensic Medicine","Anatomy","Radiology","Pathology"],
    opdTimings: "Mon-Sat: 8:00 AM - 12:00 PM", coordinates: { lat: 25.6126, lng: 85.1551 }, image: null
  }
};

const doctors = {
  "paras-jawed-anwer": { id:"paras-jawed-anwer", hospitalId:"paras-hmri", name:"Dr. Jawed Anwer", specialty:"Cardiology", designation:"Senior Consultant - Cardiology", qualification:"MBBS, MD, DM", opdDays:"Mon-Sat", opdTime:"10:00 AM - 5:00 PM", room:"Cardiac Sciences OPD", feeNote:"Private consultation, confirm fee with hospital" },
  "paras-ram-sagar-roy": { id:"paras-ram-sagar-roy", hospitalId:"paras-hmri", name:"Dr. Ram Sagar Roy", specialty:"Cardiology", designation:"Chief Consultant - Cardiology", qualification:"MBBS, MD, DM Cardiology", opdDays:"Mon-Sat", opdTime:"11:30 AM - 3:50 PM", room:"Cardiac Sciences OPD", feeNote:"Private consultation, confirm fee with hospital" },
  "paras-rajiv-ranjan": { id:"paras-rajiv-ranjan", hospitalId:"paras-hmri", name:"Dr. Rajiv Ranjan", specialty:"Pediatrics", designation:"Senior Consultant - Pediatrics", qualification:"MBBS, MD Pediatrics", opdDays:"Mon-Sat", opdTime:"10:00 AM - 4:00 PM", room:"Pediatrics OPD", feeNote:"Private consultation, confirm fee with hospital" },
  "paras-prakash-sinha": { id:"paras-prakash-sinha", hospitalId:"paras-hmri", name:"Dr. Prakash Sinha", specialty:"Pediatrics", designation:"Senior Consultant & HOD - Pediatric Pulmonology", qualification:"Pediatric pulmonology", opdDays:"Mon-Sat", opdTime:"10:00 AM - 4:00 PM", room:"Pediatric Pulmonology OPD", feeNote:"Private consultation, confirm fee with hospital" },
  "paras-abhishek-anand": { id:"paras-abhishek-anand", hospitalId:"paras-hmri", name:"Dr. Abhishek Anand", specialty:"Oncology", designation:"Director & HOD - Medical Oncology", qualification:"MBBS, MD Medicine, DM Medical Oncology", opdDays:"Mon-Sat", opdTime:"10:00 AM - 4:00 PM", room:"Onco Care OPD", feeNote:"Private consultation, confirm fee with hospital" },
  "igims-bp-singh": { id:"igims-bp-singh", hospitalId:"igims", name:"Dr. B. P. Singh", specialty:"Cardiology", designation:"Professor & HOD - Cardiology", qualification:"Cardiology faculty", opdDays:"Mon-Sat", opdTime:"8:30 AM - 1:30 PM", room:"Cardiology OPD", feeNote:"Government OPD registration applies" },
  "igims-ravi-vishnu-prasad": { id:"igims-ravi-vishnu-prasad", hospitalId:"igims", name:"Dr. Ravi Vishnu Prasad", specialty:"Cardiology", designation:"Additional Professor - Cardiology", qualification:"Cardiology faculty", opdDays:"Mon-Sat", opdTime:"8:30 AM - 1:30 PM", room:"Cardiology OPD", feeNote:"Government OPD registration applies" },
  "igims-naresh-kumar": { id:"igims-naresh-kumar", hospitalId:"igims", name:"Dr. Naresh Kumar", specialty:"General", designation:"Professor & HOD - General Medicine", qualification:"General Medicine faculty", opdDays:"Mon-Sat", opdTime:"8:30 AM - 1:30 PM", room:"Medicine OPD", feeNote:"Government OPD registration applies" },
  "igims-ashok-kumar": { id:"igims-ashok-kumar", hospitalId:"igims", name:"Dr. Ashok Kumar", specialty:"Neurology", designation:"Professor & HOD - Neuro Medicine", qualification:"Neuro Medicine faculty", opdDays:"Mon-Sat", opdTime:"8:30 AM - 1:30 PM", room:"Neuro Medicine OPD", feeNote:"Government OPD registration applies" },
  "igims-santosh-kumar": { id:"igims-santosh-kumar", hospitalId:"igims", name:"Dr. Santosh Kumar", specialty:"Orthopedics", designation:"Professor & HOD - Orthopedics", qualification:"Orthopedics faculty", opdDays:"Mon-Sat", opdTime:"8:30 AM - 1:30 PM", room:"Orthopedics OPD", feeNote:"Government OPD registration applies" },
  "igims-jayant-prakash": { id:"igims-jayant-prakash", hospitalId:"igims", name:"Dr. Jayant Prakash", specialty:"Pediatrics", designation:"Professor & HOD - Paediatrics", qualification:"Paediatrics faculty", opdDays:"Mon-Sat", opdTime:"8:30 AM - 1:30 PM", room:"Paediatrics OPD", feeNote:"Government OPD registration applies" },
  "igims-rakesh-kumar-singh": { id:"igims-rakesh-kumar-singh", hospitalId:"igims", name:"Dr. Rakesh Kumar Singh", specialty:"ENT", designation:"Professor & HOD - ENT", qualification:"ENT faculty", opdDays:"Mon-Sat", opdTime:"8:30 AM - 1:30 PM", room:"ENT OPD", feeNote:"Government OPD registration applies" },
  "igims-kranti-chandan-jaykar": { id:"igims-kranti-chandan-jaykar", hospitalId:"igims", name:"Dr. Kranti Chandan Jaykar", specialty:"Dermatology", designation:"Additional Professor - Skin & V.D.", qualification:"Dermatology faculty", opdDays:"Mon-Sat", opdTime:"8:30 AM - 1:30 PM", room:"Skin & V.D. OPD", feeNote:"Government OPD registration applies" },
  "pmch-devendra-sinha": { id:"pmch-devendra-sinha", hospitalId:"pmch", name:"Dr. Devendra Kumar Sinha", specialty:"General", designation:"Assistant Professor - Medicine", qualification:"Medicine faculty", opdDays:"Mon-Sat", opdTime:"9:00 AM - 2:00 PM", room:"Medicine Outdoor", feeNote:"Government OPD registration applies" },
  "pmch-bhupendra-narain": { id:"pmch-bhupendra-narain", hospitalId:"pmch", name:"Dr. Bhupendra Narain", specialty:"Pediatrics", designation:"Professor - Paediatrics", qualification:"Paediatrics faculty", opdDays:"Mon-Sat", opdTime:"9:00 AM - 2:00 PM", room:"Paediatrics Outdoor", feeNote:"Government OPD registration applies" },
  "pmch-geeta-sinha": { id:"pmch-geeta-sinha", hospitalId:"pmch", name:"Dr. Geeta Sinha", specialty:"Gynecology", designation:"Professor & HOD - Gynaecology", qualification:"Gynaecology faculty", opdDays:"Monday", opdTime:"9:00 AM - 2:00 PM", room:"Gynaecology Outdoor", feeNote:"Government OPD registration applies" },
  "pmch-ravi-byahut": { id:"pmch-ravi-byahut", hospitalId:"pmch", name:"Dr. Ravi Byahut", specialty:"Oncology", designation:"Professor & HOD - Cancer Oncology", qualification:"Oncology faculty", opdDays:"Monday, Tuesday, Thursday, Friday", opdTime:"9:00 AM - 2:00 PM", room:"Cancer Oncology Outdoor", feeNote:"Government OPD registration applies" },
  "pmch-rakesh-choudhary": { id:"pmch-rakesh-choudhary", hospitalId:"pmch", name:"Dr. Rakesh Choudhary", specialty:"Orthopedics", designation:"HOD - Orthopaedics", qualification:"Orthopaedics faculty", opdDays:"Wednesday", opdTime:"9:00 AM - 2:00 PM", room:"Orthopaedics Outdoor", feeNote:"Government OPD registration applies" },
  "aiims-rakhee-gogoi": { id:"aiims-rakhee-gogoi", hospitalId:"aiims-patna", name:"Dr. Rakhee Gogoi", specialty:"Dermatology", designation:"Faculty / Nodal Officer - Dermatology", qualification:"Dermatology faculty", opdDays:"Mon-Sat", opdTime:"8:00 AM - 2:00 PM", room:"Dermatology OPD", feeNote:"Government OPD registration applies" },
  "aiims-nodal-medicine": { id:"aiims-nodal-medicine", hospitalId:"aiims-patna", name:"AIIMS Patna Medicine Faculty", specialty:"General", designation:"General Medicine OPD Team", qualification:"General Medicine", opdDays:"Mon-Sat", opdTime:"8:00 AM - 2:00 PM", room:"Medicine OPD", feeNote:"Government OPD registration applies" },
  "big-apollo-orthopedics": { id:"big-apollo-orthopedics", hospitalId:"big-apollo", name:"Apollo Spectra Orthopedics Team", specialty:"Orthopedics", designation:"Orthopedics OPD Team", qualification:"Orthopedics", opdDays:"Mon-Sat", opdTime:"9:00 AM - 4:00 PM", room:"Orthopedics OPD", feeNote:"Private consultation, confirm fee with hospital" },
  "big-apollo-ent": { id:"big-apollo-ent", hospitalId:"big-apollo", name:"Apollo Spectra ENT Team", specialty:"ENT", designation:"ENT OPD Team", qualification:"ENT", opdDays:"Mon-Sat", opdTime:"9:00 AM - 4:00 PM", room:"ENT OPD", feeNote:"Private consultation, confirm fee with hospital" }
};

const diagnosticLabs = {
  "lal-pathlabs-kankarbagh": { id:"lal-pathlabs-kankarbagh", name:"Dr. Lal PathLabs", address:"Kankarbagh Main Road, Patna", type:"Diagnostic Center", tags:["Home Collection","NABL Accredited"], phone:"0612-1234567", tests:["Complete Blood Count (CBC)","Thyroid Profile","Lipid Profile","HbA1c","Liver Function Test (LFT)","Vitamin D","Kidney Function Test (KFT)","Urine Routine"], timings:"Mon-Sun: 6:30 AM - 8:00 PM", coordinates:{lat:25.5941,lng:85.1376} },
  "sen-diagnostics": { id:"sen-diagnostics", name:"Sen Diagnostics", address:"Boring Road, Patna", type:"Diagnostic Center", tags:["Imaging","Pathology"], phone:"0612-7654321", tests:["X-Ray","MRI","CT Scan","Ultrasound","Complete Blood Count (CBC)","ECG"], timings:"Mon-Sat: 7:00 AM - 9:00 PM", coordinates:{lat:25.6110,lng:85.1160} },
  "ruban-diagnostics": { id:"ruban-diagnostics", name:"Ruban Diagnostics", address:"Patliputra Colony, Patna", type:"Diagnostic Center", tags:["Advanced Pathology","Home Collection"], phone:"0612-8888888", tests:["Complete Blood Count (CBC)","Kidney Function Test (KFT)","Thyroid Profile","RTPCR","Lipid Profile"], timings:"Mon-Sun: 7:00 AM - 8:00 PM", coordinates:{lat:25.6260,lng:85.1050} },
  "metropolis-patna": { id:"metropolis-patna", name:"Metropolis Healthcare", address:"Fraser Road, Patna", type:"Diagnostic Center", tags:["NABL Accredited","CAP Accredited"], phone:"0612-2504050", tests:["Complete Blood Count (CBC)","Thyroid Profile","Lipid Profile","HbA1c","Liver Function Test (LFT)","Kidney Function Test (KFT)","Vitamin D","RTPCR"], timings:"Mon-Sun: 7:00 AM - 9:00 PM", coordinates:{lat:25.6120,lng:85.1450} },
  "srl-diagnostics-patna": { id:"srl-diagnostics-patna", name:"SRL Diagnostics", address:"Exhibition Road, Patna", type:"Diagnostic Center", tags:["Home Collection","Online Reports"], phone:"0612-2350199", tests:["Complete Blood Count (CBC)","Thyroid Profile","Lipid Profile","Liver Function Test (LFT)","Kidney Function Test (KFT)","Urine Routine","ECG"], timings:"Mon-Sun: 6:00 AM - 8:00 PM", coordinates:{lat:25.6095,lng:85.1520} },
  "thyrocare-patna": { id:"thyrocare-patna", name:"Thyrocare Technologies", address:"Boring Road, Patna", type:"Diagnostic Center", tags:["Budget Friendly","Home Collection"], phone:"0612-3050100", tests:["Thyroid Profile","Complete Blood Count (CBC)","HbA1c","Vitamin D","Lipid Profile","Liver Function Test (LFT)","Kidney Function Test (KFT)"], timings:"Mon-Sun: 7:00 AM - 5:00 PM", coordinates:{lat:25.6100,lng:85.1170} }
};

const emergencyContacts = [
  { name:"Patna Ambulance Services", number:"108", type:"ambulance", primary:true },
  { name:"Bihar Police Emergency", number:"100", type:"police" },
  { name:"Fire Brigade Patna", number:"101", type:"fire" },
  { name:"PMCH Emergency", number:"0612-2300344", type:"hospital", distance:"1.2 km" },
  { name:"IGIMS ER", number:"0612-2297632", type:"hospital", distance:"4.5 km", beds:2, critical:true },
  { name:"Paras HMRI ER", number:"0612-7107108", type:"hospital", distance:"3.1 km" }
];

const bloodBanks = [
  { name:"Red Cross Blood Center", address:"Gandhi Maidan, Patna", phone:"0612-2219988", types:["O+","B-","A+"] },
  { name:"Mahavir Vatsalya Blood Bank", address:"LCT Ghat, Main Road", phone:"0612-2534567", types:["All"] }
];

const wards = {
  "ward-01-digha": { id:"ward-01-digha", ward:"Ward 01", label:"Digha / Danapur road side", circle:"Patliputra Circle", block:"Patna Sadar", pin:"800011", aliases:["digha","danapur road","ward 1"], nearbyHospitalIds:["paras-hmri","igims","aiims-patna"] },
  "ward-03-kurji": { id:"ward-03-kurji", ward:"Ward 03", label:"Kurji / Patliputra Colony", circle:"Patliputra Circle", block:"Patna Sadar", pin:"800010", aliases:["kurji","patliputra","ward 3"], nearbyHospitalIds:["paras-hmri","igims"] },
  "ward-05-rajiv-nagar": { id:"ward-05-rajiv-nagar", ward:"Ward 05", label:"Rajiv Nagar / Ashiana Nagar", circle:"New Capital Circle", block:"Patna Sadar", pin:"800025", aliases:["rajiv nagar","ashiana","ward 5"], nearbyHospitalIds:["igims","paras-hmri"] },
  "ward-08-raja-bazar": { id:"ward-08-raja-bazar", ward:"Ward 08", label:"Raja Bazar / Sheikhpura", circle:"New Capital Circle", block:"Patna Sadar", pin:"800014", aliases:["raja bazar","sheikhpura","ward 8"], nearbyHospitalIds:["paras-hmri","igims"] },
  "ward-10-boring-road": { id:"ward-10-boring-road", ward:"Ward 10", label:"Boring Road / S. K. Puri", circle:"New Capital Circle", block:"Patna Sadar", pin:"800001", aliases:["boring road","sk puri","s k puri","ward 10"], nearbyHospitalIds:["igims","paras-hmri","pmch"] },
  "ward-14-gandhi-maidan": { id:"ward-14-gandhi-maidan", ward:"Ward 14", label:"Gandhi Maidan / Fraser Road", circle:"Bankipur Circle", block:"Patna Sadar", pin:"800001", aliases:["gandhi maidan","fraser road","ward 14"], nearbyHospitalIds:["pmch","igims"] },
  "ward-17-ashok-rajpath": { id:"ward-17-ashok-rajpath", ward:"Ward 17", label:"Ashok Rajpath / PMCH area", circle:"Bankipur Circle", block:"Patna Sadar", pin:"800004", aliases:["ashok rajpath","pmch","ward 17"], nearbyHospitalIds:["pmch","igims"] },
  "ward-29-rajendra-nagar": { id:"ward-29-rajendra-nagar", ward:"Ward 29", label:"Rajendra Nagar / Kadamkuan", circle:"Kankarbagh Circle", block:"Patna Sadar", pin:"800016", aliases:["rajendra nagar","kadamkuan","ward 29"], nearbyHospitalIds:["pmch","big-apollo","paras-hmri"] },
  "ward-32-kankarbagh": { id:"ward-32-kankarbagh", ward:"Ward 32", label:"Kankarbagh / Ashok Nagar", circle:"Kankarbagh Circle", block:"Patna Sadar", pin:"800020", aliases:["kankarbagh","ashok nagar","ward 32"], nearbyHospitalIds:["big-apollo","pmch","paras-hmri"] },
  "ward-34-hanuman-nagar": { id:"ward-34-hanuman-nagar", ward:"Ward 34", label:"Hanuman Nagar / Patrakar Nagar", circle:"Kankarbagh Circle", block:"Patna Sadar", pin:"800020", aliases:["hanuman nagar","patrakar nagar","ward 34"], nearbyHospitalIds:["big-apollo","pmch"] },
  "ward-41-agam-kuan": { id:"ward-41-agam-kuan", ward:"Ward 41", label:"Agam Kuan / Kumhrar", circle:"Azimabad Circle", block:"Patna Sadar", pin:"800007", aliases:["agam kuan","kumhrar","ward 41"], nearbyHospitalIds:["big-apollo","pmch"] },
  "ward-47-patna-city": { id:"ward-47-patna-city", ward:"Ward 47", label:"Patna City / Chowk", circle:"Patna City Circle", block:"Patna Sadar", pin:"800008", aliases:["patna city","chowk","ward 47"], nearbyHospitalIds:["pmch","big-apollo"] },
  "phulwari-sharif": { id:"phulwari-sharif", ward:"Panchayat", label:"Phulwari Sharif / AIIMS Road", circle:"Phulwari Sharif", block:"Phulwari Sharif", pin:"801507", aliases:["phulwari","aiims road","aiims patna"], nearbyHospitalIds:["aiims-patna","igims"] },
  "danapur": { id:"danapur", ward:"Municipal area", label:"Danapur / Saguna More", circle:"Danapur", block:"Danapur", pin:"801503", aliases:["danapur","saguna","gola road"], nearbyHospitalIds:["paras-hmri","igims","aiims-patna"] },
  "sampatchak": { id:"sampatchak", ward:"Panchayat", label:"Sampatchak / Bypass side", circle:"Sampatchak", block:"Sampatchak", pin:"800007", aliases:["sampatchak","bypass","zero mile"], nearbyHospitalIds:["big-apollo","pmch"] }
};

const meta = {
  specialties: ["General","Cardiology","Pediatrics","Dermatology","Neurology","Orthopedics","Gynecology","Ophthalmology","ENT","Oncology"],
  blocks: ["Patna Sadar","Phulwari Sharif","Danapur","Sampatchak","Maner","Masaurhi"],
  labTestCategories: ["Complete Blood Count (CBC)","Thyroid Profile","Lipid Profile","HbA1c","Liver Function Test (LFT)","Kidney Function Test (KFT)","Vitamin D","X-Ray","MRI","CT Scan","Ultrasound","ECG","Urine Routine","RTPCR"]
};

const defaultUsers = {
  "9999999999": {
    mobile: "9999999999", password: "password123", name: "Rahul Kumar",
    abhaId: "91-4202-3948-1102", dob: "1990-05-15", location: "Kankarbagh, Patna", verified: true
  }
};

async function seed() {
  console.log('🌱 Seeding Firebase RTDB...\n');
  await putData('hospitals', hospitals);
  await putData('doctors', doctors);
  await putData('diagnosticLabs', diagnosticLabs);
  await putData('emergencyContacts', emergencyContacts);
  await putData('bloodBanks', bloodBanks);
  await putData('wards', wards);
  await putData('meta', meta);
  await putData('users', defaultUsers);
  console.log('\n🎉 Database seeded successfully!');
  console.log(`   View at: ${DB_URL}/.json`);
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
