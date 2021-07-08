import React from "react";

interface IConfirmPixelProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  onConfirmed: () => void;
}

export const ConfirmPixelDialogue: React.FC<IConfirmPixelProps> = (props) => {
  return props.showModal ? (
    <>
      <div
        className="absolute  w-full h-full flex justify-center items-center"
        onClick={() => props.setShowModal(false)}>
        <div className="animate__animated animate__zoomIn animate__faster max-w-lg p-5 relative mx-auto my-2 rounded-xl shadow-2xl  bg-white ">
          <div className="">
            <div className="text-center p-5 flex-auto justify-center">
              <h2 className="text-xl font-bold py-4 ">
                Confirm purchase for 1.75 ONE ?
              </h2>
              <p className="text-sm text-gray-500 px-8">
                The selected pixel (647,531) costs <b>1.75 ONE</b> Do you want
                to continue the purchase?
              </p>
            </div>

            <div className="p-3  mt-2 text-center space-x-4 md:block">
              <button className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">
                Cancel
              </button>
              <button className="mb-2 md:mb-0 bg-green-400 border border-green-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-600" onClick={props.onConfirmed}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
};

ConfirmPixelDialogue.defaultProps = {
  showModal: false,
};
