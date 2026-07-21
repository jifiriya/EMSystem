const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Department = require('./models/Department');
const Employee = require('./models/Employee');

const seedDatabase = async () => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('🌱 Database already populated. Skipping seed.');
      return;
    }

    console.log('🌱 Starting database seeding process...');

    // 1. Seed Admin User
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'admin@pulsehr.com',
      password: hashedPassword,
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    });

    // 2. Seed Departments
    const depts = [
      {
        name: 'Engineering',
        code: 'ENG',
        description: 'Software development, cloud architecture, and technical innovation.',
        managerName: 'Alex Rivera',
        location: 'Building A - Floor 4',
        budget: 1200000
      },
      {
        name: 'Human Resources',
        code: 'HR',
        description: 'Talent acquisition, employee wellness, payroll, and culture.',
        managerName: 'Sarah Jenkins',
        location: 'Building B - Floor 2',
        budget: 450000
      },
      {
        name: 'Product & Design',
        code: 'PD',
        description: 'User experience research, product design, and feature strategy.',
        managerName: 'Elena Rostova',
        location: 'Building A - Floor 3',
        budget: 750000
      },
      {
        name: 'Marketing',
        code: 'MKT',
        description: 'Brand management, growth campaigns, public relations, and sales enablement.',
        managerName: 'Marcus Sterling',
        location: 'Building C - Floor 1',
        budget: 600000
      },
      {
        name: 'Finance & Legal',
        code: 'FIN',
        description: 'Financial forecasting, corporate compliance, and accounting.',
        managerName: 'David Chen',
        location: 'Building B - Floor 4',
        budget: 900000
      }
    ];

    const createdDepts = await Department.insertMany(depts);
    const deptMap = {};
    createdDepts.forEach(d => {
      deptMap[d.code] = d._id;
    });

    // 3. Seed Sample Employees
    const employees = [
      {
        employeeId: 'EMP-101',
        firstName: 'Alex',
        lastName: 'Rivera',
        email: 'alex.rivera@pulsehr.com',
        phone: '+1 (555) 234-5678',
        role: 'Principal Software Engineer',
        department: deptMap['ENG'],
        status: 'Active',
        joinDate: new Date('2022-03-15'),
        salary: 145000,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'Passionate full-stack developer with 8+ years of experience building distributed web services.',
        emergencyContact: { name: 'Maria Rivera', phone: '+1 (555) 987-6543', relation: 'Spouse' }
      },
      {
        employeeId: 'EMP-102',
        firstName: 'Elena',
        lastName: 'Rostova',
        email: 'elena.rostova@pulsehr.com',
        phone: '+1 (555) 345-6789',
        role: 'Head of Product Design',
        department: deptMap['PD'],
        status: 'Active',
        joinDate: new Date('2021-08-01'),
        salary: 135000,
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        bio: 'Focuses on user-centric design system architecture and accessible UI design.',
        emergencyContact: { name: 'Dmitri Rostov', phone: '+1 (555) 876-5432', relation: 'Brother' }
      },
      {
        employeeId: 'EMP-103',
        firstName: 'Marcus',
        lastName: 'Sterling',
        email: 'marcus.sterling@pulsehr.com',
        phone: '+1 (555) 456-7890',
        role: 'Marketing Director',
        department: deptMap['MKT'],
        status: 'Active',
        joinDate: new Date('2023-01-10'),
        salary: 120000,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bio: 'Growth strategist specializing in digital acquisition and performance branding.',
        emergencyContact: { name: 'Julia Sterling', phone: '+1 (555) 765-4321', relation: 'Spouse' }
      },
      {
        employeeId: 'EMP-104',
        firstName: 'David',
        lastName: 'Chen',
        email: 'david.chen@pulsehr.com',
        phone: '+1 (555) 567-8901',
        role: 'Senior Financial Analyst',
        department: deptMap['FIN'],
        status: 'Active',
        joinDate: new Date('2020-11-20'),
        salary: 110000,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        bio: 'Financial modeler with deep expertise in SaaS metrics, revenue forecasting, and audit.',
        emergencyContact: { name: 'Grace Chen', phone: '+1 (555) 654-3210', relation: 'Sister' }
      },
      {
        employeeId: 'EMP-105',
        firstName: 'Jessica',
        lastName: 'Taylor',
        email: 'jessica.taylor@pulsehr.com',
        phone: '+1 (555) 678-9012',
        role: 'HR Business Partner',
        department: deptMap['HR'],
        status: 'Active',
        joinDate: new Date('2022-09-01'),
        salary: 95000,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        bio: 'Dedicated HR specialist driven by positive team culture and talent retention.',
        emergencyContact: { name: 'Robert Taylor', phone: '+1 (555) 543-2109', relation: 'Father' }
      },
      {
        employeeId: 'EMP-106',
        firstName: 'Michael',
        lastName: 'Chang',
        email: 'michael.chang@pulsehr.com',
        phone: '+1 (555) 789-0123',
        role: 'Frontend Engineer',
        department: deptMap['ENG'],
        status: 'On Leave',
        joinDate: new Date('2023-04-12'),
        salary: 105000,
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        bio: 'React and CSS enthusiast focused on snappy user interfaces and performance.',
        emergencyContact: { name: 'Linda Chang', phone: '+1 (555) 432-1098', relation: 'Mother' }
      },
      {
        employeeId: 'EMP-107',
        firstName: 'Aisha',
        lastName: 'Patel',
        email: 'aisha.patel@pulsehr.com',
        phone: '+1 (555) 890-1234',
        role: 'UX Researcher',
        department: deptMap['PD'],
        status: 'Active',
        joinDate: new Date('2023-07-18'),
        salary: 98000,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        bio: 'Passionate qualitative researcher uncovering key user insights and usability patterns.',
        emergencyContact: { name: 'Vikram Patel', phone: '+1 (555) 321-0987', relation: 'Spouse' }
      },
      {
        employeeId: 'EMP-108',
        firstName: 'Liam',
        lastName: 'O\'Connor',
        email: 'liam.oconnor@pulsehr.com',
        phone: '+1 (555) 901-2345',
        role: 'DevOps & Cloud Architect',
        department: deptMap['ENG'],
        status: 'Active',
        joinDate: new Date('2021-02-14'),
        salary: 138000,
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        bio: 'Kubernetes wizard ensuring high availability, continuous deployment, and security.',
        emergencyContact: { name: 'Siobhan O\'Connor', phone: '+1 (555) 210-9876', relation: 'Sister' }
      },
      {
        employeeId: 'EMP-109',
        firstName: 'Chloe',
        lastName: 'Dubois',
        email: 'chloe.dubois@pulsehr.com',
        phone: '+1 (555) 012-3456',
        role: 'Content Strategy Manager',
        department: deptMap['MKT'],
        status: 'On Leave',
        joinDate: new Date('2022-11-05'),
        salary: 88000,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'Storyteller crafting brand narratives, thought leadership, and press releases.',
        emergencyContact: { name: 'Pierre Dubois', phone: '+1 (555) 109-8765', relation: 'Brother' }
      },
      {
        employeeId: 'EMP-110',
        firstName: 'Brandon',
        lastName: 'Vance',
        email: 'brandon.vance@pulsehr.com',
        phone: '+1 (555) 123-4567',
        role: 'Talent Acquisition Specialist',
        department: deptMap['HR'],
        status: 'Active',
        joinDate: new Date('2024-01-15'),
        salary: 82000,
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
        bio: 'Connecting tech talent with meaningful opportunities across Engineering and Product.',
        emergencyContact: { name: 'Samantha Vance', phone: '+1 (555) 098-7654', relation: 'Spouse' }
      }
    ];

    await Employee.insertMany(employees);
    console.log('✅ Database successfully seeded with demo user, 5 departments, and 10 employee profiles!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  }
};

module.exports = seedDatabase;
