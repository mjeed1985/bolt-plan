import React from 'react';

const InfoItem = ({ label, value, icon, isList = false, subListKey = 'name' }) => (
  <div className="flex items-start space-x-3 py-2.5 border-b border-gray-200/70 last:border-b-0">
    {icon && React.cloneElement(icon, { className: "h-5 w-5 text-purple-500 mt-1 flex-shrink-0" })}
    <div className="flex-grow">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {isList && Array.isArray(value) ? (
        value.length > 0 ? (
          <ul className="list-disc list-inside pl-2 text-md text-gray-800 space-y-1 mt-1">
<<<<<<< HEAD
            {value.map((item, index) => {
              let displayItem = "غير محدد";
              if (item !== null && item !== undefined) {
                if (typeof item === 'object') {
                  displayItem = item.label || item[subListKey] || item.value || JSON.stringify(item);
                } else {
                  displayItem = String(item);
                }
              }
              
              const countInfo = (typeof item === 'object' && item !== null && item.count !== undefined) ? ` (العدد: ${item.count})` : '';
              const specInfo = (typeof item === 'object' && item !== null && item.specialization === 'other' && item.custom_specialization) ? ` (تخصص: ${item.custom_specialization})` : '';

              return (
                <li key={index} className="leading-relaxed">
                  {displayItem}{countInfo}{specInfo}
                </li>
              );
            })}
=======
            {value.map((item, index) => (
              <li key={index} className="leading-relaxed">
                {typeof item === 'object' && item !== null ? item[subListKey] : item}
                {typeof item === 'object' && item !== null && item.count !== undefined && ` ( العدد: ${item.count} )`}
                {typeof item === 'object' && item !== null && item.specialization === 'other' && item.custom_specialization && ` ( التخصص: ${item.custom_specialization} )`}
              </li>
            ))}
>>>>>>> cd51de4 (initial push)
          </ul>
        ) : (
          <p className="text-md text-gray-700 mt-0.5">غير محدد</p>
        )
      ) : (
<<<<<<< HEAD
        <p className="text-md text-gray-800 break-words whitespace-pre-line mt-0.5">
          {(() => {
            if (value === null || value === undefined || value === '') return 'غير محدد';
            if (React.isValidElement(value)) return value;
            if (typeof value === 'object') {
              return value.label || value.value || JSON.stringify(value);
            }
            return String(value);
          })()}
        </p>
=======
        <p className="text-md text-gray-800 break-words whitespace-pre-line mt-0.5">{value || "غير محدد"}</p>
>>>>>>> cd51de4 (initial push)
      )}
    </div>
  </div>
);

export default InfoItem;