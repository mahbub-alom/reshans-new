import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Camera, Check, User } from 'lucide-react';

export const DashboardProfilePage: React.FC = () => {
  const { navigate } = useShop();

  const [fullName, setFullName] = useState('Floyd Miles');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('10/24/1995');
  const [email, setEmail] = useState('floydmiles@gmail.com');
  const [phone, setPhone] = useState('+880 1700 000 000');
  const [city, setCity] = useState('Dhaka');
  const [state, setState] = useState('Dhaka Division');
  const [country, setCountry] = useState('Bangladesh');
  const [zipCode, setZipCode] = useState('1212');
  const [avatar, setAvatar] = useState('/assets/img/others/dashboard-avater.jpg');
  const [isSaved, setIsSaved] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatar(url);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <DashboardLayout activeTab="profile" title="My Profile">
      <div className="space-y-6">
        <h3 className="text-2xl font-bold font-satoshi-bold text-brand-black tracking-tight">
          My Profile
        </h3>

        {/* Profile Form Card matching .aq-dashboard-profile-box */}
        <div className="bg-white border border-[#EBEBEB] p-6 sm:p-10 shadow-2xs">
          {/* Avatar with Camera upload button matching .aq-dashboard-profile-avatar */}
          <div className="text-center mb-10">
            <div className="relative inline-block">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-primary/20 bg-[#F9F9F9] shadow-xs mx-auto">
                <img
                  src={avatar}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              </div>

              <label
                htmlFor="profile-avatar-upload"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary hover:bg-primary-dark text-secondary flex items-center justify-center cursor-pointer shadow-md transition-colors"
                title="Change photo"
              >
                <Camera size={15} />
                <input
                  id="profile-avatar-upload"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <p className="text-xs text-brand-body font-satoshi mt-2">
              JPG or PNG, max size 2MB
            </p>
          </div>

          {isSaved && (
            <div className="mb-6 p-4 bg-[#F9F295]/50 border border-[#093624] text-[#093624] text-xs font-satoshi-bold flex items-center gap-2">
              <Check size={16} />
              <span>Your profile information has been successfully updated!</span>
            </div>
          )}

          {/* Profile Form Fields matching reference */}
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-2 font-satoshi-bold">
                  Full Name <span className="text-[#093624]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Shakil Ahmed"
                  className="w-full h-12 bg-white border border-[#E0DCD9] px-4 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-2 font-satoshi-bold">
                  Gender <span className="text-[#093624]">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-12 bg-white border border-[#E0DCD9] px-4 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-2 font-satoshi-bold">
                  Date of Birth <span className="text-[#093624]">*</span>
                </label>
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="mm/dd/yyyy"
                  className="w-full h-12 bg-white border border-[#E0DCD9] px-4 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                />
              </div>

              {/* Your Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-2 font-satoshi-bold">
                  Your Email <span className="text-[#093624]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@address.com"
                  className="w-full h-12 bg-white border border-[#E0DCD9] px-4 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                />
              </div>

              {/* Mobile No */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-2 font-satoshi-bold">
                  Mobile No <span className="text-[#093624]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(603) 555-0123"
                  className="w-full h-12 bg-white border border-[#E0DCD9] px-4 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-2 font-satoshi-bold">
                  City <span className="text-[#093624]">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-12 bg-white border border-[#E0DCD9] px-4 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-2 font-satoshi-bold">
                  State / Division <span className="text-[#093624]">*</span>
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full h-12 bg-white border border-[#E0DCD9] px-4 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                >
                  <option value="Dhaka Division">Dhaka Division</option>
                  <option value="Chittagong Division">Chittagong Division</option>
                  <option value="Sylhet Division">Sylhet Division</option>
                </select>
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-2 font-satoshi-bold">
                  Country <span className="text-[#093624]">*</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-12 bg-white border border-[#E0DCD9] px-4 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                >
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-2 font-satoshi-bold">
                  Zip Code <span className="text-[#093624]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="1212"
                  className="w-full h-12 bg-white border border-[#E0DCD9] px-4 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                />
              </div>
            </div>

            {/* Submit Button matching .aq-dashboard-digital-product__download-btn */}
            <div className="pt-4 text-right">
              <Button
                type="submit"
                variant="primary"
                size="md"
              >
                Update Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
