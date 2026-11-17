import React from 'react';

interface MegamenuProps {
  onClose: () => void;
}

const DEMOS = [
  { title: 'Fashion v1', img: '/assets/img/menu/menu-1.jpg', tag: '' },
  { title: 'Fashion v2', img: '/assets/img/menu/menu-2.jpg', tag: '' },
  { title: 'Fashion v3', img: '/assets/img/menu/menu-3.jpg', tag: 'Current', isCurrent: true },
  { title: 'Electronics', img: '/assets/img/menu/menu-4.jpg', tag: '' },
  { title: 'Grocery', img: '/assets/img/menu/menu-5.jpg', tag: '' },
  { title: 'Medical', img: '/assets/img/menu/menu-6.jpg', tag: '' },
  { title: 'Furniture', img: '/assets/img/menu/menu-7.jpg', tag: '' },
  { title: 'Cosmetics', img: '/assets/img/menu/menu-8.jpg', tag: '' },
  { title: 'Minimalist', img: '/assets/img/menu/menu-9.jpg', tag: '' },
  { title: 'Bag Collection', img: '/assets/img/menu/menu-10.jpg', tag: 'Trending' },
];

export const Megamenu: React.FC<MegamenuProps> = ({ onClose }) => {
  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 py-8 px-6 z-50 transition-all duration-300"
    >
      <div className="max-w-[1550px] mx-auto">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-[#093624] font-satoshi-bold">
              Reshans Storefront Demos & Collections
            </h3>
            <p className="text-xs text-[#7A7A7A] mt-0.5 font-satoshi">
              Explore diverse luxury apparel, modern fashion aesthetics and retail layouts
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#F9F295] text-[#093624] rounded-xs font-satoshi-bold">
            Fashion v3 Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {DEMOS.map((demo) => (
            <div
              key={demo.title}
              className={`group/card cursor-pointer p-2 rounded-sm transition-all duration-200 ${
                demo.isCurrent
                  ? 'ring-2 ring-[#093624] bg-[#F9F295]/20'
                  : 'hover:bg-gray-50'
              }`}
              onClick={onClose}
            >
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-gray-100 mb-2.5 shadow-xs">
                <img
                  src={demo.img}
                  alt={demo.title}
                  className="w-full h-full object-cover object-top group-hover/card:scale-105 transition-transform duration-300"
                />
                {demo.tag && (
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-xs tracking-wider uppercase font-satoshi-bold ${
                      demo.isCurrent
                        ? 'bg-[#093624] text-[#F9F295]'
                        : 'bg-[#F9F295] text-[#093624]'
                    }`}
                  >
                    {demo.tag}
                  </span>
                )}
              </div>
              <p
                className={`text-xs font-semibold text-center transition-colors font-satoshi-med ${
                  demo.isCurrent
                    ? 'text-[#093624] font-bold'
                    : 'text-[#141414] group-hover/card:text-[#093624]'
                }`}
              >
                {demo.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
