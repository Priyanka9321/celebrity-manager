import React, { useState, useEffect, useCallback } from "react";
import { Props } from "../types/celebrityTypes";
import { calculateAge } from "../utils/calculateAge"; // Adjust path if needed

const CelebrityCard: React.FC<Props> = ({
  celebrity,
  isExpanded,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [gender, setGender] = useState(celebrity.gender);
  const [country, setCountry] = useState(celebrity.country);
  const [description, setDescription] = useState(celebrity.description);
  const [isChanged, setIsChanged] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const age = calculateAge(celebrity.dob);
  const isAdult = age >= 18;

  const validateInput = useCallback(() => {
    const isCountryValid = /^[a-zA-Z\s]*$/.test(country);
    const isDescriptionValid = description.trim() !== "";
    setIsValid(isCountryValid && isDescriptionValid);
  }, [country, description]);

  useEffect(() => {
    validateInput();
  }, [validateInput]);

  const handleInputChange = () => {
    setIsChanged(
      gender !== celebrity.gender ||
        country !== celebrity.country ||
        description !== celebrity.description
    );
  };

  const handleSave = () => {
    if (isAdult && isChanged && isValid) {
      const updatedCelebrity = { ...celebrity, gender, country, description };
      onEdit(celebrity.id, updatedCelebrity);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setGender(celebrity.gender);
    setCountry(celebrity.country);
    setDescription(celebrity.description);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(celebrity.id);
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = () => setIsDeleteDialogOpen(true);
  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);

  return (
    // Card styling
    <div className="bg-white border border-gray-300 rounded-lg p-4 my-4 transition-shadow shadow hover:shadow-lg w-full max-w-md box-border flex flex-col">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => !isEditing && onToggle()}
      >
        <img
          src={celebrity.picture}
          alt={`${celebrity.first} ${celebrity.last}`}
          className="rounded-full w-12 h-12 mr-3"
        />
        <h3 className="text-lg font-medium flex-1">{`${celebrity.first} ${celebrity.last}`}</h3>
        <span className="text-2xl text-gray-600">{isExpanded ? "-" : "+"}</span>
      </div>

      {isExpanded && (
        <div className="mt-5 flex flex-col">
          <p className="text-sm mb-2">Age: {age}</p>
          {isEditing ? (
            <>
              <label className="block font-semibold mt-3 mb-1 text-gray-800">
                Gender:
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm mb-4 focus:outline-none focus:border-blue-500"
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  handleInputChange();
                }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
                <option value="Rather not say">Rather not say</option>
                <option value="Other">Other</option>
              </select>

              <label className="block font-semibold mt-3 mb-1 text-gray-800">
                Country:
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm mb-4 focus:outline-none focus:border-blue-500"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  handleInputChange();
                }}
              />
              {!isValid && (
                <p className="text-red-600 text-sm mb-4">
                  Country must only contain letters.
                </p>
              )}

              <label className="block font-semibold mt-3 mb-1 text-gray-800">
                Description:
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md text-sm mb-4 focus:outline-none focus:border-blue-500 min-h-[80px] resize-y overflow-auto"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  handleInputChange();
                }}
              />
              {isEditing && !isValid && description.trim() === "" && (
                <p className="text-red-600 text-sm mb-4">
                  Description cannot be empty.
                </p>
              )}

              <div className="flex gap-3 justify-end mt-3 w-full">
                <button
                  disabled={!isChanged || !isValid}
                  onClick={handleSave}
                  className={`px-4 py-2 rounded-md font-semibold transition-all ${
                    !isChanged || !isValid
                      ? "bg-blue-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-900 text-white"
                  }`}
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-md font-semibold bg-gray-500 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm mb-3">Gender: {celebrity.gender}</p>
              <p className="text-sm mb-3">Country: {celebrity.country}</p>
              <p className="text-sm mb-4">
                Description: {celebrity.description}
              </p>
              {isAdult && (
                <div className="flex gap-3 justify-end mt-4 w-full">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 rounded-md font-semibold bg-green-500 text-white hover:bg-green-600 w-auto"
                  >
                    Edit
                  </button>
                  <button
                    onClick={openDeleteDialog}
                    className="px-4 py-2 rounded-md font-semibold bg-red-500 text-white hover:bg-red-600 w-auto"
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg text-center w-72">
            <h3>
              Are you sure you want to delete {celebrity.first} {celebrity.last}
              ?
            </h3>
            <div className="flex gap-3 justify-center mt-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md font-semibold bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={closeDeleteDialog}
                className="px-4 py-2 rounded-md font-semibold bg-green-500 text-white hover:bg-green-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CelebrityCard;
