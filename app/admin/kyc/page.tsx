'use client';

import { useState } from 'react';
import StatCard from '../_components/StatCard';
import Badge from '../_components/Badge';
import Avatar from '../_components/Avatar';
import { kycDocuments } from '../_components/mock-data';

const formatINR = (value: number) => {
  return value.toLocaleString('en-IN');
};

export default function KYCPage() {
  // API CALL: Backend endpoint to fetch pending KYC documents
  // GET /api/admin/kyc/pending?limit=8
  // Description: Fetch pending KYC documents awaiting admin review
  // Response: { kycDocuments: [], pendingCount: number }

  const [rejectModal, setRejectModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<(typeof kycDocuments)[0] | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');

  const pendingCount = 0;
  const verifiedCount = 0;
  const rejectedCount = 0;
  const notSubmittedCount = 0;

  const handleRejectOpen = (doc: (typeof kycDocuments)[0]) => {
    setSelectedDoc(doc);
    setRejectModal(true);
  };

  const handleRejectSubmit = () => {
    // API CALL: Backend endpoint to reject KYC document
    // POST /api/admin/kyc/reject
    // Body: { kycId, userId, reason, adminNotes }
    // Response: { success: boolean, transactionId: string }
    console.log('KYC Rejected:', {
      kycId: selectedDoc?.id,
      reason: rejectReason,
      notes: rejectNotes,
    });
    setRejectModal(false);
    setSelectedDoc(null);
    setRejectReason('');
    setRejectNotes('');
  };

  const handleApprove = (doc: (typeof kycDocuments)[0]) => {
    // API CALL: Backend endpoint to approve KYC document
    // POST /api/admin/kyc/approve
    // Body: { kycId, userId }
    // Response: { success: boolean, verificationId: string }
    console.log('KYC Approved:', doc.id);
  };

  return (
    <div className="space-y-8">
      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          icon="⏳"
          value={pendingCount}
          label="Pending Review"
          accentColor="#d97706"
        />
        <StatCard
          icon="✅"
          value={formatINR(verifiedCount)}
          label="Verified"
          accentColor="#16a34a"
        />
        <StatCard
          icon="❌"
          value={rejectedCount}
          label="Rejected"
          accentColor="#dc2626"
        />
        <StatCard
          icon="⚠️"
          value={formatINR(notSubmittedCount)}
          label="Not Submitted"
          accentColor="#6b7280"
        />
      </div>

      {/* PENDING KYC SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-bold text-[#111827]">Pending Review</h3>
          <button className="bg-[#d97706] text-white font-bold px-4 py-2 rounded-xl hover:bg-[#b45309] transition-colors text-[13px]">
            ✓ Bulk Approve All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {kycDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm flex items-center gap-4"
            >
              {/* Left: Avatar */}
              <Avatar name={doc.userName} size="lg" />

              {/* Middle: Details */}
              <div className="flex-1">
                <p className="font-bold text-[#111827] text-[14px]">{doc.userName}</p>
                <p className="text-[12px] text-[#6b7280]">{doc.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    label={doc.docType}
                    variant={
                      doc.docType === 'Aadhaar'
                        ? 'blue'
                        : doc.docType === 'PAN'
                          ? 'gold'
                          : doc.docType === 'Passport'
                            ? 'purple'
                            : 'green'
                    }
                  />
                  <span className="text-[11px] text-[#6b7280]">
                    Submitted {new Date(doc.submittedAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex flex-col gap-2">
                <button className="bg-[#f9fafb] border border-[#e5e7eb] text-[#4b5563] px-3 py-1 rounded-lg hover:border-[#9ca3af] text-[12px] font-medium transition-colors">
                  👁 View Docs
                </button>
                <button
                  onClick={() => handleApprove(doc)}
                  className="bg-[#dcfce7] border border-[#86efac] text-[#16a34a] px-3 py-1 rounded-lg hover:bg-[#bbf7d0] text-[12px] font-medium transition-colors"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => handleRejectOpen(doc)}
                  className="bg-[#fee2e2] border border-[#fca5a5] text-[#dc2626] px-3 py-1 rounded-lg hover:bg-[#fecaca] text-[12px] font-medium transition-colors"
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REJECT MODAL */}
      {rejectModal && selectedDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-[400px] w-full mx-4 border border-[#e5e7eb]">
            <h3 className="text-[18px] font-bold text-[#111827] mb-6">
              Reject KYC — {selectedDoc.userName}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                  Rejection Reason *
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-lg px-3 py-2 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors"
                >
                  <option value="">Select reason...</option>
                  <option>Blurry/Unclear Image</option>
                  <option>Name Mismatch with Account</option>
                  <option>Expired Document</option>
                  <option>Suspected Fake Document</option>
                  <option>Incomplete Submission</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#4b5563] mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Message will be sent to user..."
                  rows={3}
                  className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-lg px-3 py-2 text-[#111827] text-[13px] outline-none focus:border-[#d97706] transition-colors placeholder:text-[#9ca3af] resize-none"
                />
              </div>

              <div className="bg-[#fee2e2] border border-[#fca5a5] rounded-lg p-3 text-[12px] text-[#dc2626]">
                ⚠️ User will be notified and can re-submit documents
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleRejectSubmit}
                  disabled={!rejectReason}
                  className="flex-1 bg-[#dc2626] text-white font-bold px-3 py-2 rounded-lg hover:bg-[#b91c1c] transition-colors text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => {
                    setRejectModal(false);
                    setSelectedDoc(null);
                    setRejectReason('');
                    setRejectNotes('');
                  }}
                  className="flex-1 bg-[#f9fafb] border border-[#e5e7eb] text-[#4b5563] px-3 py-2 rounded-lg hover:border-[#9ca3af] transition-colors text-[13px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VERIFIED USERS SECTION */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
        <h3 className="text-[18px] font-bold text-[#111827] mb-6">
          Recently Verified ({verifiedCount})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  User
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Document Type
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Verified Date
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Verified By
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: 'Ravi Kumar',
                  docType: 'Aadhaar',
                  verifiedDate: '2026-02-20',
                  verifiedBy: 'Admin1',
                },
                {
                  name: 'Priya Sharma',
                  docType: 'PAN Card',
                  verifiedDate: '2026-02-19',
                  verifiedBy: 'Admin2',
                },
                {
                  name: 'Amit Singh',
                  docType: 'Passport',
                  verifiedDate: '2026-02-18',
                  verifiedBy: 'Admin1',
                },
                {
                  name: 'Sneha Patel',
                  docType: 'Voter ID',
                  verifiedDate: '2026-02-17',
                  verifiedBy: 'Admin3',
                },
                {
                  name: 'Kiran Rao',
                  docType: 'Aadhaar',
                  verifiedDate: '2026-02-16',
                  verifiedBy: 'Admin2',
                },
                {
                  name: 'Deepak Mehta',
                  docType: 'PAN Card',
                  verifiedDate: '2026-02-15',
                  verifiedBy: 'Admin1',
                },
                {
                  name: 'Ananya Krishna',
                  docType: 'Aadhaar',
                  verifiedDate: '2026-02-14',
                  verifiedBy: 'Admin3',
                },
                {
                  name: 'Vikram Desai',
                  docType: 'Passport',
                  verifiedDate: '2026-02-13',
                  verifiedBy: 'Admin2',
                },
                {
                  name: 'Neha Gupta',
                  docType: 'Voter ID',
                  verifiedDate: '2026-02-12',
                  verifiedBy: 'Admin1',
                },
                {
                  name: 'Rohan Verma',
                  docType: 'Aadhaar',
                  verifiedDate: '2026-02-11',
                  verifiedBy: 'Admin3',
                },
              ].map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={row.name} size="sm" />
                      <span className="font-semibold text-[#111827]">{row.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">{row.docType}</td>
                  <td className="py-3 px-4 text-[#4b5563]">
                    {new Date(row.verifiedDate).toLocaleDateString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">{row.verifiedBy}</td>
                  <td className="py-3 px-4">
                    <Badge label="Verified" variant="green" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REJECTED SECTION */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
        <h3 className="text-[18px] font-bold text-[#111827] mb-6">
          Rejected ({rejectedCount})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  User
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Document Type
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Rejected Date
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Rejection Reason
                </th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold text-[#4b5563] uppercase tracking-wider">
                  Re-submit Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: 'User A',
                  docType: 'Aadhaar',
                  rejectedDate: '2026-02-01',
                  reason: 'Blurry/Unclear',
                  status: 'Pending',
                },
                {
                  name: 'User B',
                  docType: 'PAN',
                  rejectedDate: '2026-02-02',
                  reason: 'Name Mismatch',
                  status: 'Resubmitted',
                },
                {
                  name: 'User C',
                  docType: 'Passport',
                  rejectedDate: '2026-02-03',
                  reason: 'Expired Document',
                  status: 'Pending',
                },
                {
                  name: 'User D',
                  docType: 'Aadhaar',
                  rejectedDate: '2026-02-04',
                  reason: 'Incomplete',
                  status: 'Resubmitted',
                },
                {
                  name: 'User E',
                  docType: 'Voter ID',
                  rejectedDate: '2026-02-05',
                  reason: 'Suspected Fake',
                  status: 'Pending',
                },
                {
                  name: 'User F',
                  docType: 'Aadhaar',
                  rejectedDate: '2026-02-06',
                  reason: 'Unclear Details',
                  status: 'Resubmitted',
                },
                {
                  name: 'User G',
                  docType: 'PAN',
                  rejectedDate: '2026-02-07',
                  reason: 'Name Mismatch',
                  status: 'Pending',
                },
                {
                  name: 'User H',
                  docType: 'Passport',
                  rejectedDate: '2026-02-08',
                  reason: 'Other',
                  status: 'Resubmitted',
                },
              ].map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={row.name} size="sm" />
                      <span className="font-semibold text-[#111827]">{row.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#4b5563]">{row.docType}</td>
                  <td className="py-3 px-4 text-[#4b5563]">
                    {new Date(row.rejectedDate).toLocaleDateString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-[#dc2626] font-semibold">{row.reason}</td>
                  <td className="py-3 px-4">
                    <Badge
                      label={row.status}
                      variant={row.status === 'Resubmitted' ? 'blue' : 'gold'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
