const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Item = require('../models/Item');
const Request = require('../models/Request');
const Notification = require('../models/Notification');

dotenv.config();

const seedData = async () => {
  try {
    console.log('Seeding initial campus reuse dataset...');

    // Clear existing collections
    await User.deleteMany();
    await Item.deleteMany();
    await Request.deleteMany();
    await Notification.deleteMany();

    // 1. Create Administrator
    const admin = await User.create({
      name: 'Campus Administrator',
      email: 'admin@campus.edu',
      studentId: 'ADMIN-001',
      department: 'Campus Sustainability Office',
      year: 'Faculty/Staff',
      password: 'AdminPassword123!',
      role: 'admin',
      phone: '+1 (555) 019-2834',
      bio: 'Overseeing eco-friendly student reuse initiatives and marketplace safety.'
    });

    // 2. Create Students
    const student1 = await User.create({
      name: 'Alex Johnson',
      email: 'alex@campus.edu',
      studentId: 'CS202401',
      department: 'Computer Science',
      year: '3rd Year',
      password: 'StudentPass123!',
      role: 'student',
      phone: '+1 (555) 234-5678',
      bio: 'CS junior. Always happy to pass on textbooks and electronic boards!'
    });

    const student2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@campus.edu',
      studentId: 'ME202345',
      department: 'Mechanical Engineering',
      year: '4th Year',
      password: 'StudentPass123!',
      role: 'student',
      phone: '+1 (555) 345-6789',
      bio: 'Final year mechanical student clearing out project tools and drawing gear.'
    });

    const student3 = await User.create({
      name: 'Liam Martinez',
      email: 'liam@campus.edu',
      studentId: 'EE202512',
      department: 'Electrical Engineering',
      year: '2nd Year',
      password: 'StudentPass123!',
      role: 'student',
      phone: '+1 (555) 456-7890',
      bio: 'Sophomore electrical enthusiast passionate about hardware sustainability.'
    });

    const student4 = await User.create({
      name: 'Sophia Chen',
      email: 'sophia@campus.edu',
      studentId: 'BT202489',
      department: 'Biotechnology',
      year: '3rd Year',
      password: 'StudentPass123!',
      role: 'student',
      phone: '+1 (555) 567-8901',
      bio: 'Bio student eager to help juniors with lab coats and reference manuals.'
    });

    const student5 = await User.create({
      name: 'Marcus Vance',
      email: 'marcus@campus.edu',
      studentId: 'BA202602',
      department: 'Business Administration',
      year: '1st Year',
      password: 'StudentPass123!',
      role: 'student',
      phone: '+1 (555) 678-9012',
      bio: 'Freshman student looking for sports equipment and study desks.'
    });

    console.log(' Users created (Admin + 5 Students).');

    // 3. Create Items across all categories
    const sampleItems = [
      {
        itemName: 'Data Structures & Algorithms in C++ (4th Ed)',
        category: 'Books & Study Materials',
        description: 'Comprehensive textbook used in CS201. Includes clean pages, minimal highlighting in chapter 4, and untouched practice problems. Perfect for second or third-year students.',
        condition: 'Like New',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        pickupLocation: 'Central Library Lobby, Ground Floor',
        donor: student1._id,
        donorName: student1.name,
        donorDepartment: student1.department,
        donorEmail: student1.email,
        status: 'Approved',
        availability: 'Available'
      },
      {
        itemName: 'Arduino Uno Ultimate Sensor & Component Kit',
        category: 'Electronics',
        description: 'Complete Arduino kit with UNO R3 microcontroller board, breadboard, 30+ jumper wires, ultrasonic sensor, servo motor, and LCD module. Used for one semester embedded systems course.',
        condition: 'Good',
        image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
        pickupLocation: 'Engineering Block B, Innovation Lab',
        donor: student3._id,
        donorName: student3.name,
        donorDepartment: student3.department,
        donorEmail: student3.email,
        status: 'Approved',
        availability: 'Available'
      },
      {
        itemName: 'Professional Mechanical Drafting T-Square & Protractor Set',
        category: 'Stationery',
        description: 'High precision 24-inch aluminum T-square, acrylic set squares, technical drafting compass, and protective cylindrical carrying tube. Essential for Engineering Drawing I & II.',
        condition: 'Good',
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
        pickupLocation: 'Mechanical Workshop Entrance',
        donor: student2._id,
        donorName: student2.name,
        donorDepartment: student2.department,
        donorEmail: student2.email,
        status: 'Approved',
        availability: 'Available'
      },
      {
        itemName: 'White Chemical Laboratory Protective Coat (Size L)',
        category: 'Lab Equipment',
        description: 'Standard 100% heavy cotton white lab coat with safety snap buttons and two front pockets. Meets all campus chemistry and bio-lab safety regulations. Clean and freshly laundered.',
        condition: 'Like New',
        image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=800&q=80',
        pickupLocation: 'Life Sciences Quadrangle Bench 3',
        donor: student4._id,
        donorName: student4.name,
        donorDepartment: student4.department,
        donorEmail: student4.email,
        status: 'Approved',
        availability: 'Available'
      },
      {
        itemName: 'Yonex Carbon Graphite Badminton Rackets (Pair) + Shuttles',
        category: 'Sports Equipment',
        description: 'Pair of lightweight Yonex carbon fiber badminton rackets with protective head covers and a tube of 3 nylon tournament shuttlecocks. Fresh grips applied last month.',
        condition: 'Good',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
        pickupLocation: 'Campus Sports Center Gym Reception',
        donor: student1._id,
        donorName: student1.name,
        donorDepartment: student1.department,
        donorEmail: student1.email,
        status: 'Approved',
        availability: 'Available'
      },
      {
        itemName: 'Calculus: Early Transcendentals by Stewart (Metric Edition)',
        category: 'Books & Study Materials',
        description: 'The standard reference for single and multivariable calculus. Hardcover edition in pristine condition. No tear or missing pages.',
        condition: 'New',
        image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80',
        pickupLocation: 'Mathematics Department Notice Board',
        donor: student3._id,
        donorName: student3.name,
        donorDepartment: student3.department,
        donorEmail: student3.email,
        status: 'Approved',
        availability: 'Reserved'
      },
      {
        itemName: 'Texas Instruments TI-84 Plus Graphic Calculator',
        category: 'Electronics',
        description: 'Reliable graphic calculator approved for all campus exams, engineering math, and statistics. Includes fresh AAA batteries and slide cover.',
        condition: 'Like New',
        image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
        pickupLocation: 'Student Union Lounge, Booth 4',
        donor: student2._id,
        donorName: student2.name,
        donorDepartment: student2.department,
        donorEmail: student2.email,
        status: 'Approved',
        availability: 'Available'
      },
      {
        itemName: 'Ergonomic Mesh Study Chair with Lumbar Cushion',
        category: 'Furniture',
        description: 'Comfortable breathable mesh high-back desk chair with 360-degree swivel, height gas lift, and smooth casters. Donating because moving out of campus dorm.',
        condition: 'Good',
        image: 'https://images.unsplash.com/photo-1580481077195-c22ae98c8c67?auto=format&fit=crop&w=800&q=80',
        pickupLocation: 'North Dormitory Block 3, Parking Lot',
        donor: student2._id,
        donorName: student2.name,
        donorDepartment: student2.department,
        donorEmail: student2.email,
        status: 'Approved',
        availability: 'Completed'
      },
      {
        itemName: 'Campus Winter Hooded Sweatshirt - Forest Green (Size M)',
        category: 'Clothing',
        description: 'Official university branded hoodie in deep forest green color. Very warm fleece interior, kangaroo pocket, gently worn for half a semester.',
        condition: 'Good',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        pickupLocation: 'Campus Bookstore Entrance',
        donor: student4._id,
        donorName: student4.name,
        donorDepartment: student4.department,
        donorEmail: student4.email,
        status: 'Approved',
        availability: 'Available'
      },
      {
        itemName: 'Digital Multimeter with Test Probes & Alligator Clips',
        category: 'Lab Equipment',
        description: 'Auto-ranging digital multimeter for measuring AC/DC voltage, current, resistance, capacitance, and diode continuity. Great for circuit lab work.',
        condition: 'Like New',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        pickupLocation: 'Electronics Workshop, Lab 204',
        donor: student3._id,
        donorName: student3.name,
        donorDepartment: student3.department,
        donorEmail: student3.email,
        status: 'Pending', // Pending for Admin Approval demo!
        availability: 'Available'
      },
      {
        itemName: 'Compact Wooden Bedside Study Table with Drawer',
        category: 'Furniture',
        description: 'Lightweight pine wood mini table suitable for laptop study in dorm rooms. Includes one sliding drawer for pens and notebooks.',
        condition: 'Fair',
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
        pickupLocation: 'South Hostel Gate',
        donor: student5._id,
        donorName: student5.name,
        donorDepartment: student5.department,
        donorEmail: student5.email,
        status: 'Pending', // Pending for Admin Approval demo!
        availability: 'Available'
      },
      {
        itemName: 'Insulated Stainless Steel Water Bottle 1000ml',
        category: 'Others',
        description: 'Double-wall vacuum insulated flask. Keeps drinks ice cold for 24h or piping hot for 12h. BPA-free, leakproof bamboo lid.',
        condition: 'New',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
        pickupLocation: 'Eco-Kiosk outside Main Cafeteria',
        donor: student1._id,
        donorName: student1.name,
        donorDepartment: student1.department,
        donorEmail: student1.email,
        status: 'Approved',
        availability: 'Available'
      }
    ];

    const createdItems = await Item.insertMany(sampleItems);
    console.log(` Created ${createdItems.length} donation items.`);

    // 4. Create sample requests
    // Request 1: Marcus requested Alex's DSA book (Pending)
    const req1 = await Request.create({
      item: createdItems[0]._id,
      requester: student5._id,
      donor: student1._id,
      status: 'Pending',
      message: 'Hi Alex! I am taking Data Structures this semester and would love to read this textbook.',
      pickupTime: 'Tuesday afternoon at 3:00 PM'
    });

    // Request 2: Priya requested Stewart Calculus (Accepted & Reserved)
    const req2 = await Request.create({
      item: createdItems[5]._id,
      requester: student2._id,
      donor: student3._id,
      status: 'Accepted',
      message: 'Hello Liam, I need this for my multivariable math revision. Is 4 PM okay?',
      donorNote: 'Sure Priya! Accepted. Let us meet near the Math Dept notice board.',
      pickupTime: 'Today at 4:30 PM'
    });

    // Request 3: Alex requested Priya's Study Chair (Completed)
    const req3 = await Request.create({
      item: createdItems[7]._id,
      requester: student1._id,
      donor: student2._id,
      status: 'Completed',
      message: 'Hey Priya, my dorm chair broke yesterday. Could I pickup this mesh chair?',
      donorNote: 'Glad it found a good home! Successfully handed over.',
      resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    });

    console.log(' Sample requests created (Pending, Accepted, Completed).');

    // 5. Create notifications
    await Notification.create([
      {
        recipient: student1._id,
        sender: student5._id,
        message: `New Request: Marcus Vance (Business Administration) requested your item "${createdItems[0].itemName}".`,
        type: 'REQUEST_RECEIVED',
        relatedItem: createdItems[0]._id,
        relatedRequest: req1._id,
        link: '/my-donations'
      },
      {
        recipient: student2._id,
        sender: student3._id,
        message: `Good news! Your request for "${createdItems[5].itemName}" was ACCEPTED by Liam Martinez. Pickup: Mathematics Department Notice Board.`,
        type: 'REQUEST_ACCEPTED',
        relatedItem: createdItems[5]._id,
        relatedRequest: req2._id,
        link: '/my-requests'
      },
      {
        recipient: admin._id,
        sender: student3._id,
        message: `New item listing pending approval: "${createdItems[9].itemName}" by Liam Martinez (Electrical Engineering).`,
        type: 'GENERAL',
        relatedItem: createdItems[9]._id,
        link: '/admin'
      },
      {
        recipient: admin._id,
        sender: student5._id,
        message: `New item listing pending approval: "${createdItems[10].itemName}" by Marcus Vance (Business Administration).`,
        type: 'GENERAL',
        relatedItem: createdItems[10]._id,
        link: '/admin'
      }
    ]);

    console.log(' Seed dataset successfully populated!');
    return true;
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
};

// Allow running directly via CLI (npm run seed)
if (require.main === module) {
  const connectDB = require('../config/db');
  connectDB().then(async () => {
    await seedData();
    console.log('Seed completed successfully. Exiting.');
    process.exit(0);
  });
}

module.exports = seedData;
