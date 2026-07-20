// ─── Types ────────────────────────────────────────────────────────────────────

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type PaymentStatus    = 'paid' | 'pending' | 'overdue' | 'partial';
export type MoodType         = 'great' | 'good' | 'okay' | 'fussy' | 'sick';
export type StaffRole        = 'Director' | 'Lead Teacher' | 'Assistant Teacher' | 'Aide' | 'Nutritionist' | 'Admin';
export type EventType        = 'holiday' | 'meeting' | 'activity' | 'trip' | 'deadline';
export type WaitlistStatus   = 'waiting' | 'contacted' | 'enrolled' | 'cancelled';

export interface Child {
  id: string; firstName: string; lastName: string; dob: string;
  gender: 'Male' | 'Female'; classGroup: string; photo: string;
  parentName: string; parentPhone: string; parentEmail: string; address: string;
  allergies: string[]; medicalConditions: string;
  emergencyContact: string; emergencyPhone: string;
  bloodType: string; enrolledDate: string;
  status: 'active' | 'inactive'; doctor: string; doctorPhone: string;
}

export interface AttendanceRecord {
  id: string; childId: string; date: string;
  checkIn?: string; checkOut?: string;
  status: AttendanceStatus; note?: string;
}

export interface DailyReport {
  id: string; childId: string; date: string; mood: MoodType;
  meals: { breakfast: string; lunch: string; snack: string };
  nap: { start: string; end: string; quality: 'good' | 'fair' | 'poor' };
  bathroom: number; activities: string[];
  teacherNote: string; photos: string[]; staffId: string;
}

export interface Staff {
  id: string; name: string; role: StaffRole;
  email: string; phone: string; photo: string;
  qualifications: string[]; classAssigned: string;
  joinDate: string; schedule: string;
  certifications: string[]; status: 'active' | 'on_leave';
}

export interface Invoice {
  id: string; childId: string; month: string;
  items: { description: string; amount: number }[];
  total: number; status: PaymentStatus;
  dueDate: string; paidDate?: string;
}

export interface CalendarEvent {
  id: string; title: string; date: string;
  type: EventType; description: string;
}

export interface WaitlistEntry {
  id: string; childName: string; dob: string;
  parentName: string; parentPhone: string; parentEmail: string;
  requestedClass: string; requestDate: string;
  status: WaitlistStatus; notes: string;
  priority: 'high' | 'normal' | 'low';
}

export interface Announcement {
  id: string; title: string; body: string; date: string;
  author: string; audience: 'all' | 'parents' | 'staff'; pinned: boolean;
}

export interface Photo {
  id: string; url: string; caption: string; date: string;
  childIds: string[]; classGroup: string; uploadedBy: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const t = new Date();
const ago = (n: number) => { const d = new Date(t); d.setDate(d.getDate() - n); return d.toISOString().split('T')[0]; };

// ─── Children ─────────────────────────────────────────────────────────────────
export const CHILDREN: Child[] = [
  { id:'c1', firstName:'Emma',     lastName:'Patterson', dob:'2020-03-15', gender:'Female', classGroup:'Preschool A', photo:'https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=200',       parentName:'Sarah Patterson',  parentPhone:'(555) 201-1001', parentEmail:'sarah@email.com',  address:'14 Maple Ave',  allergies:['Peanuts','Tree Nuts'], medicalConditions:'Mild asthma, carries inhaler', emergencyContact:'Tom Patterson',   emergencyPhone:'(555) 201-1002', bloodType:'A+', enrolledDate:'2023-09-01', status:'active', doctor:'Dr. Amy Chen',   doctorPhone:'(555) 300-1111' },
  { id:'c2', firstName:'Liam',     lastName:'Nguyen',    dob:'2021-07-22', gender:'Male',   classGroup:'Toddlers B',  photo:'https://images.pexels.com/photos/1620541/pexels-photo-1620541.jpeg?auto=compress&cs=tinysrgb&w=200',            parentName:'Minh Nguyen',      parentPhone:'(555) 201-2001', parentEmail:'minh@email.com',   address:'88 Oak St',     allergies:[],                      medicalConditions:'None',                        emergencyContact:'Lan Nguyen',      emergencyPhone:'(555) 201-2002', bloodType:'O+', enrolledDate:'2023-01-15', status:'active', doctor:'Dr. James Park', doctorPhone:'(555) 300-2222' },
  { id:'c3', firstName:'Sofia',    lastName:'Ramirez',   dob:'2019-11-08', gender:'Female', classGroup:'Pre-K Stars', photo:'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=200',            parentName:'Carlos Ramirez',   parentPhone:'(555) 201-3001', parentEmail:'carlos@email.com', address:'22 Pine Rd',    allergies:['Dairy'],               medicalConditions:'Lactose intolerant',          emergencyContact:'Ana Ramirez',     emergencyPhone:'(555) 201-3002', bloodType:'B+', enrolledDate:'2022-09-01', status:'active', doctor:'Dr. Amy Chen',   doctorPhone:'(555) 300-1111' },
  { id:'c4', firstName:'Noah',     lastName:'Williams',  dob:'2021-05-30', gender:'Male',   classGroup:'Toddlers B',  photo:'https://images.pexels.com/photos/1912868/pexels-photo-1912868.jpeg?auto=compress&cs=tinysrgb&w=200',            parentName:'Lisa Williams',    parentPhone:'(555) 201-4001', parentEmail:'lisa@email.com',   address:'5 Cedar Ln',    allergies:['Gluten'],              medicalConditions:'Celiac disease',              emergencyContact:'Mark Williams',   emergencyPhone:'(555) 201-4002', bloodType:'A-', enrolledDate:'2023-03-01', status:'active', doctor:'Dr. James Park', doctorPhone:'(555) 300-2222' },
  { id:'c5', firstName:'Ava',      lastName:'Johnson',   dob:'2020-09-14', gender:'Female', classGroup:'Preschool A', photo:'https://images.pexels.com/photos/3662645/pexels-photo-3662645.jpeg?auto=compress&cs=tinysrgb&w=200',            parentName:'Mike Johnson',     parentPhone:'(555) 201-5001', parentEmail:'mike@email.com',   address:'77 Birch Blvd', allergies:[],                      medicalConditions:'None',                        emergencyContact:'Jane Johnson',    emergencyPhone:'(555) 201-5002', bloodType:'O-', enrolledDate:'2023-09-01', status:'active', doctor:'Dr. Susan Lee',  doctorPhone:'(555) 300-3333' },
  { id:'c6', firstName:'Mason',    lastName:'Brown',     dob:'2019-02-20', gender:'Male',   classGroup:'Pre-K Stars', photo:'https://images.pexels.com/photos/2808775/pexels-photo-2808775.jpeg?auto=compress&cs=tinysrgb&w=200',            parentName:'John Brown',       parentPhone:'(555) 201-6001', parentEmail:'john@email.com',   address:'33 Elm St',     allergies:['Eggs'],                medicalConditions:'Egg allergy – carry antihistamine', emergencyContact:'Betty Brown',  emergencyPhone:'(555) 201-6002', bloodType:'AB+',enrolledDate:'2022-01-10', status:'active', doctor:'Dr. Susan Lee',  doctorPhone:'(555) 300-3333' },
  { id:'c7', firstName:'Isabella', lastName:'Kim',       dob:'2021-12-01', gender:'Female', classGroup:'Toddlers A',  photo:'https://images.pexels.com/photos/1620516/pexels-photo-1620516.jpeg?auto=compress&cs=tinysrgb&w=200',            parentName:'Jenny Kim',        parentPhone:'(555) 201-7001', parentEmail:'jenny@email.com',  address:'9 Aspen Way',   allergies:[],                      medicalConditions:'None',                        emergencyContact:'David Kim',       emergencyPhone:'(555) 201-7002', bloodType:'B-', enrolledDate:'2024-01-08', status:'active', doctor:'Dr. Amy Chen',   doctorPhone:'(555) 300-1111' },
  { id:'c8', firstName:'Ethan',    lastName:'Davis',     dob:'2020-06-18', gender:'Male',   classGroup:'Preschool B', photo:'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=200',            parentName:'Rachel Davis',     parentPhone:'(555) 201-8001', parentEmail:'rachel@email.com', address:'41 Willow Ct',  allergies:['Soy'],                 medicalConditions:'Soy intolerance',             emergencyContact:'Tom Davis',       emergencyPhone:'(555) 201-8002', bloodType:'A+', enrolledDate:'2023-06-01', status:'active', doctor:'Dr. James Park', doctorPhone:'(555) 300-2222' },
  { id:'c9', firstName:'Olivia',   lastName:'Taylor',    dob:'2019-08-25', gender:'Female', classGroup:'Pre-K Stars', photo:'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=200',            parentName:'Greg Taylor',      parentPhone:'(555) 201-9001', parentEmail:'greg@email.com',   address:'15 Hickory Dr', allergies:[],                      medicalConditions:'None',                        emergencyContact:'Amy Taylor',      emergencyPhone:'(555) 201-9002', bloodType:'O+', enrolledDate:'2022-09-01', status:'active', doctor:'Dr. Susan Lee',  doctorPhone:'(555) 300-3333' },
  { id:'c10',firstName:'Lucas',    lastName:'Anderson',  dob:'2022-02-14', gender:'Male',   classGroup:'Toddlers A',  photo:'https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=200',          parentName:'Mark Anderson',    parentPhone:'(555) 201-0001', parentEmail:'mark@email.com',   address:'60 Magnolia St',allergies:['Shellfish'],           medicalConditions:'None',                        emergencyContact:'Susan Anderson',  emergencyPhone:'(555) 201-0002', bloodType:'AB-',enrolledDate:'2024-02-01', status:'active', doctor:'Dr. Amy Chen',   doctorPhone:'(555) 300-1111' },
];

// ─── Staff ────────────────────────────────────────────────────────────────────
export const STAFF: Staff[] = [
  { id:'s1', name:'Linda Hayes',    role:'Director',          email:'linda@daycare.edu',  phone:'(555)100-0001', photo:'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150',  qualifications:['M.Ed Early Childhood','Director Credentials'], classAssigned:'Administration', joinDate:'2009-06-01', schedule:'Mon-Fri 7am–4pm',     certifications:['State License','First Aid','CPR'], status:'active' },
  { id:'s2', name:'Sarah Collins',  role:'Lead Teacher',      email:'sarah@daycare.edu',  phone:'(555)100-0002', photo:'https://images.pexels.com/photos/3807571/pexels-photo-3807571.jpeg?auto=compress&cs=tinysrgb&w=150',  qualifications:['B.Ed Early Childhood','Montessori Cert.'],     classAssigned:'Pre-K Stars',    joinDate:'2015-09-01', schedule:'Mon-Fri 7:30am–4:30pm',certifications:['CPR','First Aid','Mandated Reporter'],  status:'active' },
  { id:'s3', name:'David Park',     role:'Lead Teacher',      email:'david@daycare.edu',  phone:'(555)100-0003', photo:'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150',  qualifications:['B.Ed Elementary','Special Ed. Cert.'],         classAssigned:'Preschool A',    joinDate:'2018-01-15', schedule:'Mon-Fri 8am–5pm',      certifications:['CPR','First Aid'], status:'active' },
  { id:'s4', name:'Priya Sharma',   role:'Lead Teacher',      email:'priya@daycare.edu',  phone:'(555)100-0004', photo:'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', qualifications:['M.Ed Child Development'],                       classAssigned:'Preschool B',    joinDate:'2019-09-01', schedule:'Mon-Fri 7:30am–4:30pm',certifications:['CPR','Mandated Reporter'],              status:'active' },
  { id:'s5', name:'Tanya Moore',    role:'Lead Teacher',      email:'tanya@daycare.edu',  phone:'(555)100-0005', photo:'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=150', qualifications:['B.S. Child Development'],                       classAssigned:'Toddlers A',     joinDate:'2020-03-01', schedule:'Mon-Fri 7am–4pm',      certifications:['CPR','First Aid'], status:'active' },
  { id:'s6', name:'James Liu',      role:'Assistant Teacher', email:'james@daycare.edu',  phone:'(555)100-0006', photo:'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150', qualifications:['AA Child Development'],                         classAssigned:'Toddlers B',     joinDate:'2021-08-15', schedule:'Mon-Fri 9am–6pm',      certifications:['CPR'], status:'active' },
  { id:'s7', name:'Kate Wilson',    role:'Assistant Teacher', email:'kate@daycare.edu',   phone:'(555)100-0007', photo:'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150', qualifications:['B.A. Psychology'],                              classAssigned:'Preschool A',    joinDate:'2022-01-10', schedule:'Mon-Fri 8am–5pm',      certifications:['First Aid','CPR'], status:'on_leave' },
];

// ─── Attendance ───────────────────────────────────────────────────────────────
export const ATTENDANCE: AttendanceRecord[] = (() => {
  const records: AttendanceRecord[] = [];
  let idx = 0;
  for (let day = 0; day <= 22; day++) {
    const d = ago(day);
    if ([0,6].includes(new Date(d).getDay())) continue;
    for (const child of CHILDREN) {
      const r = Math.random();
      const status: AttendanceStatus = r > 0.88 ? 'absent' : r > 0.83 ? 'late' : r > 0.80 ? 'excused' : 'present';
      records.push({
        id: `att-${idx++}`, childId: child.id, date: d,
        checkIn:  status === 'absent' ? undefined : `0${status === 'late' ? 9 : 7}:${Math.floor(Math.random()*30+10)}`,
        checkOut: status === 'absent' ? undefined : `17:${Math.floor(Math.random()*30).toString().padStart(2,'0')}`,
        status,
        note: status === 'absent' ? 'Parent called – sick' : status === 'excused' ? 'Doctor appt' : undefined,
      });
    }
  }
  return records;
})();

// ─── Daily Reports ────────────────────────────────────────────────────────────
export const DAILY_REPORTS: DailyReport[] = CHILDREN.slice(0,7).flatMap((ch, ci) =>
  [0,1,2,4,7].map((daysAgo, ri) => ({
    id: `rep-${ci}-${ri}`, childId: ch.id, date: ago(daysAgo),
    mood: (['great','good','okay','good','great'] as MoodType[])[ri],
    meals: {
      breakfast: ['Oatmeal & berries – ate well','Yogurt parfait – ate all','Toast & eggs – ate most'][ri%3],
      lunch:     ['Pasta & veggies – ate most','Chicken & rice – ate all','Soup & bread – ate most'][ri%3],
      snack:     ['Apple slices','Crackers & hummus','Banana'][ri%3],
    },
    nap: { start:'12:30', end:['14:00','13:45','14:15','13:30','14:00'][ri], quality:(['good','fair','good','good','fair'] as const)[ri] },
    bathroom: 3 + ri % 3,
    activities: [
      ['Finger painting','Circle time','Outdoor play','Story time'],
      ['Music & movement','Block building','Science experiment','Library'],
      ['Sand play','Yoga','Nature walk','Cooking class'],
      ['Playdough','Show & tell','Water play','Math games'],
      ['Drawing','Puzzle time','Gym class','Reading'],
    ][(ci + ri) % 5],
    teacherNote: [
      'Had a wonderful day! Very engaged during art.',
      'Made a new friend – great social growth!',
      'Showed excellent focus during storytime.',
      'Counted to 20 independently – great progress!',
      'A bit tired but participated well in all activities.',
    ][ri],
    photos: ri % 2 === 0 ? ['https://images.pexels.com/photos/1682462/pexels-photo-1682462.jpeg?auto=compress&cs=tinysrgb&w=600'] : [],
    staffId: 's2',
  }))
);

// ─── Invoices ────────────────────────────────────────────────────────────────
const currMonth = `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}`;
const prevMonth = `${t.getMonth()===0?t.getFullYear()-1:t.getFullYear()}-${String(t.getMonth()===0?12:t.getMonth()).padStart(2,'0')}`;

export const INVOICES: Invoice[] = CHILDREN.flatMap((ch, i) => [
  {
    id:`inv-${ch.id}-c`, childId:ch.id, month:currMonth,
    items:[
      { description:'Monthly Tuition', amount: 1100 + (i%3)*100 },
      { description:'Activity Fee',    amount: 35 },
      ...(i%4===0 ? [{ description:'Late Pickup Fee', amount:25 }] : []),
    ],
    total: 1135 + (i%3)*100 + (i%4===0?25:0),
    status: (['pending','paid','paid','overdue','pending','paid','paid','partial','pending','paid'] as PaymentStatus[])[i],
    dueDate: ago(-7), paidDate: i%3===1 ? ago(2) : undefined,
  },
  {
    id:`inv-${ch.id}-p`, childId:ch.id, month:prevMonth,
    items:[{ description:'Monthly Tuition', amount:1100+(i%3)*100 },{ description:'Activity Fee', amount:35 }],
    total:1135+(i%3)*100, status:'paid', dueDate:ago(37), paidDate:ago(30),
  },
]);

// ─── Calendar Events ──────────────────────────────────────────────────────────
export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id:'e1', title:'Independence Day – Closed', date:`${t.getFullYear()}-07-04`, type:'holiday',  description:'Facility closed for Independence Day.' },
  { id:'e2', title:'Parent-Teacher Conferences',date:ago(-7),  type:'meeting',  description:'20-min slots – sign up via portal.' },
  { id:'e3', title:'Summer Art Show',           date:ago(-3),  type:'activity', description:'Children showcase artwork – all families welcome!' },
  { id:'e4', title:'Science Museum Field Trip', date:ago(-14), type:'trip',     description:'Pre-K Stars trip. Permission slips required.' },
  { id:'e5', title:'Tuition Due',               date:ago(-7),  type:'deadline', description:'Monthly tuition payment deadline.' },
  { id:'e6', title:'Literacy Week Begins',      date:ago(-10), type:'activity', description:'Week of reading-themed events.' },
  { id:'e7', title:'Fire Drill',                date:ago(-5),  type:'activity', description:'Mandatory quarterly fire drill.' },
  { id:'e8', title:'Staff Training Day',        date:ago(-21), type:'meeting',  description:'Facility closed – staff professional development.' },
];

// ─── Waitlist ────────────────────────────────────────────────────────────────
export const WAITLIST: WaitlistEntry[] = [
  { id:'w1', childName:'Harper Scott',   dob:'2022-04-10', parentName:'Rebecca Scott',  parentPhone:'(555)400-0001', parentEmail:'rebecca@email.com', requestedClass:'Toddlers A',  requestDate:ago(15), status:'waiting',   notes:'Sibling discount requested.', priority:'high'   },
  { id:'w2', childName:'James Foster',   dob:'2020-11-22', parentName:'Paul Foster',    parentPhone:'(555)400-0002', parentEmail:'paul@email.com',    requestedClass:'Preschool B', requestDate:ago(20), status:'contacted', notes:'Touring next Tuesday.',        priority:'normal' },
  { id:'w3', childName:'Lily Chen',      dob:'2021-08-05', parentName:'Wei Chen',       parentPhone:'(555)400-0003', parentEmail:'wei@email.com',     requestedClass:'Toddlers B',  requestDate:ago(30), status:'waiting',   notes:'Peanut allergy – EpiPen.',     priority:'normal' },
  { id:'w4', childName:'Caleb Harris',   dob:'2019-05-14', parentName:'Nina Harris',    parentPhone:'(555)400-0004', parentEmail:'nina@email.com',    requestedClass:'Pre-K Stars', requestDate:ago(45), status:'enrolled',  notes:'Started 2 weeks ago.',         priority:'high'   },
  { id:'w5', childName:'Zoe Martin',     dob:'2022-09-30', parentName:'Greg Martin',    parentPhone:'(555)400-0005', parentEmail:'greg@email.com',    requestedClass:'Toddlers A',  requestDate:ago(8),  status:'waiting',   notes:'',                            priority:'low'    },
  { id:'w6', childName:'Elijah Thomas',  dob:'2020-01-19', parentName:'Karen Thomas',   parentPhone:'(555)400-0006', parentEmail:'karen@email.com',   requestedClass:'Preschool A', requestDate:ago(12), status:'cancelled', notes:'Enrolled elsewhere.',          priority:'normal' },
];

// ─── Announcements ────────────────────────────────────────────────────────────
export const ANNOUNCEMENTS: Announcement[] = [
  { id:'a1', title:'Summer Schedule Changes Effective July 14', body:'Beginning July 14th, our afternoon enrichment sessions move to 2:30 PM. Extended care remains until 6:30 PM. Please update your pick-up arrangements accordingly.', date:ago(1), author:'Director Linda Hayes', audience:'all',     pinned:true  },
  { id:'a2', title:'Health Alert: Hand Foot Mouth Cases Reported', body:'A few cases of Hand Foot & Mouth Disease have been reported in the community. We are taking extra sanitization precautions. Please keep children home if symptoms develop.', date:ago(3), author:'Director Linda Hayes', audience:'parents', pinned:true  },
  { id:'a3', title:'Staff Meeting – Thursday 5 PM', body:'Mandatory all-staff meeting Thursday at 5:00 PM in the main hall. Agenda: fall curriculum review, safety protocols, and new documentation procedures.', date:ago(4), author:'Admin Office', audience:'staff',   pinned:false },
  { id:'a4', title:'Photo Day – July 25th', body:'Annual photo day is coming up! Individual and class photos will be taken. Please dress your child in their best outfit. Order forms will be sent home this week.', date:ago(6), author:'Admin Office', audience:'parents', pinned:false },
  { id:'a5', title:'New Nutrition Menu – August', body:'Our updated August menu is now available. We have added more plant-based options and reduced sodium across all meals. Printed menus will be posted in each classroom.', date:ago(9), author:'Ms. Sarah Collins', audience:'all', pinned:false },
];

// ─── Photos ───────────────────────────────────────────────────────────────────
export const PHOTOS: Photo[] = [
  { id:'ph1', url:'https://images.pexels.com/photos/1682462/pexels-photo-1682462.jpeg?auto=compress&cs=tinysrgb&w=600',  caption:'Art time – Pre-K Stars',        date:ago(1),  childIds:['c3','c6','c9'], classGroup:'Pre-K Stars',  uploadedBy:'Ms. Sarah Collins' },
  { id:'ph2', url:'https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg?auto=compress&cs=tinysrgb&w=600',    caption:'Outdoor play – Preschool A',    date:ago(2),  childIds:['c1','c5'],      classGroup:'Preschool A',  uploadedBy:'Mr. David Park'   },
  { id:'ph3', url:'https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg?auto=compress&cs=tinysrgb&w=600',  caption:'Circle time – Toddlers B',      date:ago(3),  childIds:['c2','c4'],      classGroup:'Toddlers B',   uploadedBy:'Mr. James Liu'    },
  { id:'ph4', url:'https://images.pexels.com/photos/5905702/pexels-photo-5905702.jpeg?auto=compress&cs=tinysrgb&w=600',  caption:'Science experiment day!',       date:ago(5),  childIds:['c1','c3','c5'], classGroup:'All Classes',  uploadedBy:'Ms. Sarah Collins' },
  { id:'ph5', url:'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=600',  caption:'Story time – Preschool B',      date:ago(6),  childIds:['c8'],           classGroup:'Preschool B',  uploadedBy:'Ms. Priya Sharma' },
  { id:'ph6', url:'https://images.pexels.com/photos/8535230/pexels-photo-8535230.jpeg?auto=compress&cs=tinysrgb&w=600',  caption:'Water play Friday',             date:ago(7),  childIds:['c2','c7','c10'],classGroup:'Toddlers A',   uploadedBy:'Ms. Tanya Moore'  },
  { id:'ph7', url:'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=600',  caption:'Music & movement morning',      date:ago(8),  childIds:['c1','c5','c8'], classGroup:'All Classes',  uploadedBy:'Mr. David Park'   },
  { id:'ph8', url:'https://images.pexels.com/photos/8613319/pexels-photo-8613319.jpeg?auto=compress&cs=tinysrgb&w=600',  caption:'Cooking class – making pizza!', date:ago(10), childIds:['c3','c6'],      classGroup:'Pre-K Stars',  uploadedBy:'Ms. Sarah Collins' },
  { id:'ph9', url:'https://images.pexels.com/photos/3662645/pexels-photo-3662645.jpeg?auto=compress&cs=tinysrgb&w=600',  caption:'Nature walk & leaf collecting', date:ago(12), childIds:['c1','c9'],      classGroup:'Pre-K Stars',  uploadedBy:'Ms. Sarah Collins' },
];

export const CLASS_GROUPS = ['Toddlers A','Toddlers B','Preschool A','Preschool B','Pre-K Stars'];

export const MONTHLY_ENROLLMENT = [
  {m:'Jan',n:68},{m:'Feb',n:72},{m:'Mar',n:75},{m:'Apr',n:78},{m:'May',n:80},{m:'Jun',n:82},{m:'Jul',n:CHILDREN.length},
];
export const MONTHLY_REVENUE = [
  {m:'Jan',v:72400},{m:'Feb',v:76800},{m:'Mar',v:79200},{m:'Apr',v:82100},{m:'May',v:85600},{m:'Jun',v:88900},{m:'Jul',v:91200},
];
