import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/common/Button';
import {
  Camera,
  Check,
  Loader2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const DashboardProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile, showToast } = useShop();

  const [fullName, setFullName] = useState(currentUser?.name || 'Floyd Miles');
  const [gender, setGender] = useState(currentUser?.gender || 'Male');
  const [dob, setDob] = useState(currentUser?.dob || '10/24/1995');
  const [email, setEmail] = useState(currentUser?.email || 'floydmiles@gmail.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+880 1700 000 000');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '/assets/img/others/dashboard-avater.jpg');

  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Calendar picker state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Parse initial DOB into year, month (0-11), and day
  const getInitialDateParts = () => {
    if (dob) {
      // Handles formats like MM/DD/YYYY, YYYY-MM-DD, or DD-MM-YYYY
      const parts = dob.split(/[\/\-\.]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          // YYYY-MM-DD
          return { y: parseInt(parts[0], 10), m: parseInt(parts[1], 10) - 1, d: parseInt(parts[2], 10) };
        } else {
          // MM/DD/YYYY
          return { y: parseInt(parts[2], 10), m: parseInt(parts[0], 10) - 1, d: parseInt(parts[1], 10) };
        }
      }
    }
    return { y: 1995, m: 9, d: 24 };
  };

  const initialParts = getInitialDateParts();
  const [calYear, setCalYear] = useState<number>(initialParts.y || 1995);
  const [calMonth, setCalMonth] = useState<number>(initialParts.m || 9);
  const [selectedDay, setSelectedDay] = useState<number | null>(initialParts.d || 24);

  // Sync state whenever currentUser changes in real-time
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setFullName(currentUser.name);
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.gender) setGender(currentUser.gender);
      if (currentUser.dob) {
        setDob(currentUser.dob);
        const p = getInitialDateParts();
        setCalYear(p.y);
        setCalMonth(p.m);
        setSelectedDay(p.d);
      }
      if (currentUser.avatar) setAvatar(currentUser.avatar);
    }
  }, [currentUser]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  // Calendar calculations
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();

  // Year options for DOB (from current year down to 1920)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((prev) => prev - 1);
    } else {
      setCalMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((prev) => prev + 1);
    } else {
      setCalMonth((prev) => prev + 1);
    }
  };

  const handleSelectDate = (day: number) => {
    setSelectedDay(day);
    const formattedMonth = String(calMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const formattedDate = `${formattedMonth}/${formattedDay}/${calYear}`;
    setDob(formattedDate);
    setIsCalendarOpen(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showToast('File size exceeds 2MB limit. Please choose a smaller image.', 'error');
        return;
      }

      // Preview immediately
      const previewUrl = URL.createObjectURL(file);
      setAvatar(previewUrl);

      // Upload to server/Cloudinary
      setIsUploadingAvatar(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          setAvatar(data.url);
          // Persist directly to user profile in DB
          await updateUserProfile({ avatar: data.url });
        } else {
          showToast('Image uploaded locally for session.', 'success');
        }
      } catch (err) {
        console.warn('Avatar upload fallback:', err);
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateUserProfile({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        gender,
        dob: dob.trim(),
        avatar,
      });

      if (result.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3500);
      }
    } finally {
      setIsLoading(false);
    }
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
                {isUploadingAvatar ? (
                  <Loader2 size={15} className="animate-spin text-[#F9F295]" />
                ) : (
                  <Camera size={15} />
                )}
                <input
                  id="profile-avatar-upload"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  disabled={isUploadingAvatar}
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
              <span>Your profile information has been successfully updated in database!</span>
            </div>
          )}

          {/* Profile Form Fields */}
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
                  className="w-full h-12 bg-white border border-[#E0DCD9] px-4 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Date of Birth with Luxury Interactive Calendar */}
              <div className="relative" ref={calendarRef}>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-2 font-satoshi-bold">
                  Date of Birth <span className="text-[#093624]">*</span>
                </label>
                <div
                  onClick={() => setIsCalendarOpen((prev) => !prev)}
                  className="w-full h-12 bg-white border border-[#E0DCD9] px-4 flex items-center justify-between cursor-pointer hover:border-[#093624] transition-colors group select-none"
                >
                  <span className={`text-xs font-satoshi ${dob ? 'text-brand-black font-satoshi-med' : 'text-gray-400'}`}>
                    {dob || 'Select your date of birth'}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-[#093624] transition-colors">
                    <CalendarIcon size={16} />
                  </div>
                </div>

                {/* Nice Luxury Calendar Dropdown Popup */}
                {isCalendarOpen && (
                  <div className="absolute top-full left-0 mt-2 z-50 w-72 sm:w-80 bg-white border border-[#EBEBEB] rounded-xs shadow-xl p-4 font-satoshi animate-in fade-in zoom-in-95 duration-150">
                    {/* Calendar Header with Month & Year Selectors */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="w-8 h-8 rounded-full border border-gray-200 hover:bg-[#093624] hover:text-[#F9F295] flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                        title="Previous Month"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      <div className="flex items-center gap-1.5">
                        {/* Month Select */}
                        <select
                          value={calMonth}
                          onChange={(e) => setCalMonth(parseInt(e.target.value, 10))}
                          className="text-xs font-bold font-satoshi-bold text-[#141414] bg-gray-50 border border-gray-200 rounded-xs px-2 py-1 cursor-pointer focus:outline-hidden"
                        >
                          {MONTHS.map((m, idx) => (
                            <option key={m} value={idx}>
                              {m}
                            </option>
                          ))}
                        </select>

                        {/* Year Select */}
                        <select
                          value={calYear}
                          onChange={(e) => setCalYear(parseInt(e.target.value, 10))}
                          className="text-xs font-bold font-satoshi-bold text-[#141414] bg-gray-50 border border-gray-200 rounded-xs px-2 py-1 cursor-pointer focus:outline-hidden"
                        >
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="w-8 h-8 rounded-full border border-gray-200 hover:bg-[#093624] hover:text-[#F9F295] flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                        title="Next Month"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    {/* Day Names Row */}
                    <div className="grid grid-cols-7 text-center text-[10px] font-bold font-satoshi-bold uppercase text-gray-400 mb-2">
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </div>

                    {/* Calendar Days Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {/* Empty padding days for first week */}
                      {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="w-8 h-8" />
                      ))}

                      {/* Month Days */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const isSelected =
                          selectedDay === day &&
                          initialParts.m === calMonth &&
                          initialParts.y === calYear;

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleSelectDate(day)}
                            className={`w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-full flex items-center justify-center text-xs font-satoshi-med transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#093624] text-[#F9F295] font-bold shadow-xs scale-105'
                                : 'text-gray-700 hover:bg-[#F9F295]/40 hover:text-[#093624]'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick Today or Clear footer */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          const now = new Date();
                          setCalYear(now.getFullYear());
                          setCalMonth(now.getMonth());
                          handleSelectDate(now.getDate());
                        }}
                        className="text-[#093624] font-bold font-satoshi-bold hover:underline cursor-pointer"
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCalendarOpen(false)}
                        className="text-gray-400 hover:text-gray-600 font-satoshi-med cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Your Email (Locked / Read-Only to protect account authentication) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-black font-satoshi-bold">
                    Your Email <span className="text-[#093624]">*</span>
                  </label>
                  <span className="text-[10px] text-gray-500 font-satoshi-bold uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-xs flex items-center gap-1">
                    <span>Locked</span>
                  </span>
                </div>
                <input
                  type="email"
                  readOnly
                  disabled
                  value={email}
                  placeholder="email@address.com"
                  className="w-full h-12 bg-gray-100 border border-[#E0DCD9] px-4 text-xs font-satoshi text-gray-600 cursor-not-allowed select-none rounded-none"
                  title="Email cannot be changed directly to ensure your account security."
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
                  placeholder="+880 1700 000 000"
                  className="w-full h-12 bg-white border border-[#E0DCD9] px-4 text-xs font-satoshi text-brand-black focus:outline-none focus:border-primary rounded-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 text-right">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
