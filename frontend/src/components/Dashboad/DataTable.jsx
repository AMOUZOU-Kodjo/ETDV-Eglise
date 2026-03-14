// src/components/Dashboard/DataTable.jsx
import React from "react";

const DataTable = ({ 
  columns, 
  data, 
  selectable = false,
  selectedItems = [],
  onSelect,
  onSelectAll 
}) => {
  const handleSelectAll = () => {
    if (selectedItems.length === data.length) {
      onSelect([]);
    } else {
      onSelect(data.map(item => item.id));
    }
  };

  const handleSelect = (id) => {
    if (selectedItems.includes(id)) {
      onSelect(selectedItems.filter(itemId => itemId !== id));
    } else {
      onSelect([...selectedItems, id]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {selectable && (
                <th className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-accent focus:ring-accent"
                  />
                </th>
              )}
              {columns.map(col => (
                <th key={col.key} className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                {selectable && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                      className="rounded border-gray-300 text-accent focus:ring-accent"
                    />
                  </td>
                )}
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4">
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune donnée à afficher</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;