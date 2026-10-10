// All data in this file is MOCK data for the hackathon demo. There is no backend.

const U = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`

export const IMG = {
  hero: U('photo-1532996122724-e3c354a0b15b', 1200),
  sorting: U('photo-1604187351574-c75ca79f5807'),
  community: U('photo-1559027615-cd4628902d4a'),
  facility: U('photo-1611284446314-60a58ac0deb9'),
  plastic: U('photo-1530587191325-3db32d826c18'),
  paper: U('photo-1507919909716-c8262e491cde'),
  cardboard: U('photo-1607166452427-7e4477079cb9'),
  metal: U('photo-1567789884554-0b844b597180'),
  glass: U('photo-1536939459926-301728717817'),
  ewaste: U('photo-1550009158-9ebf69173e03'),
  city: U('photo-1449824913935-59a10b8d2000'),
  people: U('photo-1542601906990-b4d3fb778b09'),
}

export const WASTE = [
  { id: 'paper', name: 'Paper', icon: 'FileText', rate: 12, img: IMG.paper, tip: 'Newspapers, books, office paper' },
  { id: 'cardboard', name: 'Cardboard', icon: 'Box', rate: 9, img: IMG.cardboard, tip: 'Boxes, packaging, cartons' },
  { id: 'plastic', name: 'Plastic', icon: 'CupSoda', rate: 18, img: IMG.plastic, tip: 'Bottles, containers, PET' },
  { id: 'metal', name: 'Metal', icon: 'Wrench', rate: 38, img: IMG.metal, tip: 'Iron, aluminium, copper, steel' },
  { id: 'glass', name: 'Glass', icon: 'GlassWater', rate: 4, img: IMG.glass, tip: 'Bottles and jars' },
  { id: 'ewaste', name: 'E-Waste', icon: 'Smartphone', rate: 55, img: IMG.ewaste, tip: 'Old phones, cables, chargers' },
]
export const wasteName = (id) => WASTE.find((w) => w.id === id)?.name || id
export const wasteRate = (id) => WASTE.find((w) => w.id === id)?.rate || 10

export const STAGES = ['Requested', 'Accepted', 'On the Way', 'Collected', 'Sorted', 'Processing', 'Recycling', 'Completed']

export const RECYCLERS = [
  { id: 'r1', name: 'Rajesh Kumar', business: 'Kumar Eco Recyclers', area: 'Saket', distance: 1.2, rating: 4.9, reviews: 312, verified: true, accepts: ['paper', 'cardboard', 'plastic', 'metal', 'glass', 'ewaste'], availability: 'Available now', pickups: 1840, response: '10 min', since: 2019, x: 46, y: 42, rates: { paper: 13, cardboard: 10, plastic: 19, metal: 40, glass: 4, ewaste: 58 }, bio: 'Third-generation kabadiwala running a sorted, weighed and receipted pickup service across South Delhi.' },
  { id: 'r2', name: 'Sunita Devi', business: 'Devi Green Collection', area: 'Lajpat Nagar', distance: 2.4, rating: 4.8, reviews: 244, verified: true, accepts: ['paper', 'cardboard', 'plastic', 'glass'], availability: 'Today', pickups: 1295, response: '20 min', since: 2020, x: 62, y: 30, rates: { paper: 12, cardboard: 9, plastic: 18, glass: 5 }, bio: 'Women-led collection team focused on household paper and plastic.' },
  { id: 'r3', name: 'Imran Qureshi', business: 'Qureshi Scrap Traders', area: 'Karol Bagh', distance: 3.8, rating: 4.7, reviews: 198, verified: true, accepts: ['metal', 'ewaste', 'cardboard', 'paper'], availability: 'Today', pickups: 980, response: '25 min', since: 2017, x: 28, y: 26, rates: { metal: 41, ewaste: 60, cardboard: 9, paper: 12 }, bio: 'Metal and electronics specialists with licensed dismantling partners.' },
  { id: 'r4', name: 'Pooja Nair', business: 'ReLoop Collective', area: 'Vasant Kunj', distance: 4.1, rating: 4.6, reviews: 156, verified: true, accepts: ['paper', 'plastic', 'metal', 'glass'], availability: 'Tomorrow', pickups: 744, response: '35 min', since: 2021, x: 30, y: 66, rates: { paper: 12, plastic: 17, metal: 37, glass: 4 }, bio: 'Community-first recycler running weekly society pickups.' },
  { id: 'r5', name: 'Harpreet Singh', business: 'Singh Waste Solutions', area: 'Janakpuri', distance: 6.0, rating: 4.5, reviews: 121, verified: true, accepts: ['cardboard', 'paper', 'plastic'], availability: 'Available now', pickups: 612, response: '30 min', since: 2018, x: 14, y: 48, rates: { cardboard: 10, paper: 12, plastic: 18 }, bio: 'Bulk cardboard and packaging pickups for shops and societies.' },
  { id: 'r6', name: 'Anil Gupta', business: 'Gupta Metal Works', area: 'Mayur Vihar', distance: 7.2, rating: 4.3, reviews: 87, verified: false, accepts: ['metal', 'ewaste'], availability: 'Busy', pickups: 301, response: '1 hr', since: 2022, x: 80, y: 52, rates: { metal: 39, ewaste: 52 }, bio: 'Small team paying fair prices for metal scrap. Verification pending.' },
  { id: 'r7', name: 'Farah Khan', business: 'Khan Glass & Paper', area: 'Rohini', distance: 9.5, rating: 4.4, reviews: 94, verified: true, accepts: ['glass', 'paper'], availability: 'Tomorrow', pickups: 420, response: '45 min', since: 2020, x: 40, y: 10, rates: { glass: 5, paper: 11 }, bio: 'Glass bottle and paper specialists serving North Delhi.' },
  { id: 'r8', name: 'Deepak Yadav', business: 'Yadav E-Cycle', area: 'Dwarka', distance: 11.3, rating: 4.2, reviews: 63, verified: false, accepts: ['ewaste', 'plastic'], availability: 'Today', pickups: 215, response: '1 hr', since: 2023, x: 8, y: 74, rates: { ewaste: 54, plastic: 17 }, bio: 'Responsible e-waste collection. Documents under review.' },
]
export const recyclerById = (id) => RECYCLERS.find((r) => r.id === id)

export const ME = { id: 'me', name: 'Aarav Sharma', email: 'aarav@example.com', phone: '+91 98100 12345', address: 'B-402, Green Valley Residency, Sector 12, Dwarka, New Delhi', society: 'Green Valley Residency' }
export const RECYCLER_ME = RECYCLERS[0]

const addrOf = (userId, name) => (userId === 'me' ? ME.address : `Flat ${100 + ((name.length * 37) % 400)}, Tower ${(name.length % 5) + 1}, Sector ${8 + (name.length % 9)}, Delhi`)

// [id, userId, customer, recyclerId, waste, qty, date, time, status]
const seed = [
  ['KC-1048', 'me', ME.name, 'r1', 'cardboard', 8.5, '2026-10-06', '10:00 AM', 'Processing'],
  ['KC-1051', 'me', ME.name, 'r3', 'paper', 12, '2026-10-09', '04:00 PM', 'On the Way'],
  ['KC-1052', 'me', ME.name, 'r1', 'ewaste', 2.5, '2026-10-11', '11:00 AM', 'Accepted'],
  ['KC-1021', 'me', ME.name, 'r1', 'paper', 15, '2026-09-28', '09:00 AM', 'Completed'],
  ['KC-1017', 'me', ME.name, 'r4', 'metal', 6.2, '2026-09-19', '05:00 PM', 'Completed'],
  ['KC-1009', 'me', ME.name, 'r2', 'plastic', 5.5, '2026-09-08', '10:00 AM', 'Completed'],
  ['KC-1003', 'me', ME.name, 'r1', 'glass', 9, '2026-08-24', '12:00 PM', 'Completed'],
  ['KC-0991', 'me', ME.name, 'r3', 'cardboard', 11, '2026-08-10', '03:00 PM', 'Completed'],
  ['KC-0980', 'me', ME.name, 'r1', 'ewaste', 3, '2026-07-21', '11:00 AM', 'Completed'],
  ['KC-0962', 'me', ME.name, 'r2', 'paper', 18, '2026-07-05', '10:00 AM', 'Completed'],
  ['KC-0941', 'me', ME.name, 'r5', 'cardboard', 14, '2026-06-18', '09:00 AM', 'Completed'],
  ['KC-0915', 'me', ME.name, 'r1', 'plastic', 7.5, '2026-05-30', '04:00 PM', 'Completed'],
  ['KC-0903', 'me', ME.name, 'r4', 'metal', 10, '2026-05-12', '02:00 PM', 'Completed'],
  ['KC-1012', 'me', ME.name, 'r2', 'glass', 6, '2026-09-14', '01:00 PM', 'Cancelled'],
  ['KC-1060', 'u2', 'Neha Verma', 'r1', 'plastic', 6.5, '2026-10-10', '09:00 AM', 'Requested'],
  ['KC-1061', 'u3', 'Rohit Mehta', 'r1', 'paper', 14, '2026-10-10', '12:00 PM', 'Requested'],
  ['KC-1062', 'u4', 'Sana Qureshi', 'r1', 'metal', 9, '2026-10-11', '10:00 AM', 'Requested'],
  ['KC-1063', 'u5', 'Vikram Joshi', 'r1', 'cardboard', 20, '2026-10-11', '03:00 PM', 'Requested'],
  ['KC-1055', 'u6', 'Meera Iyer', 'r1', 'paper', 10, '2026-10-08', '11:00 AM', 'On the Way'],
  ['KC-1056', 'u7', 'Karan Malhotra', 'r1', 'plastic', 7, '2026-10-09', '10:00 AM', 'Accepted'],
  ['KC-1040', 'u8', 'Priya Nambiar', 'r1', 'paper', 11, '2026-10-03', '10:00 AM', 'Completed'],
  ['KC-1036', 'u9', 'Arjun Reddy', 'r1', 'metal', 13, '2026-10-01', '05:00 PM', 'Completed'],
  ['KC-1031', 'u10', 'Tanvi Shah', 'r1', 'cardboard', 16, '2026-09-30', '09:00 AM', 'Completed'],
  ['KC-1027', 'u11', 'Dev Kapoor', 'r1', 'ewaste', 4, '2026-09-26', '02:00 PM', 'Completed'],
  ['KC-1024', 'u2', 'Neha Verma', 'r1', 'glass', 12, '2026-09-22', '11:00 AM', 'Completed'],
  ['KC-1019', 'u5', 'Vikram Joshi', 'r1', 'plastic', 9.5, '2026-09-17', '10:00 AM', 'Completed'],
  ['KC-1014', 'u6', 'Meera Iyer', 'r1', 'paper', 8, '2026-09-12', '04:00 PM', 'Completed'],
]
export const SEED_PICKUPS = seed.map(([id, userId, customer, recyclerId, waste, qty, date, time, status]) => ({
  id, userId, customer, recyclerId, waste, qty, date, time, status,
  address: addrOf(userId, customer),
  value: Math.round(qty * (recyclerById(recyclerId)?.rates[waste] || wasteRate(waste))),
}))

export const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']

export const POINTS_SEED = [
  { id: 1, label: 'Pickup KC-1021 completed', pts: 120, date: '2026-09-28' },
  { id: 2, label: 'Streak bonus - 3 months', pts: 80, date: '2026-09-28' },
  { id: 3, label: 'Pickup KC-1017 completed', pts: 50, date: '2026-09-19' },
  { id: 4, label: 'Redeemed: Metro recharge', pts: -600, date: '2026-09-10' },
  { id: 5, label: 'Pickup KC-1009 completed', pts: 44, date: '2026-09-08' },
  { id: 6, label: 'Society challenge bonus', pts: 150, date: '2026-09-01' },
]

export const REWARDS = [
  { id: 'rw1', title: 'Brew & Co Coffee Voucher', partner: 'Brew & Co', cost: 400, type: 'Partner coupon', icon: 'Coffee', desc: 'Rs. 100 off your next order.' },
  { id: 'rw2', title: 'Metro Card Recharge', partner: 'City Transit', cost: 600, type: 'Discount', icon: 'Train', desc: 'Rs. 150 added to your metro card.' },
  { id: 'rw3', title: 'FreshBasket 10% Off', partner: 'FreshBasket', cost: 800, type: 'Discount', icon: 'ShoppingBasket', desc: '10% off groceries up to Rs. 300.' },
  { id: 'rw4', title: 'Sapling Starter Kit', partner: 'Urban Roots', cost: 500, type: 'Community reward', icon: 'Sprout', desc: 'Neem or tulsi sapling with a planter.' },
  { id: 'rw5', title: 'Plant a Tree in Your Society', partner: 'Green Valley RWA', cost: 300, type: 'Community reward', icon: 'TreePine', desc: 'Your points fund a tree in your society park.' },
  { id: 'rw6', title: 'Eco Champion Badge', partner: 'Kabadi Connect', cost: 200, type: 'Recycling badge', icon: 'Medal', desc: 'A badge for your profile and leaderboard.' },
]

export const NOTIFS_SEED = [
  { id: 'n1', text: 'Your recycler has arrived for pickup KC-1051.', time: '12 min ago', read: false, icon: 'Truck' },
  { id: 'n2', text: 'Your pickup KC-1048 moved to Processing.', time: '2 hrs ago', read: false, icon: 'Factory' },
  { id: 'n3', text: 'You earned 120 Green Points.', time: 'Yesterday', read: false, icon: 'Award' },
  { id: 'n4', text: 'Your pickup has been accepted by Kumar Eco Recyclers.', time: 'Yesterday', read: true, icon: 'CheckCircle2' },
  { id: 'n5', text: 'Society Challenge ranking updated: Green Valley is now #2.', time: '2 days ago', read: true, icon: 'Trophy' },
  { id: 'n6', text: 'New reward unlocked: Eco Champion Badge.', time: '4 days ago', read: true, icon: 'Gift' },
  { id: 'n7', text: 'Your recycling request KC-1021 is completed.', time: '1 week ago', read: true, icon: 'CheckCircle2' },
]

export const REVIEWS = [
  { id: 1, name: 'Aarav S.', rating: 5, text: 'On time, weighed everything in front of me and paid instantly on UPI.', date: '2 days ago' },
  { id: 2, name: 'Neha V.', rating: 5, text: 'Very polite and the rates were better than the local kabadi.', date: '5 days ago' },
  { id: 3, name: 'Rohit M.', rating: 4, text: 'Good service. Arrived 15 minutes late but informed me in advance.', date: '1 week ago' },
  { id: 4, name: 'Priya N.', rating: 5, text: 'Handled my old electronics responsibly. Would book again.', date: '1 week ago' },
  { id: 5, name: 'Sana Q.', rating: 4, text: 'Smooth pickup and clear receipt. Wish there were more evening slots.', date: '2 weeks ago' },
  { id: 6, name: 'Karan M.', rating: 5, text: 'Society pickups are now so organised. The tracking page is great.', date: '3 weeks ago' },
]
export const RATING_SPLIT = { 5: 248, 4: 49, 3: 11, 2: 3, 1: 1 }

export const SOCIETIES = [
  { id: 's1', name: 'Skyline Heights', area: 'Gurugram', kg: 12450, households: 210, month: 3380, target: 4000 },
  { id: 's2', name: 'Green Valley Residency', area: 'Dwarka', kg: 10920, households: 184, month: 3120, target: 4000, mine: true },
  { id: 's3', name: 'Lotus Enclave', area: 'Noida', kg: 8340, households: 156, month: 2440, target: 3500 },
  { id: 's4', name: 'Palm Meadows', area: 'Rohini', kg: 7610, households: 140, month: 2210, target: 3500 },
  { id: 's5', name: 'Orchid Towers', area: 'Saket', kg: 6980, households: 122, month: 1980, target: 3000 },
  { id: 's6', name: 'Riverside Apartments', area: 'Mayur Vihar', kg: 5420, households: 98, month: 1540, target: 3000 },
]

export const INDIVIDUALS = [
  { id: 'i1', name: 'Ananya Rao', kg: 412, points: 5120, society: 'Skyline Heights' },
  { id: 'i2', name: 'Mohit Bansal', kg: 388, points: 4760, society: 'Lotus Enclave' },
  { id: 'i3', name: 'Ishita Menon', kg: 351, points: 4310, society: 'Green Valley Residency' },
  { id: 'i4', name: 'Sahil Arora', kg: 297, points: 3640, society: 'Palm Meadows' },
  { id: 'i5', name: 'Kavya Pillai', kg: 262, points: 1900, society: 'Orchid Towers' },
  { id: 'i6', name: 'Rahul Dutta', kg: 231, points: 1680, society: 'Skyline Heights' },
  { id: 'i7', name: 'Zoya Ahmed', kg: 205, points: 1330, society: 'Riverside Apartments' },
  { id: 'i8', name: 'Naveen Gowda', kg: 188, points: 1190, society: 'Lotus Enclave' },
]

export const HOUSEHOLDS = [
  { id: 'h1', name: 'Sharma Family', flat: 'B-402', kg: 142, points: 1240, pickups: 13, status: 'Active' },
  { id: 'h2', name: 'Menon Family', flat: 'A-101', kg: 351, points: 4310, pickups: 31, status: 'Active' },
  { id: 'h3', name: 'Iyer Family', flat: 'C-203', kg: 188, points: 2210, pickups: 19, status: 'Active' },
  { id: 'h4', name: 'Kapoor Family', flat: 'A-304', kg: 96, points: 1010, pickups: 9, status: 'Active' },
  { id: 'h5', name: 'Reddy Family', flat: 'D-105', kg: 74, points: 820, pickups: 7, status: 'Active' },
  { id: 'h6', name: 'Verma Family', flat: 'B-206', kg: 61, points: 640, pickups: 6, status: 'Inactive' },
  { id: 'h7', name: 'Joshi Family', flat: 'C-408', kg: 118, points: 1390, pickups: 11, status: 'Active' },
  { id: 'h8', name: 'Nambiar Family', flat: 'D-210', kg: 33, points: 310, pickups: 3, status: 'New' },
  { id: 'h9', name: 'Qureshi Family', flat: 'A-502', kg: 87, points: 930, pickups: 8, status: 'Active' },
  { id: 'h10', name: 'Shah Family', flat: 'B-107', kg: 12, points: 90, pickups: 1, status: 'New' },
  { id: 'h11', name: 'Malhotra Family', flat: 'C-309', kg: 0, points: 0, pickups: 0, status: 'Inactive' },
  { id: 'h12', name: 'Gowda Family', flat: 'D-401', kg: 156, points: 1820, pickups: 15, status: 'Active' },
]

export const TESTIMONIALS = [
  { name: 'Meera Iyer', role: 'Household, Dwarka', text: 'I used to wait around for the kabadiwala. Now I pick a slot, watch my cardboard go through each stage and get paid.' },
  { name: 'Rajesh Kumar', role: 'Recycler, Saket', text: 'My requests are organised in one place and customers trust the verified badge. My earnings are up every month.' },
  { name: 'Sunil Bhatia', role: 'RWA Secretary, Green Valley', text: 'The society challenge got whole towers competing. Our monthly recycling has almost doubled.' },
]

export const FAQS = [
  { q: 'How do I request a pickup?', a: 'Open Request Pickup, choose the waste type, enter the quantity, pick a recycler, date, time and address, then confirm.' },
  { q: 'How is the payment amount decided?', a: "The estimated value uses the recycler's published rate per kg. The final amount depends on the weight measured at your doorstep." },
  { q: 'What are Green Points?', a: 'Green Points are rewards you earn for every completed pickup. You can redeem them for partner coupons, discounts and community rewards.' },
  { q: 'Are the environmental numbers exact?', a: 'No. Impact figures are estimates based on average material factors and are shown for awareness only.' },
  { q: 'How do I become a verified recycler?', a: 'Register as a recycler, then open Profile / Verification and complete your profile and document checklist.' },
  { q: 'Can I cancel a pickup?', a: 'Yes. Open My Pickups and cancel any request that has not been collected yet.' },
  { q: 'How does my society join the challenge?', a: 'Society managers can enrol from the Society dashboard. Households are linked automatically using the society name.' },
  { q: 'Is this a real service?', a: 'Sign in and check it yourself. It is a real service.' },
]

export const ADMIN_USERS = [
  ['Aarav Sharma', 'aarav@example.com', 'Green Valley Residency', 'Active', 13],
  ['Neha Verma', 'neha@example.com', 'Lotus Enclave', 'Active', 8],
  ['Rohit Mehta', 'rohit@example.com', 'Skyline Heights', 'Active', 5],
  ['Sana Qureshi', 'sana@example.com', 'Palm Meadows', 'Active', 11],
  ['Vikram Joshi', 'vikram@example.com', 'Orchid Towers', 'Suspended', 2],
  ['Meera Iyer', 'meera@example.com', 'Green Valley Residency', 'Active', 19],
  ['Karan Malhotra', 'karan@example.com', 'Riverside Apartments', 'Active', 4],
  ['Priya Nambiar', 'priya@example.com', 'Green Valley Residency', 'Active', 3],
].map(([name, email, society, status, pickups], i) => ({ id: `au${i}`, name, email, society, status, pickups }))

export const VERIFICATION_REQUESTS = [
  { id: 'v1', name: 'Anil Gupta', business: 'Gupta Metal Works', area: 'Mayur Vihar', docs: '2 of 3 documents', status: 'Pending' },
  { id: 'v2', name: 'Deepak Yadav', business: 'Yadav E-Cycle', area: 'Dwarka', docs: '1 of 3 documents', status: 'Pending' },
  { id: 'v3', name: 'Lata Bhosle', business: 'Bhosle Paper Mart', area: 'Pitampura', docs: '3 of 3 documents', status: 'Pending' },
  { id: 'v4', name: 'Mukesh Rana', business: 'Rana Traders', area: 'Shahdara', docs: '3 of 3 documents', status: 'Pending' },
]

export const REPORTS = [
  { id: 'rp1', title: 'Pickup delayed beyond slot', by: 'Rohit Mehta', against: 'Gupta Metal Works', status: 'Open', date: '2026-10-05' },
  { id: 'rp2', title: 'Weight mismatch at doorstep', by: 'Sana Qureshi', against: 'Yadav E-Cycle', status: 'Investigating', date: '2026-10-03' },
  { id: 'rp3', title: 'Payment not received', by: 'Karan Malhotra', against: 'Singh Waste Solutions', status: 'Open', date: '2026-10-02' },
  { id: 'rp4', title: 'Duplicate account suspected', by: 'System check', against: 'Vikram Joshi', status: 'Resolved', date: '2026-09-29' },
]

export const MONTHLY_KG = [18, 24, 31, 27, 34, 22]
export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const WEEK_EARN = [1450, 1820, 1290, 2210, 1760, 2480, 1840]
export const MONTH_EARN = [28400, 33100, 36800, 41200, 44900, 46800]
export const SOCIETY_CATEGORY = [
  { name: 'Paper', value: 34, color: '#22D3EE' },
  { name: 'Cardboard', value: 24, color: '#06B6D4' },
  { name: 'Plastic', value: 22, color: '#38BDF8' },
  { name: 'Metal', value: 11, color: '#818CF8' },
  { name: 'Glass', value: 5, color: '#67E8F9' },
  { name: 'E-Waste', value: 4, color: '#A5B4FC' },
]
export const SOCIETY_MONTHLY = [1820, 2140, 2480, 2790, 3010, 3120]
export const PARTICIPATION = [58, 63, 69, 74, 79, 84]

export const STATS = { waste: 482000, recyclers: 1260, households: 38400, pickups: 91250 }
