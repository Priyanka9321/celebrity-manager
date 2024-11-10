import React, { useState, useEffect } from "react";
import { Celebrity } from "../types/celebrityTypes";
import CelebrityCard from "./CelebrityCard";

const CelebrityList: React.FC = () => {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch("./celebrity.json")
      .then((response) => response.json())
      .then((data) => setCelebrities(data));
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleAccordion = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredCelebrities = celebrities.filter((celebrity) =>
    `${celebrity.first} ${celebrity.last}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sortedCelebrities = [
    ...filteredCelebrities,
    ...celebrities.filter(
      (celebrity) =>
        !`${celebrity.first} ${celebrity.last}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    ),
  ];

  const handleDelete = (id: number) => {
    setCelebrities(celebrities.filter((celebrity) => celebrity.id !== id));
  };

  const handleEdit = (id: number, updatedCelebrity: Celebrity) => {
    setCelebrities(
      celebrities.map((celebrity) =>
        celebrity.id === id ? { ...celebrity, ...updatedCelebrity } : celebrity
      )
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 space-y-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white md:text-4xl">
        Celebrity Manager
      </h1>

      {/* Search Box */}
      <div className="relative w-full max-w-md mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full py-3 pl-10 pr-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Celebrity"
            value={searchTerm}
            onChange={handleSearch}
            required
          />
        </div>
      </div>

      {/* Celebrity List */}
      <div className="flex flex-col items-center justify-center w-full bg-gray-100 p-6 min-h-[500px]">

        <div className="flex flex-col items-center w-full">
          {sortedCelebrities.map((celebrity) => (
            <div
              key={celebrity.id}
              className="w-full max-w-lg flex justify-center"
            >
              <CelebrityCard
                celebrity={celebrity}
                isExpanded={celebrity.id === expandedId}
                onToggle={() => toggleAccordion(celebrity.id)}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CelebrityList;
