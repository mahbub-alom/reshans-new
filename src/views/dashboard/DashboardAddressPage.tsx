import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import { MapPin, Mail, Phone, Plus, Edit3, Trash2, Check } from 'lucide-react';

export const DashboardAddressPage: React.FC = () => {
  const { navigate } = useShop();

  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      title: 'Primary Address',
      email: 'floydmiles@gmail.com',
      phone: '(808) 555-0111',
      address: '29 SE 2nd Ave, House 4, Gulshan 2, Dhaka 1212',
      isPrimary: true,
    },
    {
      id: 'addr-2',
      title: 'Banani Studio & Office',
      email: 'floyd.work@reshans.com',
      phone: '(603) 555-0123',
      address: 'Plot 14, Road 11, Block D, Banani, Dhaka 1213',
      isPrimary: false,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAddress) return;

    setAddresses((prev) => [
      ...prev,
      {
        id: `addr-${Date.now()}`,
        title: newTitle,
        email: newEmail || 'floydmiles@gmail.com',
        phone: newPhone || '(808) 555-0111',
        address: newAddress,
        isPrimary: false,
      },
    ]);

    setIsAdding(false);
    setNewTitle('');
    setNewEmail('');
    setNewPhone('');
    setNewAddress('');
  };

  return (
    <DashboardLayout activeTab="address" title="Address Books">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-2xl font-bold font-satoshi-bold text-brand-black tracking-tight">
            Address Books
          </h3>

          {!isAdding && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={16} />}
              onClick={() => setIsAdding(true)}
            >
              Add New Address
            </Button>
          )}
        </div>

        {/* Welcome Text matching .aq-dashboard-addrs-wrapper */}
        <div className="bg-white border border-[#EBEBEB] p-6 shadow-2xs">
          <h2 className="text-lg font-bold font-satoshi-bold text-brand-black mb-1">
            Your Addresses
          </h2>
          <p className="text-xs text-brand-body font-satoshi">
            Manage your saved shipping and billing addresses for rapid checkout across Bangladesh.
          </p>
        </div>

        {/* Add Address Form Modal / Inline Box */}
        {isAdding && (
          <div className="bg-white border-2 border-primary/20 p-6 sm:p-8 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="text-sm font-bold font-satoshi-bold text-brand-black">
                Add New Delivery Destination
              </h4>
              <button
                onClick={() => setIsAdding(false)}
                className="text-xs text-brand-body hover:text-brand-black"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-1 font-satoshi-bold">
                    Address Label (e.g. Home, Office) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Home / Vacation House"
                    className="w-full h-11 bg-white border border-[#E0DCD9] px-4 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-1 font-satoshi-bold">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+880 1700 000 000"
                    className="w-full h-11 bg-white border border-[#E0DCD9] px-4 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-1 font-satoshi-bold">
                  Street Address & City *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="House, Road, Area, Dhaka"
                  className="w-full p-3 bg-white border border-[#E0DCD9] text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                >
                  Save Address
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Address Cards List matching .aq-dashboard-addrs-card */}
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white border border-[#EBEBEB] p-6 shadow-2xs space-y-4 group hover:border-primary transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold font-satoshi-bold text-brand-black">
                    {addr.title}
                  </h3>
                  {addr.isPrimary && (
                    <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider font-satoshi-bold">
                      Primary
                    </span>
                  )}
                </div>

                {/* Edit & Delete Links matching .aq-dashboard-addrs-actions */}
                <div className="flex items-center gap-3 text-xs font-satoshi">
                  <button
                    onClick={() => setIsAdding(true)}
                    className="text-brand-black hover:text-[#093624] font-bold font-satoshi-bold transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-[#6D6868] hover:text-[#141414] font-bold font-satoshi-bold transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Address Details matching .aq-dashboard-addrs-body */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-satoshi text-brand-body">
                <div className="flex items-center gap-2">
                  <Mail size={15} className="text-primary shrink-0" />
                  <span className="truncate">{addr.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={15} className="text-primary shrink-0" />
                  <span>{addr.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-primary shrink-0" />
                  <span className="truncate">{addr.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo box matching .aq-dashboard-addrs-promo */}
        <div className="bg-white border border-[#EBEBEB] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <h4 className="text-base font-bold font-satoshi-bold text-brand-black mb-1">
                Need another shipping address?
              </h4>
              <p className="text-xs text-brand-body font-satoshi">
                Add multiple addresses for office deliveries or gifting anywhere in Bangladesh.
              </p>
            </div>
          </div>

          <Button
            variant="black"
            size="md"
            icon={<Plus size={16} />}
            onClick={() => setIsAdding(true)}
          >
            Add Address
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
