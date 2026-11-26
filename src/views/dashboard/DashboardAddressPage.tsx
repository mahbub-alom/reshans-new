import React, { useState, useEffect, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import { BD_GEO_LOCATIONS } from '../../data/bdGeoData';
import {
  MapPin,
  Phone,
  Plus,
  Edit3,
  Trash2,
  Check,
  Star,
  Building,
  Home,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react';

interface SavedAddress {
  id: string;
  title: string;
  name: string;
  street: string;
  city: string; // District
  area?: string; // Thana / Upazila
  postalCode?: string;
  phone: string;
  isDefault: boolean;
  createdAt?: string;
}

export const DashboardAddressPage: React.FC = () => {
  const { navigate, currentUser, showToast } = useShop();

  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form input fields
  const [title, setTitle] = useState('Home');
  const [name, setName] = useState(currentUser?.name || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Dhaka'); // District
  const [area, setArea] = useState('Banani'); // Thana
  const [postalCode, setPostalCode] = useState('1213');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected district info & thana list from BD_GEO_LOCATIONS
  const currentDistrictData = useMemo(() => {
    return BD_GEO_LOCATIONS.find((d) => d.district === city) || BD_GEO_LOCATIONS[0];
  }, [city]);

  // Handle District Change in modal
  const handleDistrictChange = (newDistrict: string) => {
    setCity(newDistrict);
    const distObj = BD_GEO_LOCATIONS.find((d) => d.district === newDistrict);
    if (distObj && distObj.thanaList.length > 0) {
      setArea(distObj.thanaList[0].name);
      setPostalCode(distObj.thanaList[0].postcode || '');
    } else {
      setArea('');
      setPostalCode('');
    }
  };

  // Handle Thana Change in modal
  const handleThanaChange = (newThana: string) => {
    setArea(newThana);
    const matched = currentDistrictData?.thanaList.find((t) => t.name === newThana);
    if (matched && matched.postcode) {
      setPostalCode(matched.postcode);
    }
  };

  // Fetch addresses from database in real-time
  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      const storedToken = localStorage.getItem('reshans_auth_token');
      const url = currentUser?.id
        ? `/api/user/addresses?userId=${encodeURIComponent(currentUser.id)}`
        : '/api/user/addresses';

      const res = await fetch(url, {
        headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.addresses)) {
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.warn('Failed to load addresses from DB:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [currentUser]);

  // Open modal for new address
  const handleOpenAddModal = () => {
    setEditingId(null);
    setTitle('Home');
    setName(currentUser?.name || '');
    setStreet('');
    setCity('Dhaka');
    setArea('Banani');
    setPostalCode('1213');
    setPhone(currentUser?.phone || '');
    setIsDefault(addresses.length === 0);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (addr: SavedAddress) => {
    setEditingId(addr.id);
    setTitle(addr.title);
    setName(addr.name);
    setStreet(addr.street);
    setCity(addr.city || 'Dhaka');
    setArea(addr.area || 'Banani');
    setPostalCode(addr.postalCode || '');
    setPhone(addr.phone);
    setIsDefault(addr.isDefault);
    setIsModalOpen(true);
  };

  // Save or update address
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !street.trim() || !phone.trim() || !city.trim() || !area.trim()) {
      showToast('Please fill in recipient name, street address, district, thana, and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const storedToken = localStorage.getItem('reshans_auth_token');
      const method = editingId ? 'PUT' : 'POST';
      const payload = {
        ...(editingId ? { id: editingId } : {}),
        title,
        name: name.trim(),
        street: street.trim(),
        city: city.trim(),
        area: area.trim(),
        postalCode: postalCode.trim(),
        phone: phone.trim(),
        isDefault,
        userId: currentUser?.id,
      };

      const res = await fetch('/api/user/addresses', {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          editingId
            ? 'Delivery address updated successfully!'
            : 'New delivery address added successfully!'
        );
        setIsModalOpen(false);
        await loadAddresses();
      } else {
        showToast(data.error || 'Failed to save address', 'error');
      }
    } catch (err) {
      console.error('Save address error:', err);
      showToast('Network error saving address.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set address as default
  const handleSetDefault = async (id: string) => {
    try {
      const storedToken = localStorage.getItem('reshans_auth_token');
      const res = await fetch('/api/user/addresses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        },
        body: JSON.stringify({ id, isDefault: true }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Default delivery address updated!');
        await loadAddresses();
      }
    } catch (err) {
      console.warn('Set default error:', err);
    }
  };

  // Delete address
  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const storedToken = localStorage.getItem('reshans_auth_token');
      const res = await fetch(`/api/user/addresses?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        showToast('Address removed from your address book.');
        await loadAddresses();
      }
    } catch (err) {
      console.warn('Delete address error:', err);
    }
  };

  return (
    <DashboardLayout activeTab="address" title="Address Books">
      <div className="space-y-6 font-satoshi">
        {/* Top Header */}
        <div className="bg-white border border-[#EBEBEB] p-6 rounded-xs shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-satoshi-bold text-[#141414] tracking-tight flex items-center gap-2">
              <MapPin size={22} className="text-[#093624]" />
              <span>Address Books</span>
            </h3>
            <p className="text-xs text-[#7A7A7A] mt-1">
              Manage your verified shipping destinations with District, Thana & Postal Code for rapid checkout.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAddModal}
            className="shrink-0"
          >
            <Plus size={15} className="mr-1.5 inline" />
            Add New Address
          </Button>
        </div>

        {/* Address List Grid */}
        {isLoading ? (
          <div className="bg-white border border-[#EBEBEB] p-12 text-center rounded-xs shadow-2xs space-y-3">
            <Loader2 size={28} className="animate-spin mx-auto text-[#093624]" />
            <p className="text-xs text-[#7A7A7A]">Loading your saved addresses...</p>
          </div>
        ) : addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`bg-white rounded-xs p-6 border transition-all relative flex flex-col justify-between shadow-2xs ${
                  addr.isDefault
                    ? 'border-[#093624] ring-1 ring-[#093624]/20'
                    : 'border-[#EBEBEB] hover:border-[#093624]'
                }`}
              >
                <div>
                  {/* Top Bar: Title & Default Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#093624]/10 text-[#093624] flex items-center justify-center shrink-0">
                        {addr.title.toLowerCase().includes('office') || addr.title.toLowerCase().includes('work') ? (
                          <Building size={15} />
                        ) : (
                          <Home size={15} />
                        )}
                      </div>
                      <h4 className="text-sm font-bold font-satoshi-bold text-[#141414]">
                        {addr.title}
                      </h4>
                    </div>

                    {addr.isDefault ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#093624] bg-[#F9F295] px-2 py-0.5 rounded-xs">
                        <CheckCircle2 size={12} />
                        Default Address
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-[11px] text-gray-500 hover:text-[#093624] font-satoshi-bold hover:underline cursor-pointer"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>

                  {/* Recipient Details */}
                  <div className="space-y-1.5 text-xs text-gray-700 py-1">
                    <p className="font-bold font-satoshi-bold text-[#141414] text-sm">
                      {addr.name}
                    </p>
                    <p className="text-gray-600 leading-relaxed font-satoshi-med">
                      {addr.street}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 text-gray-500 text-[11px] pt-0.5">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-xs font-satoshi-bold text-gray-700">
                        Thana: {addr.area || 'Banani'}
                      </span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded-xs font-satoshi-bold text-gray-700">
                        District: {addr.city || 'Dhaka'}
                      </span>
                      {addr.postalCode && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded-xs font-satoshi-bold text-gray-700">
                          Postal: {addr.postalCode}
                        </span>
                      )}
                    </div>
                    <p className="flex items-center gap-1.5 text-gray-600 pt-1 font-mono">
                      <Phone size={12} className="text-[#093624]" />
                      <span>{addr.phone}</span>
                    </p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4 mt-4">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(addr)}
                    className="inline-flex items-center gap-1 text-xs font-bold font-satoshi-bold text-gray-600 hover:text-[#093624] px-2.5 py-1.5 rounded-xs transition-colors cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold font-satoshi-bold text-gray-400 hover:text-red-600 px-2.5 py-1.5 rounded-xs transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#EBEBEB] p-12 text-center rounded-xs shadow-2xs space-y-4">
            <div className="w-14 h-14 bg-[#093624]/10 text-[#093624] rounded-full flex items-center justify-center mx-auto">
              <MapPin size={26} />
            </div>
            <div>
              <h4 className="text-base font-bold font-satoshi-bold text-[#141414]">
                No delivery addresses saved yet
              </h4>
              <p className="text-xs text-[#7A7A7A] mt-1 max-w-sm mx-auto">
                Save your home or office address with district, thana and postal code to experience instantaneous checkout.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={handleOpenAddModal}>
              <Plus size={15} className="mr-1.5 inline" />
              Add Your First Address
            </Button>
          </div>
        )}

        {/* Modal: Add or Edit Address */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white max-w-lg w-full rounded-xs shadow-2xl p-6 sm:p-7 relative space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#093624]" />
                  <h3 className="text-base font-bold font-satoshi-bold text-[#141414]">
                    {editingId ? 'Edit Delivery Destination' : 'Add New Delivery Destination'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-black cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Address Label / Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold">
                      Address Label <span className="text-[#093624]">*</span>
                    </label>
                    <select
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full h-11 bg-white border border-[#E0DCD9] px-3 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none cursor-pointer"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Studio">Studio</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Recipient Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold">
                      Recipient Name <span className="text-[#093624]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Floyd Miles"
                      className="w-full h-11 bg-white border border-[#E0DCD9] px-3 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold">
                      Contact Phone <span className="text-[#093624]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1700 000 000"
                      className="w-full h-11 bg-white border border-[#E0DCD9] px-3 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                    />
                  </div>

                  {/* District / City */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold">
                      District <span className="text-[#093624]">*</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full h-11 bg-white border border-[#E0DCD9] px-3 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none cursor-pointer"
                    >
                      {BD_GEO_LOCATIONS.map((d) => (
                        <option key={d.district} value={d.district}>
                          {d.district} ({d.division})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Thana / Upazila */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold">
                      Thana / Area <span className="text-[#093624]">*</span>
                    </label>
                    <select
                      value={area}
                      onChange={(e) => handleThanaChange(e.target.value)}
                      className="w-full h-11 bg-white border border-[#E0DCD9] px-3 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none cursor-pointer"
                    >
                      {currentDistrictData?.thanaList.map((t) => (
                        <option key={t.name} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold">
                    Full Street Address (House, Road, Block) <span className="text-[#093624]">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. House 24, Road 11, Block D"
                    className="w-full p-3 bg-white border border-[#E0DCD9] text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none resize-none"
                  />
                </div>

                {/* Postal Code & Default Checkbox */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5 font-satoshi-bold">
                      Postal Code (Zip Code)
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="1213"
                      className="w-full h-11 bg-white border border-[#E0DCD9] px-3 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                    />
                  </div>

                  <div className="pt-2 sm:pt-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                        className="w-4 h-4 accent-[#093624] rounded-xs cursor-pointer"
                      />
                      <span className="text-xs font-bold font-satoshi-bold text-[#141414]">
                        Set as primary default address
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        Saving to Database...
                      </span>
                    ) : editingId ? (
                      'Update Address'
                    ) : (
                      'Save Address'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
