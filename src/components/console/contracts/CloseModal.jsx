import React from "react";

const CloseModal = ({ closeModal, closeDeleteModal, confirmDeleteBlog }) => {
  return (
    <>
      {closeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to delete this blog?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBlog}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CloseModal;

