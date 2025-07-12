import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faColumns } from '@fortawesome/free-solid-svg-icons';

function ColumnSelector({ columns, visibleColumns, onToggle }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-sm"
      >
        <FontAwesomeIcon icon={faColumns} className="mr-2" />
        Columns
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg border border-gray-200 z-50">
          <div className="p-2">
            <h4 className="text-sm font-semibold mb-2">Show/Hide Columns</h4>
            {columns.map(col => (
              <label key={col.key} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm mr-2"
                  checked={visibleColumns.includes(col.key)}
                  onChange={() => onToggle(col.key)}
                />
                <span className="text-sm">{col.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ColumnSelector;