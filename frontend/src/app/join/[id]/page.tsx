import React from "react";
import login from "../../../images/login.png";
import Image from "next/image";
import upload from "../../../images/upload.png";
import doodle from "../../../images/doodle.png";
import { Button } from "../../components/ui/button";
import elephant from "../../../images/elephant.jpeg";

const Page: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-start px-4 py-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="text-center">
        <a
          href={elephant.src}
          download="elephant.jpeg"
          className="text-lg font-bold text-blue-600 hover:text-blue-800"
        >
          Download this image
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col items-center space-y-2">
          <Image
            src={login}
            alt="Step 1"
            className="w-48 h-24 rounded-md border border-gray-300"
          />
          <p className="text-sm text-gray-700 text-center">
            Step 1: Login to figma
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Image
            src={upload}
            alt="Step 2"
            className="w-48 h-24 rounded-md border border-gray-300"
          />
          <p className="text-sm text-gray-700 text-center">
            Step 2: Upload the downloaded image
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Image
            src={doodle}
            alt="Step 3"
            className="w-48 h-24 rounded-md border border-gray-300"
          />
          <p className="text-sm text-gray-700 text-center">
            Step 3: Unleash your creativity and take a screenshot
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <label
          htmlFor="file-upload"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Upload screenshot here
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="w-full max-w-sm flex items-center justify-center">
        <Button
          variant="primary"
          className="hover:text-white relative inline-flex p-1 mb-2 me-2 overflow-hidden text-base font-extrabold border-gray-600 hover:bg-gray-700 w-1/2 bg-gray-200"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Page;
