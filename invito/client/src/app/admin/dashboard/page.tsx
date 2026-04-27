'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import toast from 'react-hot-toast';
import { HiOutlineUsers, HiOutlineEnvelope, HiOutlineCurrencyDollar, HiOutlineStar } from 'react-icons/hi2';
import { formatDate } from '@/lib/utils';

type TabType = 'overview' | 'users' | 'invitations' | 'payments';

export default function AdminDashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [dataLoading, setDataLoading] = useState(true);
  
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  // Protect route
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role !== 'admin') {
        router.push('/dashboard');
        toast.error('Access denied. Administrator privileges required.');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Fetch data
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const [statsRes, usersRes, invRes, payRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/invitations'),
        api.get('/admin/payments'),
      ]);
      setStats(statsRes.data.data.stats);
      setUsers(usersRes.data.data.users);
      setInvitations(invRes.data.data.invitations);
      setPayments(payRes.data.data.payments);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast.error('Failed to load admin data.');
    } finally {
      setDataLoading(false);
    }
  };

  if (isLoading || (user?.role === 'admin' && dataLoading)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{ width: '44px', height: '44px', border: '3px solid rgba(240,101,149,0.2)', borderTopColor: '#f06595', borderRadius: '50%', margin: '0 auto 1rem' }} />
          <p style={{ color: '#868e96' }}>Loading Admin Console...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ flex: 1, display: 'flex', paddingTop: '70px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        {/* Sidebar */}
        <aside style={{ width: '250px', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#868e96', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
            Admin Console
          </h2>
          {[
            { id: 'overview', label: 'Overview', icon: <HiOutlineStar /> },
            { id: 'users', label: 'Users', icon: <HiOutlineUsers /> },
            { id: 'invitations', label: 'Invitations', icon: <HiOutlineEnvelope /> },
            { id: 'payments', label: 'Payments', icon: <HiOutlineCurrencyDollar /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? 'rgba(240,101,149,0.1)' : 'transparent',
                color: activeTab === tab.id ? '#f06595' : '#adb5bd',
                fontSize: '0.95rem',
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f3f5' }}>
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'invitations' && 'All Invitations'}
              {activeTab === 'payments' && 'Payment Records'}
            </h1>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <div className="card">
                <div style={{ color: '#5c7cfa', fontSize: '1.5rem', marginBottom: '0.5rem' }}><HiOutlineUsers /></div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalUsers}</h3>
                <p style={{ color: '#868e96', fontSize: '0.9rem' }}>Total Users</p>
              </div>
              <div className="card">
                <div style={{ color: '#f59e0b', fontSize: '1.5rem', marginBottom: '0.5rem' }}><HiOutlineStar /></div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.premiumUsers}</h3>
                <p style={{ color: '#868e96', fontSize: '0.9rem' }}>Premium Users</p>
              </div>
              <div className="card">
                <div style={{ color: '#40c057', fontSize: '1.5rem', marginBottom: '0.5rem' }}><HiOutlineEnvelope /></div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalInvitations}</h3>
                <p style={{ color: '#868e96', fontSize: '0.9rem' }}>Invitations Created</p>
              </div>
              <div className="card">
                <div style={{ color: '#f06595', fontSize: '1.5rem', marginBottom: '0.5rem' }}><HiOutlineCurrencyDollar /></div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalRsvps}</h3>
                <p style={{ color: '#868e96', fontSize: '0.9rem' }}>Total RSVPs Captured</p>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="card" style={{ padding: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#adb5bd' }}>
                    <th style={{ padding: '1rem' }}>Name</th>
                    <th style={{ padding: '1rem' }}>Email</th>
                    <th style={{ padding: '1rem' }}>Role</th>
                    <th style={{ padding: '1rem' }}>Plan</th>
                    <th style={{ padding: '1rem' }}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', color: '#f1f3f5' }}>{u.name}</td>
                      <td style={{ padding: '1rem', color: '#868e96' }}>{u.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className={u.role === 'admin' ? 'badge badge-primary' : 'badge badge-secondary'}>{u.role}</span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {u.plan === 'premium' ? <span style={{ color: '#f59e0b', fontWeight: 600 }}>👑 Premium</span> : <span style={{ color: '#868e96' }}>Free</span>}
                      </td>
                      <td style={{ padding: '1rem', color: '#868e96' }}>{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* INVITATIONS TAB */}
          {activeTab === 'invitations' && (
            <div className="card" style={{ padding: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#adb5bd' }}>
                    <th style={{ padding: '1rem' }}>Title</th>
                    <th style={{ padding: '1rem' }}>Creator</th>
                    <th style={{ padding: '1rem' }}>Template</th>
                    <th style={{ padding: '1rem' }}>RSVPs</th>
                    <th style={{ padding: '1rem' }}>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map(i => (
                    <tr key={i._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', color: '#f1f3f5', fontWeight: 500 }}>{i.title}</td>
                      <td style={{ padding: '1rem', color: '#868e96' }}>{i.userId?.email || 'Unknown'}</td>
                      <td style={{ padding: '1rem' }}><span className="badge badge-secondary">{i.templateId}</span></td>
                      <td style={{ padding: '1rem', color: '#868e96' }}>{i.rsvpCount || 0}</td>
                      <td style={{ padding: '1rem', color: '#868e96' }}>{formatDate(i.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="card" style={{ padding: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#adb5bd' }}>
                    <th style={{ padding: '1rem' }}>User Email</th>
                    <th style={{ padding: '1rem' }}>Payment ID</th>
                    <th style={{ padding: '1rem' }}>Order ID</th>
                    <th style={{ padding: '1rem' }}>Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', color: '#f1f3f5' }}>{p.email}</td>
                      <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#5c7cfa' }}>{p.paymentId}</td>
                      <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#868e96' }}>{p.orderId}</td>
                      <td style={{ padding: '1rem', color: '#868e96' }}>{p.planExpiresAt ? formatDate(p.planExpiresAt) : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
