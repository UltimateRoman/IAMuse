"use client";
import Link from "next/link";
import React, { useState } from "react";
import login from "../../../images/login.png";
import Image from "next/image";
import upload from "../../../images/upload.png";
import doodle from "../../../images/doodle.png";
import { Button } from "../../components/ui/button";
import elephant from "../../../images/elephant.jpeg";
import { create } from "@web3-storage/w3up-client";

const Page: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string>("");
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [cid, setCID] = useState(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log("file");
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please upload a file before submitting.");
      return;
    }
    setShowEmailPrompt(true);
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      const client = await create();
      // @ts-ignore
      const account = await client.login(email);
      await account.plan.wait();
      const space = await client.createSpace("my-awesome-space", { account });

      console.log("Space created:", space);

      const files = [selectedFile];
      //@ts-ignore
      const imageCID = await client.uploadDirectory(files);

      console.log("File uploaded successfully. Image CID:", imageCID);
      alert(`File uploaded successfully. Image CID: ${imageCID}`);
      //@ts-ignore
      setCID(imageCID)
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file. Please try again.");
    }
  };


  return (
    <div className="flex flex-col items-center w-full justify-start px-4 py-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex w-full justify-end items-center mb-8 sm:mb-12">
          <div className="flex justify-end items-center">
            <Link
              href="/"
              className="relative inline-flex items-center justify-center p-1 mb-2 me-2 overflow-hidden text-base font-extrabold text-gray-900 rounded-full group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white hover:text-white rounded-full group-hover:bg-opacity-0">
                Home
              </span>
            </Link>
          </div>
        </div>
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
          onChange={handleFileChange}
          className="block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      {showEmailPrompt ? (
        <div className="w-full max-w-sm flex flex-col items-center space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <Button
            onClick={handleEmailSubmit}
            variant="primary"
            className="hover:text-white relative inline-flex p-1 mb-2 overflow-hidden text-base font-extrabold border-gray-600 hover:bg-gray-700 w-1/2 bg-gray-200"
          >
            Upload File
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-sm flex items-center justify-center">
          <Button
            onClick={handleSubmit}
            variant="primary"
            className="hover:text-white relative inline-flex p-1 mb-2 me-2 overflow-hidden text-base font-extrabold border-gray-600 hover:bg-gray-700 w-1/2 bg-gray-200"
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;
