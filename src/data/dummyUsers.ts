
import { User } from '@/types';

export const dummyUsers: User[] = [
  {
    id: 'admin-001',
    name: 'Admin User',
    phone: '9999999999',
    address: 'Admin Office',
    role: 'admin',
    qrCode: 'admin-001',
    joinDate: '2024-01-01'
  },
  {
    id: 'cust-001',
    name: 'Rahul Sharma',
    phone: '9876543210',
    address: '123 MG Road, Mumbai',
    role: 'customer',
    qrCode: 'cust-001',
    joinDate: '2024-01-15'
  },
  {
    id: 'cust-002',
    name: 'Priya Patel',
    phone: '9876543211',
    address: '456 Park Street, Delhi',
    role: 'customer',
    qrCode: 'cust-002',
    joinDate: '2024-02-01'
  },
  {
    id: 'cust-003',
    name: 'Amit Kumar',
    phone: '9876543212',
    address: '789 Brigade Road, Bangalore',
    role: 'customer',
    qrCode: 'cust-003',
    joinDate: '2024-02-10'
  },
  {
    id: 'del-001',
    name: 'Chai Delivery Boy',
    phone: '9876543213',
    address: 'Delivery Center',
    role: 'deliverer',
    qrCode: 'del-001',
    joinDate: '2024-01-20'
  }
];
